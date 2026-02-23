// GOOD version - recommended
import React from 'react';

const Button = ({ text, type = 'button', disabled = false, ...props }) => {
    return (
        <button
            type={type}               // ← crucial: allows "submit"
            disabled={disabled}
            {...props}
        >
            {text}
        </button>
    );
};

export default Button;