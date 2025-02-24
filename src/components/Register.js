import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import "../styles/AuthModal.css";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  async function handleRegister(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await register(formData);
      if (result.success) {
        closeModal();
        navigate('/dashboard');
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (err) {
      setError("Error registering user");
    } finally {
      setIsLoading(false);
    }
  }

  const handleShowLogin = () => {
    import('./Login').then(module => {
      openModal(<module.default />);
    });
  };

  return (
    <div className="auth-form">
      <h2 className="auth-title">Create account</h2>
      <p className="auth-subtitle">Sign up to get started</p>
      
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div className="auth-input-group">
          <label className="auth-label">Full Name</label>
          <input 
            className="auth-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            autoComplete="name"
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">Email Address</label>
          <input 
            className="auth-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            autoComplete="new-password"
          />
        </div>

        <div className="auth-input-group">
          <label className="auth-label">Confirm Password</label>
          <input 
            className="auth-input"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
          />
        </div>

        <button 
          type="submit" 
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="auth-switch">
        Already have an account?
        <button 
          onClick={handleShowLogin} 
          className="auth-switch-link"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default Register;