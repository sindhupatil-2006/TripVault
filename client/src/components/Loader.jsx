const Loader = ({ fullScreen = false }) => {
  return (
    <div className={fullScreen ? 'loader-screen' : 'loader'}>
      <div className="spinner" />
    </div>
  );
};

export default Loader;
