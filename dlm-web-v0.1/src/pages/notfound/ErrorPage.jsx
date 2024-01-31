// ErrorPage.js
import React from 'react';
import './errorpage.css';
import blocked from '../../Assets/notfound.jpg'

const ErrorPage = ({ errorCode, errorMessage, errorimage }) => {
  return (
    <div className="containerE">
      <img src={errorimage} alt="" />
      <h2 className="error-code">{errorCode}</h2>
      <p className="error-message">{errorMessage}</p>
    </div>
  );
};

export default ErrorPage;
