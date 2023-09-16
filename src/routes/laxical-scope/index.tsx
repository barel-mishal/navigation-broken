import { component$, useComputed$ } from "@builder.io/qwik";
import { Link, routeAction$, routeLoader$, useNavigate, z, zod$ } from "@builder.io/qwik-city";

export const useLoadSomething = routeLoader$(() => {
    return {
        myText: 'Some link'
    }
});

export const useMyAction = routeAction$((data) => {
    return {
        myText: data.myText
    }
}, zod$(z.object({
    myText: z.string(),
})));

export default component$(() => {
    const loaded = useLoadSomething();
    const action = useMyAction();
    const cumputeMyText = useComputed$(() => {
        return action.value?.myText || loaded.value?.myText;
    });
    const nav = useNavigate();
    return <div class={'grid place-content-center h-screen '}><div class={'bg-sky-100  rounded-md px-3 py-5 min-w-[400px] min-h-[200px] flex flex-col'}>
    <input type="text" class={'ring-1 ring-sky-900 px-2 py-4 rounded-md focus-within:ring-sky-700 focus-within:outline-none'} placeholder="Try write something" onInput$={(_, el) => {
        action.submit({
            myText: el.value
        })
    }} />
    <Link class={'first-letter:uppercase first-letter:text-2xl text-sky-900 italic'} href="/laxical-scope/my-scope">
        {cumputeMyText.value}
    </Link>
    
    <button class={'first-letter:uppercase first-letter:text-2xl text-rose-900 italic text-left'} onClick$={async (e, el) => {
        
        await action.submit({
            myText: el.value
        });

        if (action.isRunning || action.status !== 200) return;
        
        nav("/laxical-scope/my-scope")
    
    }}>
        {`Not working ${cumputeMyText.value} `}
    </button>

    <button class={'first-letter:uppercase first-letter:text-2xl text-green-900 italic text-left'} onClick$={async (e, el) => {
        
        await action.submit({
            myText: el.value
        });

        if (action.isRunning || action.status !== 200) return;
        console.log('nav');
        setTimeout( () => nav("/laxical-scope/my-scope"), 0 )
    
    }}>
        {cumputeMyText.value}
    </button>
</div></div>
});