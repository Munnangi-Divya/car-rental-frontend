import React, { useEffect, useState } from 'react';
import './BookingHistory.css';

const API = process.env.REACT_APP_API_BASE || 'https://car-rental-backend-1-e7w9.onrender.com/api';

export default function BookingHistory({ user }) {
  const [bookings, setBookings] = useState([]);
  const [err, setErr] = useState('');

  useEffect(()=> {
    if (!user) return;
    const token = localStorage.getItem('token');
    fetch(API + '/bookings/my', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(setBookings)
      .catch(e => setErr('Failed to load'));
  }, [user]);

  if (!user) return <div>Please login</div>;

  return (
    <div>
      <h2>My Bookings</h2>
      {err && <div className="error">{err}</div>}
      <div className="grid">
        {bookings.map(b => (
          <div className="card" key={b._id}>
            <h4>{b.car_id?.brand} {b.car_id?.model}</h4>
            <p>From: {new Date(b.start_date).toLocaleDateString()}</p>
            <p>To: {new Date(b.end_date).toLocaleDateString()}</p>
            <p>Total: {b.total_price}</p>
            <p>City: {b.city_id?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
