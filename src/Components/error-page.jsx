import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/errors.css';

const ErrorPage = () => {
    return (
        <div className="error-page-container">
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link to="/">Go back to homepage</Link>
        </div>
    );
};

export default ErrorPage;
