import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  page: {
    background: '#f4f6fb',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    padding: 0,
    margin: 0,
  },
  header: {
    background: '#2d6cdf',
    color: 'white',
    padding: '20px 0',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 2,
    fontWeight: 700,
    fontSize: 28,
    boxShadow: '0 2px 8px #0001',
  },
  card: {
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 8px #0002',
    margin: '16px 0',
    padding: 24,
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  form: {
    maxWidth: 400,
    margin: '0 auto 24px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    background: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 8px #0001',
    padding: 24,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: '1px solid #bfc7d1',
    fontSize: 16,
  },
  button: {
    background: '#2d6cdf',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '10px 0',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    marginTop: 8,
    transition: 'background 0.2s',
  },
  notification: {
    background: '#d4edda',
    color: '#155724',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    textAlign: 'center',
    fontWeight: 500,
  },
  driverBox: {
    background: '#e2e3ff',
    color: '#383d56',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    fontWeight: 500,
    textAlign: 'center',
  },
  rideTitle: {
    color: '#2d6cdf',
    fontWeight: 600,
    fontSize: 18,
    marginBottom: 8,
  },
};

function Dashboard() {
  const [form, setForm] = useState({ timeSlot: '', pickupLocation: '', dropLocation: '' });
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState('');
  const [prevBookedIds, setPrevBookedIds] = useState([]);

  const token = localStorage.getItem('token');

  const fetchRides = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ride/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(res.data.rides);
      // Notification for new booked rides
      const bookedIds = res.data.rides.filter(r => r.status === 'booked').map(r => r._id);
      const newBooked = bookedIds.filter(id => !prevBookedIds.includes(id));
      if (newBooked.length > 0) {
        setNotification('Your ride has been booked!');
        setTimeout(() => setNotification(''), 4000);
      }
      setPrevBookedIds(bookedIds);
    } catch (err) {
      setMessage('Failed to fetch rides.');
    }
  };

  useEffect(() => { fetchRides(); /* eslint-disable-next-line */ }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/ride/book', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Ride booking requested!');
      setNotification('Ride booking requested!');
      setTimeout(() => setNotification(''), 4000);
      fetchRides();
    } catch (err) {
      setMessage('Booking failed.');
    }
  };

  // Hide booking form if user has a ride with a driver assigned
  const hasAssignedRide = rides.some(ride => ride.driver && ride.driver.name);

  return (
    <div style={styles.page}>
      <div style={styles.header}>AutoBuddy Student Dashboard</div>
      {notification && <div style={styles.notification}>{notification}</div>}
      {!hasAssignedRide && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input name="timeSlot" placeholder="Time Slot (e.g. 5:00 PM)" value={form.timeSlot} onChange={handleChange} required style={styles.input} />
          <input name="pickupLocation" placeholder="Pickup Location" value={form.pickupLocation} onChange={handleChange} required style={styles.input} />
          <input name="dropLocation" placeholder="Drop Location" value={form.dropLocation} onChange={handleChange} required style={styles.input} />
          <button type="submit" style={styles.button}>Book Ride</button>
        </form>
      )}
      {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
      <h3 style={{ textAlign: 'center', color: '#2d6cdf', marginTop: 32 }}>My Rides</h3>
      {rides.length === 0 && <p style={{ textAlign: 'center' }}>No rides yet.</p>}
      {rides.map((ride, i) => (
        <div key={ride._id || i} style={styles.card}>
          <div style={styles.rideTitle}>Time Slot: {ride.timeSlot}</div>
          <b>Pickup:</b> {ride.pickupLocation}<br />
          <b>Drop:</b> {ride.dropLocation}<br />
          <b>Status:</b> {ride.status}<br />
          <b>Members:</b>
          <ul>
            {ride.students.map(s => <li key={s.email}>{s.name} ({s.collegeId})</li>)}
          </ul>
          {ride.driver && ride.driver.name && (
            <div style={styles.driverBox}>
              <b>Your auto driver {ride.driver.name} ({ride.driver.phone}) will wait outside your college.</b>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard; 