import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <div>
      <h2>Home Page</h2>
      <button onClick={handleEditProfile}>Edit Profile</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
