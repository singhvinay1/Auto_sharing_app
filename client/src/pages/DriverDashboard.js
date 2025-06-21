import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [driver, setDriver] = useState({ name: '', phone: '' });
  const [message, setMessage] = useState('');

  const fetchRides = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/ride/available');
      setRides(res.data.rides);
    } catch {
      setMessage('Failed to fetch rides.');
    }
  };

  useEffect(() => { fetchRides(); }, []);

  const handleAccept = async (rideId) => {
    if (!driver.name || !driver.phone) {
      setMessage('Enter driver name and phone.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/ride/assign', { rideId, driverName: driver.name, driverPhone: driver.phone });
      setMessage('Ride assigned!');
      fetchRides();
    } catch {
      setMessage('Failed to assign ride.');
    }
  };

  return (
    <div>
      <div className="header">AutoBuddy Driver Dashboard</div>
      <div className="card form center" style={{ maxWidth: 500 }}>
        <input placeholder="Driver Name" value={driver.name} onChange={e => setDriver({ ...driver, name: e.target.value })} />
        <input placeholder="Driver Phone" value={driver.phone} onChange={e => setDriver({ ...driver, phone: e.target.value })} />
        <button onClick={fetchRides}>Refresh</button>
        {message && <p style={{ color: message.includes('assigned') ? 'green' : 'red' }}>{message}</p>}
      </div>
      <h3 className="center" style={{ color: '#2d6cdf', marginTop: 32 }}>Available Rides</h3>
      {rides.length === 0 && <p className="center">No available rides.</p>}
      {rides.map(ride => (
        <div key={ride._id} className="card">
          <div className="rideTitle">Time Slot: {ride.timeSlot}</div>
          <b>Pickup:</b> {ride.pickupLocation}<br />
          <b>Drop:</b> {ride.dropLocation}<br />
          <b>Members:</b>
          <ul>
            {ride.students.map(s => <li key={s._id}>{s.name} ({s.address})</li>)}
          </ul>
          <button onClick={() => handleAccept(ride._id)}>Accept Ride</button>
        </div>
      ))}
    </div>
  );
}

export default DriverDashboard; 