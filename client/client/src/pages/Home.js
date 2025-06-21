import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="card center">
      <h2>Welcome to AutoBuddy</h2>
      <p>Smart Auto-Rickshaw Sharing for Students</p>
      <Link to="/register"><button>Register</button></Link> &nbsp;
      <Link to="/login"><button>Login</button></Link>
    </div>
  );
}

export default Home; 