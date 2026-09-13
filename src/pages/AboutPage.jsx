function AboutPage() {
  return (
    <div>
      <h2>About</h2>
      <p>
        This is a simple todo list application for keeping track of the things
        you need to get done. Your todos are saved to your account, so they are
        still there the next time you log on.
      </p>

      <h3>Features</h3>
      <ul>
        <li>Create new todos and edit their titles</li>
        <li>Mark todos as complete</li>
        <li>Sort todos by title or creation time, ascending or descending</li>
        <li>Search todos by keyword</li>
        <li>Filter todos by their completion status</li>
      </ul>

      <h3>Technologies Used</h3>
      <ul>
        <li>React</li>
        <li>React Router</li>
        <li>Vite</li>
      </ul>
    </div>
  );
}

export default AboutPage;
