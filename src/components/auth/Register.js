import React, { useState } from "react";
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import "../../styles/AuthModal.css";

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { openModal, closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await register(formData.email, formData.password);
      if (result.access_token) {
        localStorage.setItem('token', result.access_token);
        closeModal();
        window.location.href = '/dashboard';
      } else {
        setError('Registration successful but login failed');
      }
    } catch (err) {
      setError('Error creating account');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowLogin = () => {
    import('./Login').then(module => {
      openModal(<module.default />);
    });
  };

  return (
    <div className="auth-form">
      <h2 className="auth-title">Create Account</h2>
      <p className="auth-subtitle">Sign up to get started</p>
      
      {error && (
        <div className="auth-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-input-group">
          <label className="auth-label">Email Address</label>
          <input
            className="auth-input"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
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
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
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
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
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