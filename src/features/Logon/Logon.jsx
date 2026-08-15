import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';

function Logon({ onLogonSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('/api/users/logon', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Logon failed. Check your email and password.');
      }

      const data = await response.json();
      onLogonSuccess(data.csrfToken);
    } catch (error) {
      setErrorMessage(error.message);
    }
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
        <button type="submit" disabled={!email.trim() || !password.trim()}>
          Log On
        </button>
      </form>
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </div>
  );
}

export default Logon;
