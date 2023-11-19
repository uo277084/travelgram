import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorNotFound.css';

const ErrorNotFound = () => {
    return (
        <div className="error-container">
            <div className="error-content">
                <h1 className="error-title">404 Not Found</h1>
                <p className="error-message">La página que estás buscando no se encuentra.</p>
                <Link to="/travelgram/#/" className="error-link">Volver al inicio de sesión</Link>
            </div>
        </div>
    );
};

export default ErrorNotFound;
