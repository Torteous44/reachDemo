import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/CreateInterview.css";

function CreateInterview() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [scope, setScope] = useState("");
  const [questions, setQuestions] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addQuestion = () => {
    setQuestions([...questions, ""]);
  };

  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  async function handleCreate(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("You must be logged in first.");
      setIsLoading(false);
      return;
    }

    const filteredQuestions = questions.filter(q => q.trim() !== "");

    try {
      const resp = await fetch("http://localhost:8000/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          scope,
          questions: filteredQuestions
        })
      });
      
      if (!resp.ok) throw new Error("Failed to create interview");
      
      const data = await resp.json();
      setSuccess(`Interview created successfully with ID ${data.id}`);
      setName("");
      setScope("");
      setQuestions([""]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="create-interview-wrapper">
      <Navbar />
      
      <div className="create-interview-container">
        <button 
          className="back-arrow" 
          onClick={() => navigate('/dashboard')}
          aria-label="Back to Dashboard"
        >
          ←
        </button>
        
        <div className="create-interview-header">
          <h2>Create New Interview</h2>
          <p>Set up your interview template with questions</p>
        </div>

        <div className="create-interview-form">
          <form onSubmit={handleCreate}>
            <div className="form-section">
              <label>Interview Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter interview name"
                required
              />
            </div>

            <div className="form-section">
              <label>Interview Scope</label>
              <textarea 
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                placeholder="Describe what you want to learn from this interview"
                rows="3"
              />
            </div>

            <div className="form-section">
              <label>Questions</label>
              <div className="questions-container">
                {questions.map((question, index) => (
                  <div key={index} className="question-item">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      placeholder={`Question ${index + 1}`}
                    />
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="remove-question"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={addQuestion}
                className="add-question"
              >
                + Add Question
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button 
              type="submit" 
              className="create-button"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Interview"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateInterview; 