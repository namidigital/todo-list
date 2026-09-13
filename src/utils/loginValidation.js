// RFC 5321 caps a full address at 254 characters
export const MAX_EMAIL_LENGTH = 254;
export const MAX_PASSWORD_LENGTH = 128;

// Deliberately loose: one "@" with non-empty local part and a dotted domain.
// The server remains the authority on what counts as a valid account.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  const trimmed = email.trim();

  if (trimmed === '') {
    return { isValid: false, reason: 'Enter your email address.' };
  }

  if (trimmed.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(trimmed)) {
    return {
      isValid: false,
      reason: 'Enter a valid email address, like name@example.com.',
    };
  }

  return { isValid: true, reason: '' };
}
