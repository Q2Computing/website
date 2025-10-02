import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { ContactForm } from '../../components/contactform/contactform';

export default component$(() => {
  return (
    <div>
      <h1>Let's Build the Future of Resilient Autonomy</h1>
      <h2>Q2-Computing is pioneering "object-blind" navigation to solve the critical challenge of operating in unreliable environments. If your objective is to fund groundbreaking research that provides a true strategic advantage for civilian or defense applications, our work will be of interest. Reach out to schedule a technical brief.</h2>
      <h3>Send us a message with our contact form</h3>
      <ContactForm />
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