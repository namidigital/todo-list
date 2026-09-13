export const MAX_TODO_LENGTH = 200;

/**
 * Validates a todo title and explains why it was rejected, so the UI can
 * show the user what to fix rather than just disabling the button.
 */
export function validateTodoTitle(title) {
  if (title.trim() === '') {
    return { isValid: false, reason: 'Enter a title for your todo.' };
  }

  if (title.length > MAX_TODO_LENGTH) {
    return {
      isValid: false,
      reason: `Titles must be ${MAX_TODO_LENGTH} characters or fewer.`,
    };
  }

  return { isValid: true, reason: '' };
}

export function isValidTodoTitle(title) {
  return validateTodoTitle(title).isValid;
}
