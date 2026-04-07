function Button({ text, onClick, type = "button" }) {
    return (
        <button type={type} onClick={onClick} className="btn">
            {text}
        </button>
    );
}

export default Button;
