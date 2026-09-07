import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogoff() {
    await logout();
    navigate('/login');
  }

  return (
    <div>
      <span>Logged on as {email} </span>
      <button type="button" onClick={handleLogoff}>
        Log Off
      </button>
    </div>
  );
}

export default Logoff;
