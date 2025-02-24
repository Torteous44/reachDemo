import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/CreateInterview.css';

function CreateInterview() {
  const [formData, setFormData] = useState({
    name: '',
    scope: '',
    description: '',
    questions: ['']  // Start with one empty question
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hexCode, setHexCode] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, '']
    }));
  };

  const handleRemoveQuestion = (indexToRemove) => {
    if (formData.questions.length > 1) {
      setFormData(prev => ({
        ...prev,
        questions: prev.questions.filter((_, index) => index !== indexToRemove)
      }));
    }
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const filteredQuestions = formData.questions.filter(q => q.trim() !== '');
    
    if (filteredQuestions.length === 0) {
      setError('Please add at least one question');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/interviews/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          questions: filteredQuestions
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create interview');
      }

      setHexCode(data.hex_code);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hexCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="create-interview-wrapper">
      <Navbar />
      <div className="create-interview">
        <div className="create-container">
          <div className="card-header">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="back-button"
            >
              <img 
                src="/assets/arrow_back.svg" 
                alt="Back"
                className="back-icon"
              />
            </button>
            <h1>Create Interview</h1>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {hexCode ? (
            <div className="success-card">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Interview Created!</h2>
              
              <div className="hex-code-display">
                <div className="hex-code-container">
                  <span className="hex-code">{hexCode}</span>
                  <button 
                    onClick={handleCopy}
                    className="copy-button"
                    data-tooltip={copied ? 'Copied!' : 'Copy to clipboard'}
                  >
                    <img 
                      src="/assets/copy.svg" 
                      alt="Copy"
                      className="copy-icon"
                    />
                    Copy
                  </button>
                </div>
              </div>

              <button 
                onClick={() => navigate('/dashboard')}
                className="return-button"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="create-form">
              <div className="form-group">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Interview Name"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  value={formData.scope}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    scope: e.target.value
                  }))}
                  placeholder="Interview Scope"
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Interview Description"
                  rows="3"
                  required
                />
              </div>

              <div className="questions-section">
                <div className="questions-header">
                  <h2>Questions</h2>
                  <span className="question-count">
                    {formData.questions.length} {formData.questions.length === 1 ? 'Question' : 'Questions'}
                  </span>
                </div>
                
                <div className="questions-list">
                  {formData.questions.map((question, index) => (
                    <div 
                      key={index} 
                      className={`question-item ${question.trim() ? 'filled' : ''}`}
                    >
                      <div className="question-number">{index + 1}</div>
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        placeholder="Type your question here"
                        required
                      />
                      {formData.questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="remove-question"
                          aria-label="Remove question"
                        >
                          <img 
                            src="/assets/remove.svg" 
                            alt="Remove"
                            className="remove-icon"
                          />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button 
                  type="button"
                  onClick={handleAddQuestion}
                  className="add-question"
                >
                  <img 
                    src="/assets/plus.svg" 
                    alt="Add"
                    className="add-icon"
                  />
                </button>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Interview'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateInterview; 