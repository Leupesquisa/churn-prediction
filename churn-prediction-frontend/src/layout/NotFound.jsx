import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>The page you're looking for doesn't exist!</p>
      <Link to="/" style={styles.homeLink}>Go Back to Home</Link>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f3f3f3',
    color: '#333',
    textAlign: 'center',
  },
  title: {
    fontSize: '48px',
    marginBottom: '20px',
    color: '#FF9900', // Amazon's orange color
  },
  message: {
    fontSize: '18px',
    marginBottom: '30px',
    color: '#555',
  },
  homeLink: {
    fontSize: '16px',
    padding: '10px 20px',
    backgroundColor: '#FF9900',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  },
  homeLinkHover: {
    backgroundColor: '#e68a00',
  },
};

export default NotFound;
