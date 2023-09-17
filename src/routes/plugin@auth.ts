import { serverAuth$ } from '@builder.io/qwik-auth';
import Google from '@auth/core/providers/google';
import type { Provider } from '@auth/core/providers';
import { type Profile } from '@auth/core/types';
import { Surreal } from "surrealdb.js"; 
import { type JWT } from '@auth/core/jwt';

/**
 * Auth Configuration
 * Includes functions and configuration used to create authentication functionality.
 */
export const { 
  onRequest, 
  useAuthSession, 
  useAuthSignin, 
  useAuthSignout 
} = serverAuth$(({ env }) => {
  // Ensure all environment variables are set
  const envs = {
    AUTH_SECRET: env.get('AUTH_SECRET')!,
    GOOGLE_CLIENT_ID: env.get('GOOGLE_CLIENT_ID')!,
    GOOGLE_API_KEY: env.get('GOOGLE_CLIENT_SECRET')!,
    ROUTE: env.get('ROUTE')!,
    NAMESPACE: env.get('NAMESPACE')!,
    DATABASE: env.get('DATABASE')!,
    USER_DATABASE: env.get('USER_DATABASE')!,
    DATABASE_PASSWORD: env.get('DATABASE_PASSWORD')!,
    DATABASE_SCOPE: env.get('DATABASE_SCOPE')!,
  };
  if (!Object.values(envs).every(Boolean)) {
    throw new Error(`Missing envs: ${Object.entries(envs).filter(([, v]) => !v).map(([k]) => k).join(', ')}`);
  }
  return {
    pages: { error: "/login" },
    secret: envs.AUTH_SECRET,
    trustHost: true,
    providers: [
      Google({ 
        clientId: envs.GOOGLE_CLIENT_ID, 
        clientSecret: envs.GOOGLE_API_KEY, 
      }),
    ] as Provider[],
    callbacks: {
      jwt: async ({ account, token, profile, trigger  }) => {
        if (trigger === "signIn") {
          const p = profile as Profile;
          const payload = {
            SC: envs.DATABASE_SCOPE, 
            DB: envs.DATABASE, 
            NS: envs.NAMESPACE, 
            email: p.email,
            pass: [p.sub, p.email, account?.provider].join(''), 
            role: "User", 
            first_name: p.given_name, 
            last_name: p.family_name,
            user_name: p.nickname || p.name, 
          }
          const db = new Surreal();
          await db.connect(envs.ROUTE, {
            auth: {
              user: envs.USER_DATABASE,
              pass: envs.DATABASE_PASSWORD,
            }, 
            db: envs.DATABASE,
            ns: envs.NAMESPACE
          });
          const dbToken = await db.signup(payload);

          const result: JWT = {
            token: dbToken, 
            email: p.email,
            name: p.name,
            picture: p.picture,          
          }
          return result;
        } 
        const myToken = token as { token: string };
        const db = new Surreal();
        await db.connect(envs.ROUTE, {
          auth: {
            user: envs.USER_DATABASE,
            pass: envs.DATABASE_PASSWORD,
          }, 
          db: envs.DATABASE,
          ns: envs.NAMESPACE
        });
        await db.authenticate(myToken.token);
        return token
      },

      session: ({ token, session }) => {
        return {
          database: token,
          ...session
        };
      },
    }
  }
});

export type AuthSession = ReturnType<typeof useAuthSession>;


