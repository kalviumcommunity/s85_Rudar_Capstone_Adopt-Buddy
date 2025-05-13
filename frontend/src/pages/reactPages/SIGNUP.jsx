import React, { useState } from 'react';
import axios from 'axios';
import '../pagesStyleSheet/SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'adopter', // Default role is 'adopter'
    phone: '',
    address: '',
    bio: '',
    profileImage: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      // Append all fields in formData to formDataToSend
      for (const key in formData) {
        if (key === 'profileImage' && formData[key]) {
          formDataToSend.append('profileImage', formData[key], formData[key].name);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      // Ensure the backend route is correct, update if necessary
      const response = await axios.post('http://localhost:5000/api/users/sign-up', formDataToSend);

      if (response.status === 201) {
        setLoading(false);
        alert('Sign Up Successful!');
      } else {
        setErrorMessage('Sign Up Failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error.response || error.message);
      setErrorMessage(`Sign Up Failed. ${error.response?.status || 'Unknown error'}`);
    }
  };

  return (
    <div id="signup-page">
      <div className="sign-up-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="adopter">Adopter</option>
              <option value="shelter">Shelter</option>
            </select>
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label>Profile Image</label>
            <input type="file" name="profileImage" onChange={handleFileChange} />
            {imagePreview && <img src={imagePreview} alt="Preview" />}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
