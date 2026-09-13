import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import {
  MAX_TODO_LENGTH,
  validateTodoTitle,
} from '../../../utils/todoValidation';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onToggleTodo, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  const validation = validateTodoTitle(workingTitle);
  const showValidation = isEditing && !validation.isValid;
  const remaining = MAX_TODO_LENGTH - workingTitle.length;

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDeleteTodo(todo.id);
    }
  }

  function handleUpdate(event) {
    event.preventDefault();
    if (!isEditing || !validation.isValid) return;
    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  }

  const formClassName = isEditing
    ? `${styles.form} ${styles.editing}`
    : styles.form;

  const titleClassName = todo.isCompleted
    ? `${styles.title} ${styles.completed}`
    : styles.title;

  return (
    <li className={styles.item}>
      <form onSubmit={handleUpdate} className={formClassName}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`todoTitle${todo.id}`}
              labelText="Todo"
              value={workingTitle}
              onChange={handleEdit}
              maxLength={MAX_TODO_LENGTH}
              ariaDescribedBy={
                showValidation ? `todoTitleError${todo.id}` : undefined
              }
              ariaInvalid={showValidation}
            />
            <div className={styles.editActions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!validation.isValid}
                className={styles.updateButton}
              >
                Update
              </button>
            </div>
            <div className={styles.editMeta}>
              {showValidation && (
                <p
                  id={`todoTitleError${todo.id}`}
                  role="alert"
                  className={styles.validation}
                >
                  {validation.reason}
                </p>
              )}
              <span
                className={
                  remaining <= 0
                    ? `${styles.counter} ${styles.counterLimit}`
                    : styles.counter
                }
              >
                {workingTitle.length}/{MAX_TODO_LENGTH}
              </span>
            </div>
          </>
        ) : (
          <>
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onToggleTodo(todo.id)}
                className={styles.checkbox}
              />
            </label>
            <span
              onClick={() => setIsEditing(true)}
              className={titleClassName}
            >
              {todo.title}
            </span>
            <button
              type="button"
              onClick={handleDelete}
              className={styles.deleteButton}
              aria-label={`Delete "${todo.title}"`}
            >
              Delete
            </button>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
