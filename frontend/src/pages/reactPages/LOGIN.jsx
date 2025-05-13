import React, { useState } from 'react';
import axios from 'axios';
import '../pagesStyleSheet/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);

      if (response.status === 200) {
        setLoading(false);
        alert('Login Successful!');
        // Redirect or handle successful login
      } else {
        setErrorMessage('Login Failed. Please check your credentials.');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage('Login Failed. Invalid credentials or server error.');
      console.error('Error:', error);
    }
  };

  return (
    <div id="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
