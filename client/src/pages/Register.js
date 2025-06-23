import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', collegeId: '', address: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, form);
      setMessage('Registration successful! You can now log in.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="card">
      <h2 className="center">Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="College Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="collegeId" placeholder="College ID" value={form.collegeId} onChange={handleChange} required />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      {message && <p className="center" style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}

export default Register; 