import { useState } from 'react';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onToggleTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    event.preventDefault();
    if (!isEditing) return;
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
                disabled={!isValidTodoTitle(workingTitle)}
                className={styles.updateButton}
              >
                Update
              </button>
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
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
