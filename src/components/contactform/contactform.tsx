import { component$, useStore, $, QRL } from '@builder.io/qwik';
import styles from "./contactform.module.css";

export const ContactForm = component$(() => {
  const formState = useStore({
    first_name: '',
    last_name: '',
    email: '',
    message: '',
    isSubmitted: false,
    error: '',
  });

  const updateField$ = $((fieldName: keyof typeof formState, event: Event) => {
    const input = event.target as HTMLInputElement;
    formState[fieldName] = input.value;
  });


  const handleSubmit$ = $(async () => {
    // ... (your handleSubmit$ logic remains exactly the same)
    formState.error = '';

    if (!formState.first_name || !formState.last_name || !formState.email || !formState.message) {
      formState.error = 'Please fill out all fields.';
      return;
    }

    try {
      const response = await fetch("https://formspree.io/f/xbjnryey", { // <-- PASTE YOUR URL HERE
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          firstName: formState.first_name,
          lastName: formState.last_name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (response.ok) {
        formState.first_name = '';
        formState.last_name = '';
        formState.email = '';
        formState.message = '';
        formState.isSubmitted = true;
      } else {
        formState.error = 'Oops! There was a problem submitting your form.';
      }
    } catch (error) {
      formState.error = 'Network error. Please try again later.';
    }
  });

  return (
    <div class={styles["contact-form-wrapper"]}>
      {formState.isSubmitted ? (
        <div class="success-message">
          <h3>Thank you for your message!</h3>
          <p>We'll get back to you shortly.</p>
          <button onClick$={() => formState.isSubmitted = false}>Send Another</button>
        </div>
      ) : (
        <form class={styles["form"]} preventdefault:submit$={handleSubmit$}>
          <div class={styles["form-group"]}>
            <label for="first_name">First Name</label>
            <input
              id="first_name"
              type="text"
              class={styles["form-input"]}
              value={formState.first_name}
              onInput$={(e) => updateField$('first_name', e)}
              required
            />
          </div>
          <div class={styles["form-group"]}>
            <label for="last_name">Last Name</label>
            <input
              id="last_name"
              type="text"
              class={styles["form-input"]}
              value={formState.last_name}
              onInput$={(e) => updateField$('last_name', e)}
              required
            />
          </div>
          <div class={styles["form-group"]}>
            <label for="email">Email Address</label>
            <input
              id="email"
              type="email"
              class={styles["form-input"]}
              value={formState.email}
              onInput$={(e) => updateField$('email', e)}
              required
            />
          </div>
          <div class={styles["form-group"]}>
            <label for="message">Message</label>
            <textarea
              id="message"
              rows={5}
              value={formState.message}
              class={styles["form-input"]}
              onInput$={(e) => updateField$('message', e)}
              required
            ></textarea>
          </div>
          
          {formState.error && <p class={styles["error-message"]}>{formState.error}</p>}

          <button type="submit" class={styles["submit-btn form-input"]}>
            Send It!
          </button>
        </form>
      )}
    </div>
  );
});