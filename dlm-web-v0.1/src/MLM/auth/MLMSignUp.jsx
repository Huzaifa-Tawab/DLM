import React, { useState } from "react";

function MLMSignUp() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");
  function handleSubmit(e) {}
  return (
    <div className="MLMSignUp-Main">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email:
            <br />
            <input
              type="text"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </label>
          <br />
          <label>
            Password:
            <br />
            <input
              type="password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </label>
          <br />
          {error && <div className="error-message">{error}</div>}
          <br />
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default MLMSignUp;
