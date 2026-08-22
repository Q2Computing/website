import { component$, useSignal, useTask$, useVisibleTask$, $ } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

// Cloudflare Turnstile site key.
// Replace with your real key from dash.cloudflare.com > Turnstile.
// The value below is the test key that always passes, safe to keep in dev/preview.
const TURNSTILE_SITE_KEY = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA';
import type { DocumentHead } from '@builder.io/qwik-city';
import styles from './work-with-us.module.css';

const SERVICE_CONFIG: Record<string, { name: string; hints: string[] }> = {
  // Plain language on purpose. Every other entry here assumes an engineering
  // vocabulary, which is right for those audiences and wrong for this one.
  //
  // Deliberately scoped to the website and nothing else. These prompts do not
  // ask what the business does, what the idea is, or anything about the plan
  // behind it. First contact only needs enough to start a conversation, and
  // asking for more invites a reading nobody benefits from. Detailed scoping
  // happens later, in an engagement, where both sides have terms.
  'vermont-small-business': {
    name: 'Vermont Small Business Website',
    hints: [
      'Anything you have online right now, even just a social account. Nothing yet is a perfectly normal answer',
      'Any websites you like the look of',
      'Roughly when you would like it up, if you have a date in mind',
    ],
  },
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
  const isSmallBusiness = slug.value === 'vermont-small-business';

  const firstName = useSignal('');
  const lastName = useSignal('');
  const email = useSignal('');
  const message = useSignal('');
  const hintValues = useSignal<string[]>([]);
  const submitted = useSignal(false);
  const submitting = useSignal(false);
  const errorMsg = useSignal('');
  const turnstileToken = useSignal('');
  const turnstileWidgetId = useSignal<string | null>(null);

  // Mount the Turnstile widget after hydration.
  //
  // strategy must be 'document-ready'. The default is an intersection observer,
  // and the target container is empty until Turnstile renders into it, so it
  // has no dimensions to intersect with. That is circular: the task has to run
  // to create the widget, but the observer waits for size the widget would have
  // provided. The task therefore never ran at all. When that happened,
  // mount() was never called AND __onTurnstileLoad was never assigned, so
  // Cloudflare's own ready signal had nowhere to go either:
  //   "[Cloudflare Turnstile] Unable to find onload callback
  //    '__onTurnstileLoad' ... got 'undefined'"
  // The result was a form whose Send button could never obtain a token.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const win = window as any;
    const mount = () => {
      if (!win.turnstile) return;
      const id = win.turnstile.render('#turnstile-container', {
        sitekey:  TURNSTILE_SITE_KEY,
        // No size parameter. Turnstile accepts only "compact", "flexible" or
        // "normal"; passing "invisible" threw an uncaught TurnstileError on
        // every page load. It rendered regardless, because Turnstile falls
        // back to the mode configured on the widget in the Cloudflare
        // dashboard. That widget is configured in Managed mode, so it renders
        // visibly and auto-verifies clean traffic, which is why a token is
        // present before the visitor touches Send.
        callback: (token: string) => { turnstileToken.value = token; },
        'expired-callback': () => { turnstileToken.value = ''; },
        'error-callback':   () => {
          turnstileToken.value = '';
          errorMsg.value = 'Human verification failed. Please refresh and try again';
        },
      });
      turnstileWidgetId.value = id;
    };
    // Turnstile script may already be loaded (injected in root.tsx).
    // If not, hand mount() to Cloudflare's onload callback, which the script
    // tag names via ?onload=__onTurnstileLoad.
    if ((window as any).turnstile) {
      mount();
    } else {
      (window as any).__onTurnstileLoad = mount;
    }
  }, { strategy: 'document-ready' });

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
    errorMsg.value = '';

    // If we don't have a token yet, trigger the challenge first.
    // The callback will set turnstileToken.value; the user re-clicks or we
    // auto-resubmit via the callback (simpler: just ask them to click again).
    const win = window as any;
    if (!turnstileToken.value) {
      if (win.turnstile && turnstileWidgetId.value !== null) {
        win.turnstile.execute(turnstileWidgetId.value);
      }
      errorMsg.value = 'Verifying you are human. Click Send again in a moment';
      return;
    }

    submitting.value = true;

    const cfg = SERVICE_CONFIG[slug.value] ?? null;
    const payload: Record<string, string> = {
      first_name: firstName.value,
      last_name:  lastName.value,
      email:      email.value,
      message:    message.value,
      'cf-turnstile-response': turnstileToken.value,
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
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (res.ok) {
        submitted.value = true;
      } else {
        const data = await res.json().catch(() => ({}));
        errorMsg.value = (data as any).error ?? 'Submission failed. Please try again or email directly.';
        // Reset token so Turnstile re-challenges on next attempt
        turnstileToken.value = '';
        if (win.turnstile && turnstileWidgetId.value !== null) {
          win.turnstile.reset(turnstileWidgetId.value);
        }
      }
    } catch {
      errorMsg.value = 'A network error occurred. Please try again.';
    } finally {
      submitting.value = false;
    }
  });

  return (
    <div class={styles.page}>

      {/*
        Small business visitors get a plain title instead of the hero, and skip
        the engagement process entirely. The hero is written for enterprise
        buyers and the four steps end in "Engagement agreement", which is the
        wall that makes a first-time business owner feel out of her depth. She
        arrives here having already read the offer, so repeating a pitch adds
        nothing. The h1 stays so the page keeps a document outline.
      */}
      {isSmallBusiness ? (
        <section class={styles.simpleHeader}>
          <h1>Let us build your website</h1>
        </section>
      ) : (
        <>
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
        </>
      )}

      {/*
        Someone arriving here directly has never seen the services page, so the
        offer has to be restated rather than linked to blindly. Hidden on the
        small business path itself, where it would be telling them what they
        already chose.
      */}
      {!isSmallBusiness && (
        <div class={styles.container}>
          <aside class="vermont-band">
            <h2 class="vermont-heading">Vermont small business? This is for you</h2>
            <p class="vermont-hook">We build your website. You do not pay us.</p>
            <ul class="vermont-list">
              <li><strong>Your first 20 hours are free.</strong> That is usually a whole site</li>
              <li><strong>You pay about $12 a year</strong> for a domain. Hosting costs next to nothing</li>
              <li><strong>One at a time.</strong> You get an email with your place in line</li>
            </ul>
            <a href="/work-with-us/?service=vermont-small-business" class="cta-button">
              Start here instead
            </a>
          </aside>
        </div>
      )}

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
                {/*
                  "What are you working on?" invites someone to describe plans
                  and unreleased work. For a small business the honest question
                  is about what already exists, which is both easier to answer
                  and asks for nothing speculative.
                */}
                <label for="message">
                  {isSmallBusiness
                    ? 'Describe the product or service you provide'
                    : 'What are you working on?'}
                </label>
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

              {/* Invisible Turnstile widget, mounts here and never shows UI unless a challenge is required */}
              <div id="turnstile-container" />

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
