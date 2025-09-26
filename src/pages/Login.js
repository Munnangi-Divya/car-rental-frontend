import React, { useState ,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  useEffect(() => {
  setEmail('');
  setPassword('');
 }, []);
  
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setErr('');
    try {
      const res = await fetch(API + '/auth/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
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
      <h2>Login</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit} autoComplete="off">
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="new-email"/>
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required  autoComplete="new-password"/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
