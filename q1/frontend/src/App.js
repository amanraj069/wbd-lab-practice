import { useState } from "react";
import "./App.css";
import AuthForm from "./components/AuthForm";
import MessageAlert from "./components/MessageAlert";
import UserCard from "./components/UserCard";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const url = isLogin
        ? "http://localhost:5000/login"
        : "http://localhost:5000/register";

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        setSuccess("Login successful!");
      } else {
        setSuccess("Account created successfully! Please login.");
        setIsLogin(true);
      }

      resetForm();
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsLogin((current) => !current);
    resetForm();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    resetForm();
  };

  if (user) {
    return <UserCard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="app-container">
      <div className="card">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>

        <MessageAlert type="error" message={error} />
        <MessageAlert type="success" message={success} />

        <AuthForm
          isLogin={isLogin}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          onToggleMode={handleToggleMode}
        />
      </div>
    </div>
  );
}

export default App;
