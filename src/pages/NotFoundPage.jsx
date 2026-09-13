import { Link } from 'react-router';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>404 - Page Not Found</h2>
      <p className={styles.text}>
        Sorry, we could not find the page you were looking for.
      </p>
      <p className={styles.text}>
        Here are some places you might want to go instead:
      </p>
      <ul className={styles.links}>
        <li>
          <Link to="/" className={styles.link}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/todos" className={styles.link}>
            Todos
          </Link>
        </li>
        <li>
          <Link to="/profile" className={styles.link}>
            Profile
          </Link>
        </li>
        <li>
          <Link to="/about" className={styles.link}>
            About
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default NotFoundPage;
