import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import styles from './Logoff.module.css';

function Logoff() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogoff() {
    await logout();
    navigate('/login');
  }

  return (
    <div className={styles.logoff}>
      <span className={styles.user}>
        Logged on as <span className={styles.email}>{email}</span>{' '}
      </span>
      <button type="button" onClick={handleLogoff} className={styles.button}>
        Log Off
      </button>
    </div>
  );
}

export default Logoff;
