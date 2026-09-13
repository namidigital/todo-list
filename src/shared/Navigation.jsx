import { NavLink } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import styles from './Navigation.module.css';

function navLinkClassName({ isActive }) {
  return isActive ? `${styles.link} ${styles.active}` : styles.link;
}

function Navigation() {
  const { isAuthenticated } = useAuth();

  return (
    <nav aria-label="Main">
      <ul className={styles.list}>
        <li>
          <NavLink to="/about" className={navLinkClassName}>
            About
          </NavLink>
        </li>
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" className={navLinkClassName}>
                Todos
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={navLinkClassName}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={navLinkClassName}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
