import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
  const { email, logout } = useAuth();
  const [logoffError, setLogoffError] = useState('');

  async function handleLogoff() {
    setLogoffError('');
    const result = await logout();

    if (!result.success) {
      setLogoffError(result.error);
    }
  }

  return (
    <div>
      <span>Logged on as {email} </span>
      <button type="button" onClick={handleLogoff}>
        Log Off
      </button>
      {logoffError && <p role="alert">{logoffError}</p>}
    </div>
  );
}

export default Logoff;
