import { component$ } from '@builder.io/qwik';
import { useForm, valiForm$ } from '@modular-forms/qwik';

// Import the server functions and types from the route file
import {
  type ContactForm,
  useFormLoader,
  useFormAction,
  ContactSchema,
} from '../../routes/contact/index';

// This component now contains all the UI and form state logic.
export const ContactFormComponent = component$(() => {
  const [contactForm, { Form, Field }] = useForm<ContactForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(ContactSchema),
  });

  return (
    <div>
      {contactForm.response.status === 'success' ? (
        <div>
          <h3>Thank You!</h3>
          <p>{contactForm.response.message}</p>
        </div>
      ) : (
        <Form>
          <Field name="first_name">
            {(field, props) => (
              <div>
                <label for={field.name}>First Name</label>
                <input {...props} type="text" />
                {field.error && <div>{field.error}</div>}
              </div>
            )}
          </Field>
          <Field name="last_name">
            {(field, props) => (
              <div>
                <label for={field.name}>Last Name</label>
                <input {...props} type="text" />
                {field.error && <div>{field.error}</div>}
              </div>
            )}
          </Field>
          <Field name="email">
            {(field, props) => (
              <div>
                <label for={field.name}>Email</label>
                <input {...props} type="email" />
                {field.error && <div>{field.error}</div>}
              </div>
            )}
          </Field>
          <Field name="message">
            {(field, props) => (
              <div>
                <label for={field.name}>Message</label>
                <textarea {...props} rows={5} />
                {field.error && <div>{field.error}</div>}
              </div>
            )}
          </Field>
          <button type="submit">Send It!</button>
          {contactForm.response.status === 'error' && (
            <p style="color: red;">{contactForm.response.message}</p>
          )}
        </Form>
      )}
    </div>
  );
});