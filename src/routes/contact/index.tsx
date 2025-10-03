import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { InitialValues } from '@modular-forms/qwik';
import { formAction$, valiForm$ } from '@modular-forms/qwik';
import * as v from 'valibot';
import { ContactFormComponent } from '../../components/contactform/contactform';

// 1. All validation and type definitions live on the route.
export const ContactSchema = v.object({
  first_name: v.pipe(v.string(), v.nonEmpty('Please enter your first name.')),
  last_name: v.pipe(v.string(), v.nonEmpty('Please enter your last name.')),
  email: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.')
  ),
  message: v.pipe(v.string(), v.nonEmpty("What's on your mind?")),
});

export type ContactForm = v.InferInput<typeof ContactSchema>;

// 2. The routeLoader$ provides initial values for the form.
export const useFormLoader = routeLoader$<InitialValues<ContactForm>>(() => ({
  first_name: '',
  last_name: '',
  email: '',
  message: '',
}));

// 3. The formAction$ handles the server-side submission logic.
export const useFormAction = formAction$<ContactForm>(async (values) => {
  try {
    const response = await fetch("https://formspree.io/f/xbjnryey", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(values),
    });
    if (response.ok) {
      return { status: 'success', message: 'Your message has been sent!' };
    }
    return { status: 'error', message: 'Submission failed. Please try again.' };
  } catch {
    return { status: 'error', message: 'A network error occurred.' };
  }
}, valiForm$(ContactSchema));


// 4. The page component is now simplified to just render the UI component.
export default component$(() => {
  return (
    <div class="container container-center">
      <h1>Contact Us</h1>
      <p>Let's build the future, together. Reach out to start the conversation.</p>
      <ContactFormComponent />
    </div>
  );
});

