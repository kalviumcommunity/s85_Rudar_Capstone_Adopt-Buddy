import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Loader2, MapPin, Heart, MessageSquare, ArrowLeft } from 'lucide-react';

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const { data } = await api.get(`/pets/${id}`);
        setPet(data);
      } catch (error) {
        console.error('Failed to fetch pet details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleAdoptRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await api.post('/requests', {
        petId: id,
        message: requestMessage,
      });
      setSuccess('Adoption request sent successfully!');
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChat = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post('/chats', { userId: pet.shelter._id });
      navigate('/chat');
    } catch (error) {
      console.error('Failed to start chat', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900">Pet not found</h2>
        <button onClick={() => navigate('/pets')} className="mt-4 text-orange-500 hover:underline">
          Go back to pets
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-orange-500 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </button>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center">
          <Heart className="h-5 w-5 mr-2" /> {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="h-96 md:h-auto relative">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {pet.isAdopted && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-xl shadow-lg transform -rotate-12">
                  ADOPTED
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-8 lg:p-12 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-extrabold text-gray-900">{pet.name}</h1>
              <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 capitalize">
                {pet.gender}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-600">
              <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Species</span>
                <span className="font-medium text-gray-900">{pet.species}</span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Breed</span>
                <span className="font-medium text-gray-900">{pet.breed}</span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                <span className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">Age</span>
                <span className="font-medium text-gray-900">{pet.age} years</span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About {pet.name}</h3>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{pet.description}</p>
            </div>

            <div className="mt-auto border-t border-gray-100 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={pet.shelter.profileImage || 'https://picsum.photos/seed/user/200/200'}
                    alt={pet.shelter.firstName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-orange-100"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-sm text-gray-500">Shelter</p>
                    <p className="font-semibold text-gray-900">{pet.shelter.firstName} {pet.shelter.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {pet.shelter.address || 'Location not provided'}
                </div>
              </div>

              {user?.role !== 'shelter' && !pet.isAdopted && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-xl font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Heart className="h-5 w-5" /> Adopt Me
                  </button>
                  <button
                    onClick={handleChat}
                    className="bg-white border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500 text-gray-700 py-3 px-6 rounded-xl font-semibold shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="h-5 w-5" /> Chat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Adoption Request Modal */}
      {showModal && (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={handleAdoptRequest}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Heart className="h-6 w-6 text-orange-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Adopt {pet.name}
                      </h3>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Why would you be a good match for {pet.name}?
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                          className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md border p-3"
                          placeholder="Tell the shelter about your home, experience with pets, etc."
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default PetDetails;
