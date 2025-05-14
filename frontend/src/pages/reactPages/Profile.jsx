import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../pagesStyleSheet/Profile.css';

function Profile() {

  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    address: user.address,
    bio: user.bio,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    address: user.address,
    bio: user.bio,
    profileImage: ''
  });

  const userId = user._id; // Assuming the user data is stored in localStorage.

  useEffect(() => {
    // Fetch user data
    axios.get(`http://localhost:5000/api/users/${userId}`)
      .then((response) => {
        setUserData(response.data);
        setFormData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    for (const key in formData) {
      updatedData.append(key, formData[key]);
    }

    axios.put(`http://localhost:5000/api/users/users/${userId}`, updatedData)
      .then((response) => {
        alert('Profile updated successfully');
        setIsEditing(false);
        setUserData(response.data);  // Update the user data state
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert('Failed to update profile');
      });
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete your profile?');
    if (confirmed) {
      axios.delete(`http://localhost:5000/api/users/users/${userId}`)
        .then(() => {
          alert('Profile deleted successfully');
          localStorage.removeItem('user');
          navigate('/');
        })
        .catch((error) => {
          console.error('Error deleting profile:', error);
          alert('Failed to delete profile');
        });
    }
  };

  return (
    <div id="profile-page">
      <div className="profile-container">
        <h2>User Profile</h2>
        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Bio:</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Profile Image:</label>
              <input
                type="file"
                name="profileImage"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        ) : (
            <div className="user-info">
                <div className="info-row">
                    <span className="label">First Name:</span>
                    <span className="value">{userData.firstName}</span>
                </div>
                <div className="info-row">
                    <span className="label">Last Name:</span>
                    <span className="value">{userData.lastName}</span>
                </div>
                <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{userData.email}</span>
                </div>
                <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{userData.phone}</span>
                </div>
                <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value">{userData.address}</span>
                </div>
                <div className="info-row">
                    <span className="label">Bio:</span>
                    <span className="value">{userData.bio}</span>
                </div>
                {userData.profileImage && (
                    <div className="info-row">
                    <span className="label">Profile Image:</span>
                    <img src={userData.profileImage} alt="Profile" className="profile-img" />
                    </div>
                )}
                <div className="button-row">
                    <button onClick={() => setIsEditing(true)}>Edit Profile</button>
                    <button onClick={handleDelete}>Delete Profile</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
