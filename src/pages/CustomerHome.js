import React, { useEffect, useState } from 'react';
import './CustomerHome.css';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export default function CustomerHome({ user }) {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(user?.city_id || '');
  const [cars, setCars] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState({ carId: '', start: '', end: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(API + '/cities')
      .then(r => r.json())
      .then(setCities)
      .catch(err => setErr('Failed to load cities: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedCity) return setCars([]);
    setLoading(true);
    fetch(API + '/cars?cityId=' + selectedCity)
      .then(r => r.json())
      .then(setCars)
      .catch(err => setErr('Failed to load cars: ' + err.message))
      .finally(() => setLoading(false));
  }, [selectedCity]);

  const openBooking = (carId) => {
    setBookInfo({ carId, start: '', end: '' });
    setMessage('');
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setMessage('');
    const { carId, start, end } = bookInfo;
    if (!carId || !start || !end) {
      setMessage('Fill all fields');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API + '/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ car_id: carId, start_date: start, end_date: end })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Booking failed');
      setMessage('Booked successfully. Total price: ' + (data.booking?.total_price || 0));
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Find Cars</h2>
      {err && <div className="error">{err}</div>}
      <div className="card">
        <label>Select city</label>
        <select value={selectedCity || ''} onChange={e => setSelectedCity(e.target.value)}>
          <option value="">Pick a city</option>
          {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <h3>Available Cars</h3>
        {loading && <p>Loading...</p>}
        <div className="grid">
          {!loading && cars.length === 0 && <p>No cars found</p>}
          {cars.map(car => (
            <div className="card" key={car._id}>
              <h4>{car.brand} {car.model}</h4>
              <p>Price/day: {car.price_per_day}</p>
              <p>Status: {car.status}</p>
              <button onClick={() => openBooking(car._id)}>Book</button>
            </div>
          ))}
        </div>
      </div>

      {bookInfo.carId && (
        <div className="card">
          <h3>Book Car</h3>
          <form onSubmit={submitBooking}>
            <label>Start date</label>
            <input type="date" value={bookInfo.start} onChange={e => setBookInfo(s => ({ ...s, start: e.target.value }))} required />
            <label>End date</label>
            <input type="date" value={bookInfo.end} onChange={e => setBookInfo(s => ({ ...s, end: e.target.value }))} required />
            <button type="submit">Confirm Booking</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      )}
    </div>
  );
}
