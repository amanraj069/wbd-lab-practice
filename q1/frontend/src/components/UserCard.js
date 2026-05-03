export default function UserCard({ user, onLogout }) {
  return (
    <div className="app-container">
      <div className="card">
        <h1>Welcome</h1>
        <div className="user-info">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <button onClick={onLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
}
