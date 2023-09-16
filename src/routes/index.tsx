import { component$ } from '@builder.io/qwik';
import { Link, type DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <>
    <div class={'w-screen grid place-content-center text-3xl '}>
      <Link class={'first-letter:uppercase first-letter:text-5xl text-sky-600 italic'} href='/laxical-scope'>first move from this link to a page</Link>
    </div>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
