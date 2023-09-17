import { component$ } from "@builder.io/qwik";
import { useAuthSession } from "../plugin@auth";
import { type Session } from "@auth/core/types";
import { type RequestHandler } from "@builder.io/qwik-city";

export const onRequest: RequestHandler = (event) => {
    const session: Session | null = event.sharedMap.get('session');
    if (!session || new Date(session.expires) < new Date()) {
        throw event.redirect(302, '/login');
    }
    return 
  };

export default component$(() => {
    const auth = useAuthSession();
    return <div class={'lg:mx-auto lg:max-w-screen-xl mt-5 px-2'}>
        <h1 class={'flex gap-2 text-3xl font-bold text-sky-950'}><span>ברוך הבא</span><span>{auth.value?.user?.name}</span></h1>
        
    </div>
});