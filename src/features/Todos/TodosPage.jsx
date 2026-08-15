import { useState, useEffect } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function TodosPage({ csrfToken }) {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchTodos() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch('/api/tasks', {
          credentials: 'include',
          headers: { 'x-csrf-token': csrfToken },
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
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodos();
  }, [csrfToken]);

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
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo.');
      }

      const newTask = await response.json();

      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === tempId ? { ...todo, id: newTask.id } : todo
        )
      );
    } catch (error) {
      setErrorMessage(error.message);
      setTodoList((previous) => previous.filter((todo) => todo.id !== tempId));
    }
  }

  async function completeTodo(id) {
    const previousTodoList = todoList;

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
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ isCompleted: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo.');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setTodoList(previousTodoList);
    }
  }

  async function updateTodo(editedTodo) {
    const previousTodoList = todoList;

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
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ title: editedTodo.title }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo.');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setTodoList(previousTodoList);
    }
  }

  return (
    <div>
      <TodoForm onAddTodo={addTodo} />
      {errorMessage && <p role="alert">{errorMessage}</p>}
      {isLoading ? (
        <p>Loading todos...</p>
      ) : (
        <TodoList
          todoList={todoList}
          onCompleteTodo={completeTodo}
          onUpdateTodo={updateTodo}
        />
      )}
    </div>
  );
}

export default TodosPage;
