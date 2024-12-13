// src/components/ui/slider/Slider.jsx
import React from 'react';
import './Slider.css';

const Slider = ({ min = 0, max = 100, step = 1, value, onValueChange }) => {
    const handleChange = (e) => {
        const newValue = [Number(e.target.value), value[1]];
        onValueChange(newValue);
    };

    const handleChangeMax = (e) => {
        const newValue = [value[0], Number(e.target.value)];
        onValueChange(newValue);
    };

    return (
        <div className="slider-container">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[0]}
                onChange={handleChange}
                className="slider"
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value[1]}
                onChange={handleChangeMax}
                className="slider"
            />
        </div>
    );
};

export default Slider;
