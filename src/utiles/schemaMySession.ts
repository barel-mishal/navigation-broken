import { z } from "@builder.io/qwik-city";

export const schemaMySession = z.object({
    database: z.object({
        token: z.string(),
        email: z.string(),
        name: z.string(),
        picture: z.string(),
        iat: z.number(),
        exp: z.number(),
        jti: z.string(),
    }),
    user: z.object({
        name: z.string(),
        email: z.string(),
        image: z.string(),
    }),
    expires: z.string(),
  })