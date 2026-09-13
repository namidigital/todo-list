import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import {
  MAX_TODO_LENGTH,
  validateTodoTitle,
} from '../../utils/todoValidation';
import styles from './TodoForm.module.css';

// Start showing the counter when this many characters remain
const COUNTER_THRESHOLD = 40;

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const validation = validateTodoTitle(workingTodoTitle);
  const remaining = MAX_TODO_LENGTH - workingTodoTitle.length;
  const showCounter = remaining <= COUNTER_THRESHOLD;
  // Show the reason once the user has typed something invalid (e.g. only
  // spaces) or tried to submit, but not on a pristine empty field.
  const showValidation =
    !validation.isValid &&
    (hasAttemptedSubmit || workingTodoTitle.length > 0);

  const handleAddTodo = (event) => {
    event.preventDefault();

    if (validation.isValid) {
      onAddTodo(workingTodoTitle);
      setWorkingTodoTitle('');
      setHasAttemptedSubmit(false);
    } else {
      setHasAttemptedSubmit(true);
    }
  };

  return (
    <form onSubmit={handleAddTodo} className={styles.form} noValidate>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
        maxLength={MAX_TODO_LENGTH}
        ariaDescribedBy={showValidation ? 'todoTitleError' : undefined}
        ariaInvalid={showValidation}
      />
      <button
        type="submit"
        disabled={!validation.isValid}
        className={styles.button}
      >
        Add Todo
      </button>
      {(showValidation || showCounter) && (
        <div className={styles.meta}>
          {showValidation && (
            <p id="todoTitleError" role="alert" className={styles.validation}>
              {validation.reason}
            </p>
          )}
          {showCounter && (
            <span
              className={
                remaining <= 0
                  ? `${styles.counter} ${styles.counterLimit}`
                  : styles.counter
              }
              aria-live="polite"
            >
              {workingTodoTitle.length}/{MAX_TODO_LENGTH}
            </span>
          )}
        </div>
      )}
    </form>
  );
}

export default TodoForm;
