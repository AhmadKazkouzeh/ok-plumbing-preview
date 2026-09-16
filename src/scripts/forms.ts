/**
 * Progressive-enhancement handler for every `<form data-form>` on the site.
 *
 * Without JS the form still submits natively to the same endpoint and the
 * browser enforces `required`. With JS it validates inline, blocks bots with a
 * honeypot and swaps in the success state without leaving the page.
 *
 * The endpoint is set once, in .env → PUBLIC_FORM_ENDPOINT. Point it at an email
 * service (Formspree, Web3Forms, a Namecheap PHP handler, a CRM) when ready.
 */

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT ?? '';

/** Lenient UK mobile/landline: optional +44 or leading 0, then 9–10 digits. */
const UK_PHONE = /^(?:\+?44|0)\d{9,10}$/;
/** Lenient UK postcode, spaces optional. */
const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

type Rule = (value: string) => string | null;

const required = (label: string): Rule => (v) => (v.trim() ? null : `${label} is required.`);

const RULES: Record<string, Rule[]> = {
  name: [required('Name')],
  firstName: [required('First name')],
  phone: [
    required('Phone'),
    (v) => (UK_PHONE.test(v.replace(/[\s()-]/g, '')) ? null : 'Enter a UK phone number.'),
  ],
  postcode: [
    required('Postcode'),
    (v) => (UK_POSTCODE.test(v.trim()) ? null : 'Enter a valid UK postcode.'),
  ],
  email: [
    (v) => (!v.trim() || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? null : 'Enter a valid email.'),
  ],
};

function fieldError(field: HTMLInputElement | HTMLTextAreaElement): string | null {
  for (const rule of RULES[field.name] ?? []) {
    const message = rule(field.value);
    if (message) return message;
  }
  return null;
}

function showError(field: HTMLInputElement | HTMLTextAreaElement, message: string | null) {
  const slot = field.form?.querySelector<HTMLElement>(`[data-error-for="${field.name}"]`);
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (!slot) return;
  slot.textContent = message ?? '';
  slot.hidden = !message;
  // Point the field at its error so a screen reader reads the reason, not just
  // "invalid". Removed again when the field passes, so nothing stale is announced.
  if (message) {
    if (!slot.id) slot.id = `err-${field.name}-${Math.random().toString(36).slice(2, 7)}`;
    field.setAttribute('aria-describedby', slot.id);
  } else {
    field.removeAttribute('aria-describedby');
  }
}

function enhance(form: HTMLFormElement) {
  // The script is now in charge of validation, so turn the browser's own off.
  form.setAttribute('novalidate', '');

  const fields = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[name], textarea[name]')
  ).filter((f) => f.type !== 'radio' && f.type !== 'hidden' && !f.dataset.honeypot);

  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const success = form.querySelector<HTMLElement>('[data-form-success]');
  const body = form.querySelector<HTMLElement>('[data-form-body]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  // Validate on blur, then live once a field has been marked invalid.
  for (const field of fields) {
    field.addEventListener('blur', () => showError(field, fieldError(field)));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') showError(field, fieldError(field));
    });
  }

  const setStatus = (message: string, tone: 'error' | 'info') => {
    if (!status) return;
    status.textContent = message;
    status.hidden = !message;
    status.dataset.tone = tone;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('', 'info');

    // Honeypot: a real person never fills this in.
    const honeypot = form.querySelector<HTMLInputElement>('[data-honeypot]');
    if (honeypot?.value) return;

    let firstInvalid: (HTMLInputElement | HTMLTextAreaElement) | null = null;
    for (const field of fields) {
      const message = fieldError(field);
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    }

    if (firstInvalid) {
      setStatus('Please check the highlighted fields.', 'error');
      firstInvalid.focus();
      return;
    }

    if (!ENDPOINT) {
      setStatus(
        'This form is not connected yet. Please call us and we will book you in.',
        'error'
      );
      return;
    }

    submit?.setAttribute('disabled', 'true');
    const label = submit?.textContent ?? '';
    if (submit) submit.textContent = 'Sending…';

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error(String(response.status));

      body?.setAttribute('hidden', '');
      success?.removeAttribute('hidden');
      success?.focus();
    } catch {
      setStatus(
        'Something went wrong sending that. Please try again, or call us and we will book you in.',
        'error'
      );
      submit?.removeAttribute('disabled');
      if (submit) submit.textContent = label;
    }
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach(enhance);
