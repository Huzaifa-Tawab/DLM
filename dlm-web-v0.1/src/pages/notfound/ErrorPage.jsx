// ErrorPage.js
import React from 'react';
import './errorpage.css';

const ErrorPage = ({ errorCode, errorMessage }) => {
  return (
    <div className="containerE">
      <h2 className="error-code">{errorCode}</h2>
      <p className="error-message">{errorMessage}</p>
    </div>
  );
};

export default ErrorPage;
