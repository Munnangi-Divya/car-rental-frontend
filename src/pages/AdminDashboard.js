
import React, { useEffect, useState, useCallback } from 'react';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export default function AdminDashboard({ user }) {
  const [cities, setCities] = useState([]);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    model: '',
    brand: '',
    price_per_day: '',
    status: 'available',
    city_id: '',
  });
  const [filterCity, setFilterCity] = useState('');
  const token = localStorage.getItem('token');

  // -------------------------------
  // Fetch functions
  // -------------------------------
  const loadCities = useCallback(async () => {
    try {
      const res = await fetch(API + '/cities');
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error('Error loading cities:', err);
    }
  }, []);

  const loadCars = useCallback(async () => {
    try {
      const res = await fetch(API + '/cars', {
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await res.json();
      setCars(data);
    } catch (err) {
      console.error('Error loading cars:', err);
    }
  }, [token]);

  const loadBookings = useCallback(
    async (cityId) => {
      try {
        const url = API + '/bookings' + (cityId ? '?cityId=' + cityId : '');
        const res = await fetch(url, {
          headers: { Authorization: 'Bearer ' + token },
        });
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Error loading bookings:', err);
      }
    },
    [token]
  );

  // -------------------------------
  // Initial load
  // -------------------------------
  useEffect(() => {
    loadCities();
    loadCars();
    loadBookings();
  }, [loadCities, loadCars, loadBookings]);

  // -------------------------------
  // Add car
  // -------------------------------
  const addCar = async (e) => {
    e.preventDefault();
    if (!form.model || !form.brand || !form.price_per_day || !form.city_id)
      return alert('Fill all fields');

    try {
      const res = await fetch(API + '/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error adding car');
      setForm({ model: '', brand: '', price_per_day: '', status: 'available', city_id: '' });
      loadCars();
    } catch (err) {
      alert(err.message);
    }
  };

  // -------------------------------
  // Update car status
  // -------------------------------
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(API + '/cars/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error updating status');
      loadCars();
    } catch (err) {
      alert(err.message);
    }
  };

  // -------------------------------
  // Filter bookings by city
  // -------------------------------
  const onFilterChange = (cityId) => {
    setFilterCity(cityId);
    loadBookings(cityId);
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Add Car */}
      <div className="card">
        <h3>Add Car</h3>
        <form onSubmit={addCar}>
          <label>Model</label>
          <input
            value={form.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
            required
          />

          <label>Brand</label>
          <input
            value={form.brand}
            onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
            required
          />

          <label>Price per day</label>
          <input
            type="number"
            value={form.price_per_day}
            onChange={(e) => setForm((f) => ({ ...f, price_per_day: e.target.value }))}
            required
          />

          <label>City</label>
          <select
            value={form.city_id}
            onChange={(e) => setForm((f) => ({ ...f, city_id: e.target.value }))}
            required
          >
            <option value="">Select city</option>
            {cities.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <label>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="available">available</option>
            <option value="unavailable">unavailable</option>
          </select>

          <button type="submit">Add Car</button>
        </form>
      </div>

      {/* Cars List */}
      <div className="card">
        <h3>Cars</h3>
        <div className="grid">
          {cars.map((car) => (
            <div className="card" key={car._id}>
              <h4>
                {car.brand} {car.model}
              </h4>
              <p>City: {car.city_id?.name}</p>
              <p>Price/day: {car.price_per_day}</p>
              <p>Status: {car.status}</p>
              <button
                onClick={() =>
                  updateStatus(car._id, car.status === 'available' ? 'unavailable' : 'available')
                }
              >
                Toggle status
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bookings */}
      <div className="card">
        <h3>Bookings</h3>
        <label>Filter by city</label>
        <select value={filterCity} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="">All</option>
          {cities.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="grid">
          {bookings.map((b) => (
            <div className="card" key={b._id}>
              <h4>
                {b.car_id?.brand} {b.car_id?.model}
              </h4>
              <p>
                Customer: {b.customer_id?.name} ({b.customer_id?.email})
              </p>
              <p>
                From {new Date(b.start_date).toLocaleDateString()} to{' '}
                {new Date(b.end_date).toLocaleDateString()}
              </p>
              <p>Total: {b.total_price}</p>
              <p>City: {b.city_id?.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
