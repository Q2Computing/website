import { component$, useStyles$ } from '@builder.io/qwik';
import { useForm, valiForm$ } from '@modular-forms/qwik';

// Import the server functions and types from the route file
import {
  type ContactForm,
  useFormLoader,
  useFormAction,
  ContactSchema,
} from '../../routes/contact/index';

const styles = `
    .form-group {
      margin-bottom: 1.5rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }
    .form-group input, .form-group textarea {
      width: 50%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
      box-sizing: border-box; /* Ensures padding doesn't affect width */
    }
    .form-group input:focus, .form-group textarea:focus {
      outline: none;
      border-color: #007bff; /* Blue focus color */
    }
    .submit-btn {
      display: block;
      padding: 0.8rem 1.5rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .submit-btn:hover {
      background-color: #0056b3;
    }
    .field-error {
      color: #dc3545; /* Red for errors */
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .form-error {
      color: #dc3545;
      margin-top: 1rem;
      text-align: center;
      font-weight: bold;
    }
    .success-message {
      text-align: center;
      padding: 2rem;
      background-color: #f0f8ff;
      border: 1px solid #bde0fe;
      border-radius: 8px;
    }
    .success-message h3 {
      font-size: 1.5rem;
      color: #0056b3;
      margin-top: 0;
    }
  `;

export const ContactFormComponent = component$(() => {
  // Attach the styles to the component
  useStyles$(styles);

  const [contactForm, { Form, Field }] = useForm<ContactForm>({
    loader: useFormLoader(),
    action: useFormAction(),
    validate: valiForm$(ContactSchema),
  });

  return (
    <div>
      {contactForm.response.status === 'success' ? (
        <div class="success-message">
          <h3>Thank You!</h3>
          <p>{contactForm.response.message}</p>
        </div>
      ) : (
        <Form>
          <Field name="first_name">
            {(field, props) => (
              <div class="form-group">
                <label for={field.name}>First Name</label>
                <input {...props} type="text" />
                {field.error && <div class="field-error">{field.error}</div>}
              </div>
            )}
          </Field>
          <Field name="last_name">
            {(field, props) => (
              <div class="form-group">
                <label for={field.name}>Last Name</label>
                <input {...props} type="text" />
                {field.error && <div class="field-error">{field.error}</div>}
              </div>
            )}
          </Field>
          <Field name="email">
            {(field, props) => (
              <div class="form-group">
                <label for={field.name}>Email</label>
                <input {...props} type="email" />
                {field.error && <div class="field-error">{field.error}</div>}
              </div>
            )}
          </Field>
          <Field name="message">
            {(field, props) => (
              <div class="form-group">
                <label for={field.name}>Message</label>
                <textarea {...props} rows={5} />
                {field.error && <div class="field-error">{field.error}</div>}
              </div>
            )}
          </Field>
          <button type="submit" class="submit-btn">Send It!</button>
          {contactForm.response.status === 'error' && (
            <p class="form-error">{contactForm.response.message}</p>
          )}
        </Form>
      )}
    </div>
  );
});