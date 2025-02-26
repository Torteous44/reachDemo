import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './misc/Navbar';
import '../styles/CreateInterview.css';

function CreateInterview() {
  const [formData, setFormData] = useState({
    name: '',
    scope: '',
    description: '',
    questions: [''],  // Start with one empty question
    duration_minutes: '', // Empty string instead of default value
  });
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [hexCode, setHexCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [createdInterview, setCreatedInterview] = useState(null);
  const fileInputRef = useRef(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    
    if (!file) {
      setCoverImage(null);
      setCoverImagePreview(null);
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
      e.target.value = null;
      return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setFileError('File is too large. Maximum size is 5MB.');
      e.target.value = null;
      return;
    }
    
    setCoverImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFileError('');

    const filteredQuestions = formData.questions.filter(q => q.trim() !== '');
    
    if (filteredQuestions.length === 0) {
      setError('Please add at least one question');
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('scope', formData.scope);
      formDataToSend.append('description', formData.description);
      
      // Convert questions array to comma-separated string
      formDataToSend.append('questions', filteredQuestions.join(','));
      
      // Add duration
      formDataToSend.append('duration_minutes', formData.duration_minutes);
      
      // Add cover image if exists
      if (coverImage) {
        formDataToSend.append('cover_image', coverImage);
      }

      const response = await fetch('https://demobackend-p2e1.onrender.com/interviews/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // Don't set Content-Type header, it will be set automatically with boundary
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create interview');
      }

      setHexCode(data.hex_code);
      setCreatedInterview(data);
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
            <div className="header-text">
              <h1>Create Interview</h1>
            </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {hexCode ? (
            <div className="success-card">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Interview Created!</h2>
              
              {createdInterview && createdInterview.cover_image_url && (
                <div className="cover-image-preview success">
                  <div className="image-container">
                    <img 
                      src={`https://demobackend-p2e1.onrender.com${createdInterview.cover_image_url}`} 
                      alt="Interview Cover" 
                    />
                  </div>
                </div>
              )}
              
              <div className="interview-details">
                <p><strong>Name:</strong> {createdInterview?.name}</p>
                <p><strong>Duration:</strong> {createdInterview?.duration_minutes} minutes</p>
                <p><strong>Questions:</strong> {createdInterview?.questions?.length || 0}</p>
              </div>
              
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
              
              <div className="form-group">
                <label htmlFor="duration" className="duration-label">
                  Interview Duration (minutes)
                </label>
                <input
                  id="duration"
                  type="number"
                  min="1"
                  max="240"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    duration_minutes: e.target.value ? parseInt(e.target.value) : ''
                  }))}
                  className="duration-input"
                  placeholder="Enter duration in minutes"
                  required
                />
              </div>
              
              <div className="form-group cover-image-group">
                <label htmlFor="cover-image" className="cover-image-label">
                  Cover Image (optional)
                </label>
                
                {fileError && <div className="file-error">{fileError}</div>}
                
                <div className="cover-image-input-container">
                  <input
                    id="cover-image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileChange}
                    className="cover-image-input"
                    ref={fileInputRef}
                  />
                  <div className="file-input-help">
                    Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                  </div>
                </div>
                
                {coverImagePreview && (
                  <div className="cover-image-preview">
                    <div className="image-container">
                      <img src={coverImagePreview} alt="Cover Preview" />
                    </div>
                    <button 
                      type="button" 
                      className="remove-image" 
                      onClick={handleRemoveImage}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
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