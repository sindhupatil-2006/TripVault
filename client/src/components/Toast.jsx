const Toast = ({ message, type = 'info', onClose }) => {
  return (
    <div className={`toast ${type}`} role="status">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;
