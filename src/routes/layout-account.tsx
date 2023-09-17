import { component$, createContextId, Slot, useContextProvider, useSignal, useComputed$ } from "@builder.io/qwik";
import { Link, type RequestHandler, routeLoader$ } from "@builder.io/qwik-city";
import { Surreal } from "surrealdb.js";
import { type UserFoodRecord } from "~/utiles/types_rust_bindings_fitness/UserFoodRecord";
import { type UserPhysicalMetrics } from "~/utiles/types_rust_bindings_fitness/UserPhysicalMetrics";

export interface MySession {
  database: {
      token: string;
      email: string;
      name: string;
      picture: string;
      iat: number;
      exp: number;
      jti: string;
  };
  user: {
      name: string;
      email: string;
      image: string;
  };
  expires: string;
}

export const useDatabase = routeLoader$(async ({sharedMap}) => {
  const session = sharedMap.get("session") as MySession;
  return {
      key: {
          db: "fooditdatabase",
          ns: "fooditnamespace",
          auth: session.database.token
      },
      rpc: "http://127.0.0.1:8000/database_api/rpc/",
      session
  };
});

export const onRequest: RequestHandler = (event) => {
  const session: MySession | null = event.sharedMap.get('session');
  if (!session || new Date(session.expires) < new Date()) {
    throw event.redirect(302, `/login?callbackUrl=${event.url.pathname}`);
  }
};

export const useTempUserFoodsRecords = routeLoader$(async ({sharedMap, env}) => {
  const session = sharedMap.get("session") as MySession;
  const db = new Surreal();
  await db.connect(env.get("ROUTE")!, {
    auth: session.database.token,
    ns: env.get('NAMESPACE')!,
    db: env.get('DATABASE')!,
  });
  const result = await db.select('TempUserFoodRecord') as UserFoodRecordForDb[];
  return result.reduce((acc, curr) => {
      acc[curr.moh_food_id!] = curr;
      return acc;
  }, {} as Record<string, UserFoodRecord>) ;
});

export const useIngredientsAction = () => {
    const userFoodsRecords = useTempUserFoodsRecords();
    const session = useDatabase();
    const signalUserFoodsRecords = useSignal<Record<string, UserFoodRecord>>(userFoodsRecords.value || {});
    const signalUserFoodsHistory = useSignal<UserFoodRecord[]>([]);
    const person = useSignal<(Partial<UserPhysicalMetrics>)[]>([]);
    const countItems = useComputed$(() => {
      return Object.keys(signalUserFoodsRecords.value).length;
    });
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const computeSelectedItems = useComputed$(() => {
      return Object.keys(signalUserFoodsRecords.value)
    });
    return {
        userFoodsRecords: signalUserFoodsRecords,
        userFoodsHistory: signalUserFoodsHistory,
        countItems,
        timezone,
        person,
        session,
        computeSelectedItems
    }
}

export default component$(() => {
    const items = useIngredientsAction()
    useContextProvider(userSelectedFoods, items);
    return (
        <div class={"min-h-screen bg-sky-300 flex flex-col"}>
            <nav class={'flex justify-between p-2 flex-row-reverse font-bold text-sky-950'}><Link href="/">FoodIt</Link><h1 class={''}>התזונה שלי</h1></nav>
            <main class={`flex-grow `}>
                <Slot />
            </main>
            <footer class={'h-56'}></footer>
        </div>
    );
});

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});


export type UserIngredientsContextType = ReturnType<typeof useIngredientsAction>

export const userSelectedFoods = createContextId<UserIngredientsContextType>("ingredientsPlaygroundContextId");


export interface UserFoodRecordForDb extends UserFoodRecord {
  [key: string]: any;
}
export interface UserPhysicalMetricsForDb extends UserPhysicalMetrics {
  [key: string]: any;
}
export interface QueryResultUserFoodRecordForDb {
  '(SELECT * FROM TempUserFoodRecord)': UserFoodRecordForDb[];
}

export interface ResponseUserFoodRecord {
  time: string;
  status: string;
  result: QueryResultUserFoodRecordForDb[];
}
