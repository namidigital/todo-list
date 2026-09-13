import { useEffect, useReducer } from 'react';
import { useSearchParams } from 'react-router';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';
import SortBy from '../shared/SortBy.jsx';
import StatusFilter from '../shared/StatusFilter.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import useDebounce from '../utils/useDebounce.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  UNAUTHORIZED,
  logDevError,
  toUserMessage,
} from '../utils/errorMessages';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer';
import styles from './TodosPage.module.css';

function TodosPage() {
  const { token } = useAuth();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  useEffect(() => {
    if (!token) return;

    async function fetchTodos() {
      dispatch({ type: TODO_ACTIONS.FETCH_START });

      try {
        const paramsObject = { sortBy, sortDirection, limit: 100 };

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
          credentials: 'include',
          headers: { 'X-CSRF-TOKEN': token },
        });

        if (response.status === 401) {
          throw new Error(UNAUTHORIZED);
        }

        if (!response.ok) {
          throw new Error(`Fetch todos failed (HTTP ${response.status})`);
        }

        const data = await response.json();
        const mappedTodos = data.tasks.map((task) => ({
          ...task,
          isCompleted: task.isCompleted || false,
        }));

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: mappedTodos },
        });
      } catch (fetchError) {
        logDevError('fetchTodos', fetchError);

        const isFilterError =
          Boolean(debouncedFilterTerm) ||
          sortBy !== 'createdAt' ||
          sortDirection !== 'asc';

        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: toUserMessage(
              fetchError,
              isFilterError
                ? 'We could not filter or sort your todos. Try clearing the filters.'
                : 'We could not load your todos. Please try again.'
            ),
            isFilterError,
          },
        });
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  async function addTodo(todoTitle) {
    const tempId = `temp-${Date.now()}`;
    const optimisticTodo = { id: tempId, title: todoTitle, isCompleted: false };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { optimisticTodo },
    });

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
        throw new Error(UNAUTHORIZED);
      }

      if (!response.ok) {
        throw new Error(`Add todo failed (HTTP ${response.status})`);
      }

      const data = await response.json();
      const savedTodo = { ...data, isCompleted: data.isCompleted || false };

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId, savedTodo },
      });
    } catch (addError) {
      logDevError('addTodo', addError);
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          message: toUserMessage(
            addError,
            'We could not save your todo. Please try again.'
          ),
          tempId,
        },
      });
    }
  }

  async function toggleTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);
    const isCompleted = !originalTodo.isCompleted;

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id, isCompleted },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        body: JSON.stringify({ isCompleted }),
      });

      if (response.status === 401) {
        throw new Error(UNAUTHORIZED);
      }

      if (!response.ok) {
        throw new Error(`Toggle todo failed (HTTP ${response.status})`);
      }

      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS });
    } catch (toggleError) {
      logDevError('toggleTodo', toggleError);
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          message: toUserMessage(
            toggleError,
            'We could not update that todo. Please try again.'
          ),
          id,
          originalTodo,
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find((todo) => todo.id === editedTodo.id);

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { editedTodo },
    });

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
        throw new Error(UNAUTHORIZED);
      }

      if (!response.ok) {
        throw new Error(`Update todo failed (HTTP ${response.status})`);
      }

      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS });
    } catch (updateError) {
      logDevError('updateTodo', updateError);
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          message: toUserMessage(
            updateError,
            'We could not save your changes. Please try again.'
          ),
          id: editedTodo.id,
          originalTodo,
        },
      });
    }
  }

  async function deleteTodo(id) {
    const originalIndex = todoList.findIndex((todo) => todo.id === id);
    const originalTodo = todoList[originalIndex];

    dispatch({ type: TODO_ACTIONS.DELETE_TODO_START, payload: { id } });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'X-CSRF-TOKEN': token },
      });

      if (response.status === 401) {
        throw new Error(UNAUTHORIZED);
      }

      if (!response.ok) {
        throw new Error(`Delete todo failed (HTTP ${response.status})`);
      }

      dispatch({ type: TODO_ACTIONS.DELETE_TODO_SUCCESS });
    } catch (deleteError) {
      logDevError('deleteTodo', deleteError);
      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_ERROR,
        payload: {
          message: toUserMessage(
            deleteError,
            'We could not delete that todo. Please try again.'
          ),
          originalTodo,
          originalIndex,
        },
      });
    }
  }

  return (
    <div className={styles.page}>
      {error && (
        <div className={styles.alert}>
          <p role="alert" className={styles.alertMessage}>
            {error}
          </p>
          <div className={styles.alertActions}>
            <button
              type="button"
              onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
              className={styles.alertButton}
            >
              Clear Error
            </button>
          </div>
        </div>
      )}
      {filterError && (
        <div className={styles.alert}>
          <p role="alert" className={styles.alertMessage}>
            {filterError}
          </p>
          <div className={styles.alertActions}>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })
              }
              className={styles.alertButton}
            >
              Clear Filter Error
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
              className={styles.alertButtonSecondary}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
      {isTodoListLoading && <p className={styles.loading}>Loading todos...</p>}
      <div className={styles.controls}>
        <SortBy
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByChange={(newSortBy) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy: newSortBy, sortDirection },
            })
          }
          onSortDirectionChange={(newDirection) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: { sortBy, sortDirection: newDirection },
            })
          }
        />
        <StatusFilter />
        <FilterInput
          filterTerm={filterTerm}
          onFilterChange={(newTerm) =>
            dispatch({
              type: TODO_ACTIONS.SET_FILTER,
              payload: { filterTerm: newTerm },
            })
          }
        />
      </div>
      <TodoForm onAddTodo={addTodo} />
      <div className={styles.list}>
        <TodoList
          todoList={todoList}
          onToggleTodo={toggleTodo}
          onUpdateTodo={updateTodo}
          onDeleteTodo={deleteTodo}
          dataVersion={dataVersion}
          statusFilter={statusFilter}
        />
      </div>
    </div>
  );
}

export default TodosPage;
