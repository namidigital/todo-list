import { useState } from 'react';
import './App.css';
import Header from './shared/Header.jsx';
import TodosPage from './features/Todos/TodosPage.jsx';
import Logon from './features/Logon/Logon.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  function handleLogonSuccess(token) {
    setCsrfToken(token);
    setIsLoggedIn(true);
  }

  return (
    <div>
      <Header />
      {isLoggedIn ? (
        <TodosPage csrfToken={csrfToken} />
      ) : (
        <Logon onLogonSuccess={handleLogonSuccess} />
      )}
    </div>
  );
}

export default App;
