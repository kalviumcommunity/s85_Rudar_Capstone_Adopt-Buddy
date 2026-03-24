import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Loader2, Settings, User as UserIcon } from 'lucide-react';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: '',
    phone: '',
    address: '',
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/me');
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          bio: data.bio || '',
          phone: data.phone || '',
          address: data.address || '',
        });
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value as string);
    });
    
    if (profileImage) {
      data.append('profileImage', profileImage);
    }

    try {
      const response = await api.put('/users/update', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 px-6 py-8 sm:p-10 text-white flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-orange-100">
              Welcome back, {user?.firstName}! You are logged in as a <span className="font-semibold capitalize">{user?.role}</span>.
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white/20 hover:bg-white/30 transition-colors p-2 rounded-full backdrop-blur-sm"
          >
            <Settings className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10">
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <img
                    src={profileImage ? URL.createObjectURL(profileImage) : user?.profileImage || 'https://picsum.photos/seed/user/200/200'}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover border-4 border-orange-100"
                    referrerPolicy="no-referrer"
                  />
                  <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-orange-600 shadow-sm">
                    <UserIcon className="h-4 w-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
                  <p className="text-sm text-gray-500">JPG, PNG or WEBP. Max 5MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
                    placeholder="Tell us a bit about yourself or your shelter..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <img
                  src={user?.profileImage || 'https://picsum.photos/seed/user/200/200'}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-4 border-gray-50"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                  <p className="text-gray-500">@{user?.username}</p>
                </div>
              </div>

              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{user?.role}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.phone || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formData.address || 'Not provided'}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Bio</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{formData.bio || 'No bio provided yet.'}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
