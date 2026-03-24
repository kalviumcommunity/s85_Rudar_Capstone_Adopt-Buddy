import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Loader2, Upload, PawPrint } from 'lucide-react';

const AddPet = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    species: 'Dog',
    breed: '',
    gender: 'male',
    description: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please select an image for the pet');
      return;
    }

    setLoading(true);
    setError('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value as string);
    });
    data.append('image', image);

    try {
      const response = await api.post('/pets', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/pets/${response.data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-orange-500 px-6 py-8 sm:p-10 text-white flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <PawPrint className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Add a New Pet</h1>
            <p className="mt-2 text-orange-100">Help a furry friend find their forever home.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pet Photo *</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:bg-gray-50 transition-colors">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="relative mx-auto w-48 h-48 mb-4">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg shadow-sm" />
                    <button
                      type="button"
                      onClick={() => { setImage(null); setImagePreview(null); }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g. Max"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age (years) *</label>
              <input
                type="number"
                name="age"
                required
                min="0"
                step="0.1"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g. 2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Species *</label>
              <select
                name="species"
                required
                value={formData.species}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border bg-white"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Breed *</label>
              <input
                type="text"
                name="breed"
                required
                value={formData.breed}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g. Golden Retriever"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender *</label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm px-3 py-2 border"
                placeholder="Tell potential adopters about the pet's personality, history, and needs..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-5 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Post Pet for Adoption'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPet;
