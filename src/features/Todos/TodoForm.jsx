import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation';
import styles from './TodoForm.module.css';

function TodoForm({ onAddTodo }) {
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

    if (isValidTodoTitle(workingTodoTitle)) {
      onAddTodo(workingTodoTitle);
      setWorkingTodoTitle('');
    }
  };

  return (
    <form onSubmit={handleAddTodo} className={styles.form}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        value={workingTodoTitle}
        onChange={(event) => setWorkingTodoTitle(event.target.value)}
      />
      <button
        type="submit"
        disabled={!isValidTodoTitle(workingTodoTitle)}
        className={styles.button}
      >
        Add Todo
      </button>
    </form>
  );
}

export default TodoForm;
