import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);
  const [authError, setAuthError] = useState('');

  // Where the user was headed before being sent to the login page
  const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    }

    setIsLoggingOn(false);
  }

  return (
    <div>
      <h2>Logon</h2>
      <form onSubmit={handleSubmit}>
        <TextInputWithLabel
          elementId="email"
          labelText="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextInputWithLabel
          elementId="password"
          labelText="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button
          type="submit"
          disabled={!email.trim() || !password.trim() || isLoggingOn}
        >
          Log On
        </button>
      </form>
      {isLoggingOn && <p>Logging on...</p>}
      {authError && <p role="alert">{authError}</p>}
    </div>
  );
}

export default LoginPage;
