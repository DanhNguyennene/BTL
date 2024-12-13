// src/components/ui/sheet/Sheet.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './Sheet.css';

export const Sheet = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div className="sheet-overlay" onClick={onClose}></div>
            <div className="sheet-container">
                {children}
            </div>
        </>,
        document.body
    );
};

export const SheetTrigger = ({ children, onOpen }) => (
    <div onClick={onOpen}>
        {children}
    </div>
);

export const SheetContent = ({ children }) => (
    <div className="sheet-content">
        {children}
    </div>
);

export const SheetHeader = ({ children }) => (
    <div className="sheet-header">
        {children}
    </div>
);

export const SheetTitle = ({ children }) => (
    <h2 className="sheet-title">
        {children}
    </h2>
);
