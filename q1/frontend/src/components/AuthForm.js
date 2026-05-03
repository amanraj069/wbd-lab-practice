export default function AuthForm({
  isLogin,
  formData,
  onChange,
  onSubmit,
  loading,
  onToggleMode,
}) {
  return (
    <>
      <form onSubmit={onSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              disabled={loading}
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="toggle-text">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button type="button" onClick={onToggleMode} className="toggle-btn">
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </>
  );
}
