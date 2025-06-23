import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [form, setForm] = useState({ timeSlot: '', pickupLocation: '', dropLocation: '' });
  const [rides, setRides] = useState([]);
  const [message, setMessage] = useState('');
  const [notification, setNotification] = useState('');
  const [prevBookedIds, setPrevBookedIds] = useState([]);
  const [fadeOut, setFadeOut] = useState(false);

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
  const hasAssignedRide = rides.some(ride => ride.driver && ride.driver.name && ride.status !== 'completed');
  const assignedRide = rides.find(ride => ride.driver && ride.driver.name && ride.status !== 'completed');

  // Animation: fade out cards when ride is assigned
  useEffect(() => {
    if (hasAssignedRide) {
      setFadeOut(true);
      const timer = setTimeout(() => setFadeOut(false), 500);
      return () => clearTimeout(timer);
    }
  }, [hasAssignedRide]);

  return (
    <div>
      {notification && <div className="notification">{notification}</div>}
      {!hasAssignedRide && (
        <form onSubmit={handleSubmit} className="form">
          <input name="timeSlot" placeholder="Time Slot (e.g. 5:00 PM)" value={form.timeSlot} onChange={handleChange} required />
          <input name="pickupLocation" placeholder="Pickup Location" value={form.pickupLocation} onChange={handleChange} required />
          <input name="dropLocation" placeholder="Drop Location" value={form.dropLocation} onChange={handleChange} required />
          <button type="submit">Book Ride</button>
        </form>
      )}
      {message && <p className="center" style={{ color: 'red' }}>{message}</p>}
      {hasAssignedRide ? (
        <div className="card center bounce" style={{ maxWidth: 500, fontSize: 20, background: '#e2e3ff', color: '#383d56' }}>
          <b>Your auto is on the way!</b>
        </div>
      ) : (
        <>
          <h3 className="center" style={{ color: '#2d6cdf', marginTop: 32 }}>My Rides</h3>
          {rides.length === 0 && <p className="center">No rides yet.</p>}
          {rides.map((ride, i) => (
            <div key={ride._id || i} className={`card${fadeOut ? ' fadeOut' : ''}`}>
              <div className="rideTitle">Time Slot: {ride.timeSlot}</div>
              <b>Pickup:</b> {ride.pickupLocation}<br />
              <b>Drop:</b> {ride.dropLocation}<br />
              <b>Status:</b> {ride.status}<br />
              <b>Members:</b>
              <ul>
                {ride.students.map(s => <li key={s.email}>{s.name} ({s.collegeId})</li>)}
              </ul>
              {ride.driver && ride.driver.name && (
                <div className="driverBox">
                  <b>Your auto driver {ride.driver.name} ({ride.driver.phone}) will wait outside your college.</b>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Dashboard; 