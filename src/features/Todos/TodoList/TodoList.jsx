import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';
import styles from './TodoList.module.css';

function TodoList({
  todoList,
  onToggleTodo,
  onUpdateTodo,
  onDeleteTodo,
  dataVersion,
  statusFilter = 'active',
}) {
  const filteredTodoList = useMemo(() => {
    let filteredTodos;

    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;
      case 'active':
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;
      case 'all':
      default:
        filteredTodos = todoList;
        break;
    }

    // Sink completed todos below active ones. Array.prototype.sort is stable,
    // so items with the same completion state keep the server-provided order
    // from the user's sort selection. Sorting a copy leaves todoList untouched.
    const sortedTodos = [...filteredTodos].sort(
      (a, b) => Number(a.isCompleted) - Number(b.isCompleted)
    );

    return {
      version: dataVersion,
      todos: sortedTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

  function getEmptyMessage() {
    switch (statusFilter) {
      case 'completed':
        return 'No completed todos yet. Complete some tasks to see them here.';
      case 'active':
        return 'No active todos. Add a todo above to get started.';
      case 'all':
      default:
        return 'Add todo above to get started.';
    }
  }

  return filteredTodoList.todos.length === 0 ? (
    <p className={styles.empty}>{getEmptyMessage()}</p>
  ) : (
    <ul className={styles.list}>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onToggleTodo={onToggleTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;
