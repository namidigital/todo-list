import { useAuth } from '../contexts/AuthContext.jsx';
import Navigation from './Navigation.jsx';
import Logoff from '../features/Logoff.jsx';
import styles from './Header.module.css';

function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Todo List</h1>
        <Navigation />
        {isAuthenticated && <Logoff />}
      </div>
    </header>
  );
}

export default Header;
