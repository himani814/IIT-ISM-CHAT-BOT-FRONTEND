import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import '../styles/adminLogin.css';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy validation (replace with real backend call)
    if (adminId === 'admin' && password === 'password123') {
      Cookies.set('adminid', adminId, { expires: 1 });
      navigate('/admin/upload/iit-ism-llama-text-embed-v2-index');
    } else {
      setError('Invalid admin ID or password.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Admin Login</h2>
        {error && <p className="admin-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="adminId">Admin ID</label>
          <input
            type="text"
            id="adminId"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
