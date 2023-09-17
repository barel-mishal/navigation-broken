import { component$, Slot } from "@builder.io/qwik";
import { Form, routeLoader$ } from "@builder.io/qwik-city";
import Header from "~/components/header/Header";
import { useAuthSession, useAuthSignout } from "./plugin@auth";

export default component$(() => {
  const authSignOut = useAuthSignout();
  const session = useAuthSession();
  // useContextProvider(AuthSessionContext, session);
  return (
    <div class={"min-h-screen bg-sky-200"}>
      {session.value?.expires && <Form  action={authSignOut} autoCorrect="">
        <button class={"p-3 rounded-md bg-sky-800 m-2 text-sky-50"} type="submit">
          SignOut
        </button>
      </Form>}
      <Header userName={session.value?.user?.name} />
      <main class={``}>
        <Slot />
      </main>
      <aside></aside>
      <footer></footer>
    </div>
  );
});

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString(),
  };
});


// export const AuthSessionContext = createContextId<AuthSession>("AuthSession");
// export const AuthenticateComponent = component$(() => {
//   const auth = useContext(AuthSessionContext);
//   return <Fragment key={'AuthenticateComponent'}>
//     {auth.value && <Slot />}
//   </Fragment>
// });
