import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  validateEmail,
} from '../utils/loginValidation';
import styles from './LoginPage.module.css';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);
  const [authError, setAuthError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Where the user was headed before being sent to the login page
  const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  function handleEmailChange(event) {
    setEmail(event.target.value);
    if (emailError) setEmailError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError('');

    // Reject malformed addresses before they ever reach the server
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.reason);
      return;
    }

    setEmailError('');
    setIsLoggingOn(true);

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    }

    setIsLoggingOn(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Logon</h2>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <TextInputWithLabel
            elementId="email"
            labelText="Email"
            value={email}
            onChange={handleEmailChange}
            maxLength={MAX_EMAIL_LENGTH}
            autoComplete="email"
            ariaDescribedBy={emailError ? 'emailError' : undefined}
            ariaInvalid={Boolean(emailError)}
          />
          {emailError && (
            <p id="emailError" role="alert" className={styles.fieldError}>
              {emailError}
            </p>
          )}
          <TextInputWithLabel
            elementId="password"
            labelText="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            maxLength={MAX_PASSWORD_LENGTH}
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={!email.trim() || !password.trim() || isLoggingOn}
            className={styles.button}
          >
            Log On
          </button>
        </form>
        {isLoggingOn && <p className={styles.status}>Logging on...</p>}
        {authError && (
          <p role="alert" className={styles.error}>
            {authError}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
