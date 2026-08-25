const Toast = ({ message, type = 'info', onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✨';
      case 'error':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`toast ${type}`} role="status" aria-live="polite">
      <span className="toast-icon">{getIcon()}</span>
      <span className="toast-message">{message}</span>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Close toast">×</button>
    </div>
  );
};

export default Toast;
