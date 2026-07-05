import { component$, useSignal, useTask$, $ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import type { DocumentHead } from '@builder.io/qwik-city';
import styles from './work-with-us.module.css';

const SERVICE_CONFIG: Record<string, { name: string; hints: string[] }> = {
  'autonomous-navigation': {
    name: 'Autonomous Navigation Architecture',
    hints: [
      'Platform type (aerial UAS, ground vehicle, marine, or fixed sensor network)',
      'Area of operations and terrain',
      'Signals the system cannot rely on (GPS, RF comms, visual, or all of the above)',
      'Sensors available or planned onboard',
      'Maximum acceptable position error in your operational context',
      'Any certifications or authority-to-operate requirements',
      'Timeline to field testing',
    ],
  },
  'digital-twin': {
    name: 'Simulation & Digital Twin Development',
    hints: [
      'The physical system being modeled',
      'Intended use (training, validation, or operator rehearsal)',
      'Physics domains that matter most (rigid body, aerodynamics, electromagnetics, thermal, fluid)',
      'Fidelity required for sim-to-real transfer',
      'Hardware the trained system will ultimately run on',
      'Timeline to a validated simulation environment',
    ],
  },
  'edge-ai': {
    name: 'AI Model Design for Edge Deployment',
    hints: [
      'Task the model will perform (classification, detection, regression, or sequence prediction)',
      'Target compute platform (FPGA, ARM Cortex, RISC-V, or custom ASIC)',
      'Power budget and latency constraints',
      'Data available and approximate volume',
      'Acceptable accuracy tradeoff against compute cost',
      'Timeline to a deployable model',
    ],
  },
  'enterprise-ai': {
    name: 'Enterprise AI Strategy & Integration',
    hints: [
      'Business process being automated or augmented',
      'Data that process generates and where it currently lives',
      'What success looks like at 90 days',
      'Systems the AI output needs to integrate with',
      'Data privacy and compliance constraints',
      'Timeline to production',
    ],
  },
  'data-analysis': {
    name: 'Complex Data Analysis & Insights',
    hints: [
      'Domain (semiconductor metrology, logistics, finance, operations, or other)',
      'Specific question you are trying to answer with the data',
      'Data format, volume, and where it lives',
      'Decisions the analysis will directly inform',
      'Who consumes the output (executive, operator, or automated system)',
      'Timeline for the analysis deliverable',
    ],
  },
  'feasibility': {
    name: 'Feasibility Studies & Simulation Prototyping',
    hints: [
      'Concept being evaluated',
      'Specific hypothesis to be tested',
      'Physical or computational constraints that bound the question',
      'What a passing result looks like and what a failing result looks like',
      'Whether this supports a grant application, investment decision, or procurement',
      'Timeline for the feasibility deliverable',
    ],
  },
  'system-architecture': {
    name: 'Full-Stack System Architecture',
    hints: [
      'Current stack (languages, frameworks, cloud provider, hardware platform)',
      'What you are building and who uses it',
      'Lead time before your proof of concept is due',
      'Security audit timeline and applicable frameworks (SOC 2, FedRAMP, CMMC, NIST 800-53, ISO 27001)',
      'Verification and validation timeline for transfer into operational infrastructure',
      'Intended operational scale (users, transaction volume, data volume)',
      'Integrations the architecture needs to support',
      'Uptime, latency, and disaster recovery requirements',
    ],
  },
};


const steps = [
  {
    number: '01',
    title: 'Tell us what you need',
    body: 'Send a brief description of your challenge. No obligation. We will read it and tell you honestly whether we can help.',
  },
  {
    number: '02',
    title: 'Free consultation',
    body: 'If there is a fit, we schedule a direct conversation with just you and the engineer who will actually do the work. We assess scope, timeline, and feasibility together.',
  },
  {
    number: '03',
    title: 'Engagement agreement',
    body: 'We agree on deliverables, timeline, and rate. No subcontractors, no hand-offs. You get direct access to the person solving your problem.',
  },
  {
    number: '04',
    title: 'Real-time workspace access',
    body: 'Once engaged, you get access to a private workspace where you receive live updates as work progresses. You always know exactly where your project stands.',
  },
];

export default component$(() => {
  const loc = useLocation();
  const slug = useSignal(loc.url.searchParams.get('service') ?? '');
  const serviceConfig = SERVICE_CONFIG[slug.value] ?? null;

  const firstName = useSignal('');
  const lastName = useSignal('');
  const email = useSignal('');
  const message = useSignal('');
  const hintValues = useSignal<string[]>([]);
  const submitted = useSignal(false);
  const submitting = useSignal(false);
  const errorMsg = useSignal('');

  useTask$(({ track }) => {
    const search = track(() => loc.url.search);
    slug.value = new URLSearchParams(search).get('service') ?? '';
  });

  useTask$(({ track }) => {
    track(() => slug.value);
    firstName.value = '';
    lastName.value = '';
    email.value = '';
    message.value = '';
    hintValues.value = [];
    submitted.value = false;
    errorMsg.value = '';
  });

  const updateHint = $((e: InputEvent) => {
    const target = e.target as HTMLTextAreaElement;
    const idx = parseInt(target.dataset.idx ?? '0', 10);
    const next = [...hintValues.value];
    while (next.length <= idx) next.push('');
    next[idx] = target.value;
    hintValues.value = next;
  });

  const handleSubmit = $(async (e: SubmitEvent) => {
    e.preventDefault();
    submitting.value = true;
    errorMsg.value = '';

    const cfg = SERVICE_CONFIG[slug.value] ?? null;
    const payload: Record<string, string> = {
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      message: message.value,
    };
    if (cfg) payload['service'] = cfg.name;

    if (cfg) {
      const lines = cfg.hints
        .map((hint, i) => {
          const val = (hintValues.value[i] ?? '').trim();
          return val ? `${hint}:\n${val}` : null;
        })
        .filter(Boolean);
      if (lines.length) payload['additional_context'] = (lines as string[]).join('\n\n');
    }

    try {
      const res = await fetch('https://formspree.io/f/xbjnryey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        submitted.value = true;
      } else {
        errorMsg.value = 'Submission failed. Please try again or email directly.';
      }
    } catch {
      errorMsg.value = 'A network error occurred. Please try again.';
    } finally {
      submitting.value = false;
    }
  });

  return (
    <div class={styles.page}>

      <section class={styles.hero}>
        <div class={styles.heroInner}>
          <h1>The Future of Automation Starts With Your Data</h1>
          <p class={styles.heroSub}>
            Do you have a difficult, sensitive, or repetitive task that demands your most capable people?
            Q2 Computing turns the operational data from your daily workflows into automation that
            liberates your best minds for the work only they can do.
          </p>
        </div>
      </section>

      <section class={styles.process}>
        <div class={styles.container}>
          <h2>How an engagement works</h2>
          <p class={styles.sectionSub}>Direct, transparent, and built around your timeline.</p>
          <div class={styles.steps}>
            {steps.map((s) => (
              <div key={s.number} class={styles.step}>
                <span class={styles.stepNumber}>{s.number}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section class={styles.formSection}>
        <div class={styles.container}>

          {serviceConfig && (
            <p class={styles.serviceLabel}>
              Inquiring about: <strong>{serviceConfig.name}</strong>
            </p>
          )}

          <h2>{serviceConfig ? 'Start the conversation' : 'Work With Us'}</h2>
          <p class={styles.sectionSub}>
            Tell us what you are working on. We will read it and get back to you directly.
          </p>

          {submitted.value ? (
            <div class={styles.successMsg}>
              <h3>Got it. We will be in touch.</h3>
              <p>Expect a direct response from Justin, not a form letter.</p>
            </div>
          ) : (
            <form class={styles.form} preventdefault:submit onSubmit$={handleSubmit}>

              <div class={styles.fieldRow}>
                <div class={styles.fieldGroup}>
                  <label for="first_name">First name</label>
                  <input
                    id="first_name"
                    type="text"
                    required
                    value={firstName.value}
                    onInput$={(e) => (firstName.value = (e.target as HTMLInputElement).value)}
                  />
                </div>
                <div class={styles.fieldGroup}>
                  <label for="last_name">Last name</label>
                  <input
                    id="last_name"
                    type="text"
                    required
                    value={lastName.value}
                    onInput$={(e) => (lastName.value = (e.target as HTMLInputElement).value)}
                  />
                </div>
              </div>

              <div class={styles.fieldGroup}>
                <label for="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email.value}
                  onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
                />
              </div>

              <div class={styles.fieldGroup}>
                <label for="message">What are you working on?</label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  value={message.value}
                  onInput$={(e) => (message.value = (e.target as HTMLTextAreaElement).value)}
                />
              </div>

              {serviceConfig && (
                <div class={styles.optionalBlock}>
                  <p class={styles.optionalHeading}>If you want to share more now, we will come prepared. None of this is required.</p>
                  {serviceConfig.hints.map((hint, i) => (
                    <div key={hint} class={styles.fieldGroup}>
                      <label>
                        {hint} <span class={styles.optionalTag}>(optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        data-idx={String(i)}
                        value={hintValues.value[i] ?? ''}
                        onInput$={updateHint}
                      />
                    </div>
                  ))}
                </div>
              )}

              {errorMsg.value && <p class={styles.errorMsg}>{errorMsg.value}</p>}

              <button type="submit" class={styles.submitBtn} disabled={submitting.value}>
                {submitting.value ? 'Sending...' : 'Send'}
              </button>

            </form>
          )}
        </div>
      </section>

    </div>
  );
});

export const head: DocumentHead = {
  title: 'Work With Us | Q2 Computing',
  meta: [
    {
      name: 'description',
      content: 'Q2 Computing turns operational data into automation that liberates your best people from repetitive work. Direct engineering engagement, no hand-offs.',
    },
  ],
};
