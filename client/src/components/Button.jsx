const Button = ({ children, type = 'button', onClick, className = '', disabled = false, ...props }) => {
  return (
    <button type={type} onClick={onClick} className={`btn ${className}`.trim()} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
