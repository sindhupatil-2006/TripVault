import React from 'react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          TripVault &copy; {new Date().getFullYear()} &bull; Built with 💙 by{' '}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Sindhu Patil
          </a>
        </p>
        <p className="footer-subtext">
          CodGen Virtual Internship Program &bull; Full Stack (MERN)
        </p>
      </div>
    </footer>
  );
};

export default Footer;
