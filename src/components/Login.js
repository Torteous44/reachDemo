import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import "../styles/AuthModal.css";

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
      const result = await login(email, password);
      console.log("Login result:", result); // Debug log
      
      if (result.success) {
        closeModal();
        // Force a reload to ensure fresh state
        window.location.href = '/dashboard';
      } else {
        setError(result.error || "Failed to login");
      }
    } catch (err) {
      console.error("Login error:", err); // Debug log
      setError("Failed to login. Please try again.");
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
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Sign in to your account to continue</p>
      
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