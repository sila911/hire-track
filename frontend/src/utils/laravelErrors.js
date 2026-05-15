/**
 * Normalize Laravel validation `errors` bag: first string per field.
 * @param {Record<string, string[]>|undefined} errors
 * @returns {Record<string, string>}
 */
export function firstErrorPerField(errors) {
  if (!errors || typeof errors !== 'object') return {};
  return Object.fromEntries(
    Object.entries(errors)
      .map(([key, msgs]) => {
        const first = Array.isArray(msgs) ? msgs[0] : msgs;
        return [key, typeof first === 'string' ? first : String(first ?? '')];
      })
      .filter(([, v]) => v),
  );
}

/**
 * User-friendly copy for registration validation (never use login-only copy here).
 * @param {string} field
 * @param {string} message
 */
export function humanizeRegisterFieldError(field, message) {
  if (!message) return '';
  const lower = message.toLowerCase();
  if (field === 'password' && lower.includes('confirmation')) {
    return 'Passwords do not match.';
  }
  if (
    field === 'password_confirmation' &&
    (lower.includes('confirmation') || lower.includes('do not match'))
  ) {
    return 'Passwords do not match.';
  }
  if (field === 'email' && (lower.includes('already been taken') || lower.includes('has already been taken'))) {
    return 'This email is already registered.';
  }
  return message;
}

/**
 * @param {import('axios').AxiosError} err
 * @returns {{ fieldErrors: Record<string, string>, banner: string | null }}
 */
export function parseRegisterApiError(err) {
  const status = err.response?.status;
  const data = err.response?.data;

  if (status === 422 && data?.errors) {
    const raw = firstErrorPerField(data.errors);
    const fieldErrors = {};
    for (const [key, msg] of Object.entries(raw)) {
      fieldErrors[key] = humanizeRegisterFieldError(key, msg);
    }
    return { fieldErrors, banner: null };
  }

  if (!err.response) {
    return { fieldErrors: {}, banner: 'Unable to reach the server. Check your connection and try again.' };
  }

  const msg =
    typeof data?.message === 'string' && data.message !== 'The given data was invalid.'
      ? data.message
      : 'Something went wrong. Please try again.';
  return { fieldErrors: {}, banner: msg };
}

/**
 * Login endpoint: Laravel puts failed auth on `email` in many setups.
 * @param {import('axios').AxiosError} err
 */
export function parseLoginApiError(err) {
  const status = err.response?.status;
  const data = err.response?.data;

  if (status === 422 && data?.errors) {
    const raw = firstErrorPerField(data.errors);
    return { fieldErrors: raw, banner: null };
  }

  if (status === 429) {
    return {
      fieldErrors: {},
      banner: 'Too many attempts. Please wait a moment and try again.',
    };
  }

  if (!err.response) {
    return { fieldErrors: {}, banner: 'Unable to reach the server. Check your connection and try again.' };
  }

  const msg =
    typeof data?.message === 'string' && data.message !== 'The given data was invalid.'
      ? data.message
      : 'Something went wrong. Please try again.';
  return { fieldErrors: {}, banner: msg };
}
