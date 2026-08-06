const Button = ({ children, type = 'button', onClick, className = '' }) => {
  return (
    <button type={type} onClick={onClick} className={`btn ${className}`.trim()}>
      {children}
    </button>
  );
};

export default Button;
