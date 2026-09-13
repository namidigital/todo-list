import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  UNAUTHORIZED,
  logDevError,
  toUserMessage,
} from '../utils/errorMessages';
import styles from './ProfilePage.module.css';

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
          throw new Error(UNAUTHORIZED);
        }

        if (!response.ok) {
          throw new Error(`Fetch stats failed (HTTP ${response.status})`);
        }

        // The API responds with { tasks: [...], pagination: {...} }
        const data = await response.json();
        const total = data.tasks.length;
        const completed = data.tasks.filter((todo) => todo.isCompleted).length;

        setTodoStats({ total, completed, active: total - completed });
      } catch (statsError) {
        logDevError('fetchTodoStats', statsError);
        setError(
          toUserMessage(
            statsError,
            'We could not load your todo statistics. Please try again later.'
          )
        );
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
    <div className={styles.page}>
      <h2 className={styles.heading}>Profile</h2>

      <section className={styles.section}>
        <h3 className={styles.subheading}>Account Information</h3>
        <div className={styles.account}>
          <p>
            Email: <span className={styles.value}>{email}</span>
          </p>
          <p>
            Status:{' '}
            <span className={isAuthenticated ? styles.statusOk : styles.value}>
              {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
            </span>
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.subheading}>Todo Statistics</h3>
        {loading ? (
          <p className={styles.muted}>Loading statistics...</p>
        ) : error ? (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        ) : (
          <div className={styles.stats}>
            <p className={styles.stat}>
              <span className={styles.statLabel}>Total todos</span>
              <span className={styles.statValue}>{todoStats.total}</span>
            </p>
            <p className={styles.stat}>
              <span className={styles.statLabel}>Completed todos</span>
              <span className={styles.statValue}>{todoStats.completed}</span>
            </p>
            <p className={styles.stat}>
              <span className={styles.statLabel}>Active todos</span>
              <span className={styles.statValue}>{todoStats.active}</span>
            </p>
            {todoStats.total > 0 && (
              <p className={`${styles.stat} ${styles.statAccent}`}>
                <span className={styles.statLabel}>Completion</span>
                <span className={styles.statValue}>
                  {completionPercentage}%
                </span>
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
