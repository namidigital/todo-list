import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
  const { email, logout } = useAuth();

  return (
    <div>
      <span>Logged on as {email} </span>
      <button type="button" onClick={() => logout()}>
        Log Off
      </button>
    </div>
  );
}

export default Logoff;
