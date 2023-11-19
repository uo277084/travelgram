import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorNotFound.css';

const ErrorConnection = () => {
    return (
        <div className="error-container">
            <div className="error-content">
                <h1 className="error-title">500 Server Error</h1>
                <p className="error-message">No se puede establecer conexión con el servidor.</p>
                <p className="error-message">Inténtelo más tarde.</p>
                <Link to="/travelgram/#/" className="error-link">Volver al inicio de sesión</Link>
            </div>
        </div>
    );
};

export default ErrorConnection;
