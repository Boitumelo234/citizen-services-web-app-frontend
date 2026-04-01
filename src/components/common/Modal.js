import React from 'react';

function Modal({ title, children, onClose }) {
    return (
        /* The backdrop covers the whole screen */
        <div className="modal-backdrop" onClick={onClose}>
            {/* stopPropagation prevents the modal from closing when you click inside the form */}
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ color: '#003366', marginBottom: '1.5rem', textAlign: 'center' }}>
                    {title}
                </h2>

                {children}

                <button
                    onClick={onClose}
                    style={{
                        marginTop: '1.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        width: '100%',
                        fontSize: '0.9rem'
                    }}
                >
                    Cancel and Close
                </button>
            </div>
        </div>
    );
}

// This line is what the error is looking for!
export default Modal;