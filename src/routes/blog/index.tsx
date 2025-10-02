import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { ContactForm } from '../../components/contactform/contactform';

export default component$(() => {
  return (
    <div class="container container-center">
      <h1>Blog Page</h1>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Contact Us',
  meta: [
    {
      name: 'description',
      content: 'Get in touch with us through our contact page.',
    },
  ],
};