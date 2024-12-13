// src/components/ui/card/Card.jsx
import React from 'react';
import './Card.css';

export const Card = ({ children, className }) => (
    <div className={`card ${className || ''}`}>
        {children}
    </div>
);

export const CardHeader = ({ children }) => (
    <div className="card-header">
        {children}
    </div>
);

export const CardContent = ({ children }) => (
    <div className="card-content">
        {children}
    </div>
);

export const CardFooter = ({ children }) => (
    <div className="card-footer">
        {children}
    </div>
);

export const CardTitle = ({ children, className }) => (
    <h3 className={`card-title ${className || ''}`}>
        {children}
    </h3>
);

export default Card;
