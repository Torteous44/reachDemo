import React, { useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { openModal, closeModal } = useModal();

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://demobackend-p2e1.onrender.com/client-auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Origin": window.location.origin
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      
      if (data.client) {
        localStorage.setItem("user_info", JSON.stringify(data.client));
      }
      
      closeModal();
      window.location.href = '/dashboard';
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleShowRegister = () => {
    import('./Register').then(module => {
      openModal(<module.default />);
    });
  };

  return (
    <div className="auth-form">
      <h2 className="auth-title">Client Login</h2>
      <p className="auth-subtitle">Sign in to your organization account</p>
      
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="auth-input-group">
          <label className="auth-label">Email Address</label>
          <input 
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">Password</label>
          <input 
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="auth-switch">
        Don't have an account?
        <button 
          onClick={handleShowRegister} 
          className="auth-switch-link"
        >
          Create account
        </button>
      </div>
    </div>
  );
}

export default Login;