import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      <h2>Home Page</h2>
      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default Home;
