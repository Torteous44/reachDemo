import React, { useState } from "react";
import "../styles/SharedStyles.css";

function StartSession() {
  const [interviewId, setInterviewId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("You must be logged in first.");
      setIsLoading(false);
      return;
    }

    try {
      const resp = await fetch("http://localhost:8000/sessions/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ interview_id: parseInt(interviewId, 10) })
      });

      if (!resp.ok) throw new Error("Failed to start session");
      
      const data = await resp.json();
      window.location.href = `/interview/${data.id}`;
    } catch (err) {
      setError(err.message || "Error starting session");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Start Interview Session</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleStart}>
        <div className="form-group">
          <label className="form-label">Interview ID</label>
          <input 
            className="form-input"
            value={interviewId}
            onChange={(e) => setInterviewId(e.target.value)}
            type="number"
            placeholder="Enter Interview ID"
            required
          />
        </div>

        <button 
          type="submit" 
          className="form-button"
          disabled={isLoading}
        >
          {isLoading ? "Starting Session..." : "Start Session"}
        </button>
      </form>
    </div>
  );
}

export default StartSession; 