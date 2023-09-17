import { type RequestHandler } from "@builder.io/qwik-city/middleware/request-handler";
import { Surreal } from "surrealdb.js";
import { type MySession } from "~/routes/layout-account";
import { type UserMeal } from "~/utiles/types_rust_bindings_fitness/UserMeal";

export const onGet: RequestHandler = async ({sharedMap, redirect, env}) => { 
    const session = sharedMap.get("session") as MySession;
    const db = new Surreal();
    await db.connect(env.get("ROUTE")!, {
      auth: session.database.token,
      ns: env.get('NAMESPACE')!,
      db: env.get('DATABASE')!,
    });
    const result: any = await db.query(`
    RETURN {
      DELETE UserMeal WHERE name = "";
      RETURN CREATE UserMeal CONTENT {};
    }
    `);

    if (result[0].status !== "OK") throw new Error("Error creating UserMeal");
    const userMeal = result[0].result[0] as UserMeal; 
    throw redirect(302, `/nutrition-playground/new-meal/${userMeal.id.split(":").at(-1)}`);
};