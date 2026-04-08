function Modal({ title, children, onClose }) {
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h3>{title}</h3>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default Modal;