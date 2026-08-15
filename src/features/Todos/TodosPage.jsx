import { useState, useEffect } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError('');

      try {
        const response = await fetch('/api/tasks?limit=100', {
          credentials: 'include',
          headers: { 'X-CSRF-TOKEN': token },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch todos.');
        }

        const data = await response.json();
        const mappedTodos = data.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          isCompleted: task.isCompleted || false,
        }));

        setTodoList(mappedTodos);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setIsTodoListLoading(false);
      }
    }

    fetchTodos();
  }, [token]);

  async function addTodo(todoTitle) {
    const tempId = `temp-${Date.now()}`;
    const optimisticTodo = { id: tempId, title: todoTitle, isCompleted: false };

    setTodoList((previous) => [optimisticTodo, ...previous]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo.');
      }

      const savedTodo = await response.json();

      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === tempId
            ? {
                id: savedTodo.id,
                title: savedTodo.title,
                isCompleted: savedTodo.isCompleted || false,
              }
            : todo
        )
      );
    } catch (addError) {
      setError(addError.message);
      setTodoList((previous) => previous.filter((todo) => todo.id !== tempId));
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    setTodoList((previous) =>
      previous.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({ isCompleted: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo.');
      }
    } catch (completeError) {
      setError(completeError.message);
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    setTodoList((previous) =>
      previous.map((todo) =>
        todo.id === editedTodo.id ? { ...editedTodo } : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo.');
      }
    } catch (updateError) {
      setError(updateError.message);
      setTodoList((previous) =>
        previous.map((todo) => (todo.id === editedTodo.id ? originalTodo : todo))
      );
    }
  }

  function clearError() {
    setError('');
  }

  return (
    <div>
      {error && (
        <div>
          <p role="alert">{error}</p>
          <button type="button" onClick={clearError}>
            Clear Error
          </button>
        </div>
      )}
      {isTodoListLoading && <p>Loading todos...</p>}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;
