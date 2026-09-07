import { useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logon() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);
  const [authError, setAuthError] = useState('');

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

export default Logon;
