
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Footer from './components/Footer';
import Register from './pages/Register';
import CustomerHome from './pages/CustomerHome';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized'; // ✅ added
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router> {/* ✅ Router wrapper to fix Link crash */}
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          {/* Home: redirect user to role-specific dashboard or login */}
          <Route
            path="/"
            element={
              user ? (
                user.role === 'admin' ? (
                  <AdminDashboard user={user} />
                ) : (
                  <CustomerHome user={user} />
                )
              ) : (
                <Login setUser={setUser} />
              )
            }
          />

          {/* Public routes */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          {/* Customer-only route */}
          <Route
            path="/history"
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <BookingHistory user={user} />
              </PrivateRoute>
            }
          />

          {/* Admin-only route */}
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard user={user} />
              </PrivateRoute>
            }
          />

          {/* Unauthorized route ✅ */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
