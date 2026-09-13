import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function ProfilePage() {
  const { email, token, isAuthenticated } = useAuth();
  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    async function fetchTodoStats() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/api/tasks', {
          method: 'GET',
          headers: { 'X-CSRF-TOKEN': token },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todo statistics.');
        }

        // The API responds with { tasks: [...], pagination: {...} }
        const data = await response.json();
        const total = data.tasks.length;
        const completed = data.tasks.filter((todo) => todo.isCompleted).length;

        setTodoStats({ total, completed, active: total - completed });
      } catch (statsError) {
        setError(statsError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionPercentage =
    todoStats.total > 0
      ? Math.round((todoStats.completed / todoStats.total) * 100)
      : 0;

  return (
    <div>
      <h2>Profile</h2>

      <section>
        <h3>Account Information</h3>
        <p>Email: {email}</p>
        <p>Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
      </section>

      <section>
        <h3>Todo Statistics</h3>
        {loading ? (
          <p>Loading statistics...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : (
          <>
            <p>Total todos: {todoStats.total}</p>
            <p>Completed todos: {todoStats.completed}</p>
            <p>Active todos: {todoStats.active}</p>
            {todoStats.total > 0 && <p>Completion: {completionPercentage}%</p>}
          </>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
