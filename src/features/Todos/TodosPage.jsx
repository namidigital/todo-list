import { useState, useEffect, useCallback } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const [dataVersion, setDataVersion] = useState(0);
  const [filterError, setFilterError] = useState('');

  const invalidateCache = useCallback(() => {
    setDataVersion((prev) => prev + 1);
  }, []);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError('');

      try {
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100,
        };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
          credentials: 'include',
          headers: { 'X-CSRF-TOKEN': token },
        });

        if (response.status === 401) {
          throw new Error('unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos.');
        }

        const data = await response.json();
        const mappedTodos = data.tasks.map((task) => ({
          ...task,
          isCompleted: task.isCompleted || false,
        }));

        setTodoList(mappedTodos);
        setFilterError('');
      } catch (fetchError) {
        if (
          debouncedFilterTerm ||
          sortBy !== 'createdAt' ||
          sortDirection !== 'desc'
        ) {
          setFilterError(
            `Error filtering/sorting todos: ${fetchError.message}`
          );
        } else {
          setError(`Error fetching todos: ${fetchError.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

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

      if (response.status === 401) {
        throw new Error('unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to add todo.');
      }

      const data = await response.json();
      const savedTodo = data;

      setTodoList((previous) =>
        previous.map((todo) =>
          todo.id === tempId
            ? { ...savedTodo, isCompleted: savedTodo.isCompleted || false }
            : todo
        )
      );
      invalidateCache();
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

      if (response.status === 401) {
        throw new Error('unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to complete todo.');
      }

      invalidateCache();
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

      if (response.status === 401) {
        throw new Error('unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to update todo.');
      }

      invalidateCache();
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

  function resetFilters() {
    setFilterTerm('');
    setSortBy('createdAt');
    setSortDirection('desc');
    setFilterError('');
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
      {filterError && (
        <div>
          <p role="alert">{filterError}</p>
          <button type="button" onClick={() => setFilterError('')}>
            Clear Filter Error
          </button>
          <button type="button" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}
      {isTodoListLoading && <p>Loading todos...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </div>
  );
}

export default TodosPage;
