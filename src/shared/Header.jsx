function Header({ email, token, onSetToken }) {
  function handleLogOff() {
    onSetToken('');
  }

  return (
    <div>
      <h1>Todo List</h1>
      {token && (
        <p>
          Logged on as {email}{' '}
          <button type="button" onClick={handleLogOff}>
            Log Off
          </button>
        </p>
      )}
    </div>
  );
}

export default Header;
