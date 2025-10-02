import { component$ } from '@builder.io/qwik';
import { z, type Input } from 'zod';
import { useForm, formAction$, zodForm$ } from '@modular-forms/qwik';

// This becomes the single source of truth for your form's data and rules.
const ContactSchema = z.object({
  first_name: z.string().min(1, 'Please enter your first name.'),
  last_name: z.string().min(1, 'Please enter your last name.'),
  email: z.string().email('The email address is badly formatted.'),
  message: z.string().min(1, 'Please enter a message.'),
});

// Define a type for the form data based on the schema
type ContactForm = Input<typeof ContactSchema>;

// This server function handles validation and the submission logic.
export const useFormAction = formAction$<ContactForm>(async (values) => {
  // Runs on the server
  try {
    const response = await fetch("https://formspree.io/f/xbjnryey", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        firstName: values.first_name,
        lastName: values.last_name,
        email: values.email,
        message: values.message,
      }),
    });

    if (response.ok) {
      return {
        status: 'success',
        message: 'Your message has been sent successfully!',
      };
    } else {
       return {
        status: 'error',
        message: 'Oops! There was a problem submitting your form.',
      }
    }
  } catch (error) {
     return {
        status: 'error',
        message: 'Network error. Please try again later.',
      }
  }
// 3. Use the `zodForm$` adapter from Modular Forms
}, zodForm$(ContactSchema));


export const ContactForm = component$(() => {
  // Use the useForm hook to manage the form state
  const [contactForm, { Form, Field }] = useForm<ContactForm>({
    loader: {
      value: {
        first_name: '',
        last_name: '',
        email: '',
        message: ''
      }
    },
    action: useFormAction(),
  });

  return (
    <div>
      {/* Use the <Form> component */}
      <Form>
        {contactForm.response.status === 'success' ? (
          // Success View
          <div>
            <h3>Thank you!</h3>
            <p>{contactForm.response.message}</p>
          </div>
        ) : (
          // Form View
          <div>
            <h3>Contact Us</h3>
            
            {/* Use the <Field> component for each input */}
            <Field name="first_name">
              {(field, props) => (
                <div>
                  <label for={field.name}>First Name</label>
                  <input {...props} id={field.name} type="text" value={field.value} />
                  {field.error && <div style="color: red;">{field.error}</div>}
                </div>
              )}
            </Field>

            <Field name="last_name">
              {(field, props) => (
                <div>
                  <label for={field.name}>Last Name</label>
                  <input {...props} id={field.name} type="text" value={field.value} />
                  {field.error && <div style="color: red;">{field.error}</div>}
                </div>
              )}
            </Field>

            <Field name="email">
              {(field, props) => (
                <div>
                  <label for={field.name}>Email Address</label>
                  <input {...props} id={field.name} type="email" value={field.value} />
                  {field.error && <div style="color: red;">{field.error}</div>}
                </div>
              )}
            </Field>

            <Field name="message">
              {(field, props) => (
                <div>
                  <label for={field.name}>Message</label>
                  <textarea {...props} id={field.name} rows={5} value={field.value} />
                  {field.error && <div style="color: red;">{field.error}</div>}
                </div>
              )}
            </Field>

            {/* Display general form submission errors */}
            {contactForm.response.status === 'error' && (
              <p style="color: red;">{contactForm.response.message}</p>
            )}

            <button type="submit">Send It!</button>
          </div>
        )}
      </Form>
    </div>
  );
});

