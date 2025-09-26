import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const API = process.env.REACT_APP_API_BASE || 'https://localhost:5000/api';

export default function Register({ setUser }) {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState('');
  const [role, setRole] = useState('customer');
  const [err,setErr] = useState('');
  const navigate = useNavigate();

  useEffect(()=> {
    fetch(API + '/cities').then(r=>r.json()).then(setCities).catch(()=>{});
  }, []);
  useEffect(() => {
  setName('');
  setEmail('');
  setPassword('');
  setRole('customer');
  setCityId('');
}, []);

  const submit = async e => {
    e.preventDefault(); setErr('');
    if (role === 'customer' && !cityId) {
      setErr('Select city for customer');
      return;
    }
    try {
      const res = await fetch(API + '/auth/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, password, role, city_id: role === 'customer' ? cityId : null })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/');
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}  autoComplete="off">
        <label>Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} required autoComplete="new-name" />
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="new-password" />
        <label>Role</label>
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        {role === 'customer' && (
          <>
            <label>City</label>
            <select value={cityId} onChange={e=>setCityId(e.target.value)} required>
              <option value="">Select city</option>
              {cities.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </>
        )}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
