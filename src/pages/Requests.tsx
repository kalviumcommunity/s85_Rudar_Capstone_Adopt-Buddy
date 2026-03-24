import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Loader2, CheckCircle, XCircle, Clock, MessageSquare, ClipboardList } from 'lucide-react';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/requests');
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/requests/${id}`, { status });
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Adoption Requests</h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'shelter' ? 'Manage incoming applications for your pets.' : 'Track the status of your adoption applications.'}
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <ClipboardList className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-900">No requests found</h3>
          <p className="mt-2 text-gray-500">
            {user?.role === 'shelter' ? "You don't have any adoption requests yet." : "You haven't applied to adopt any pets yet."}
          </p>
          {user?.role === 'adopter' && (
            <Link to="/pets" className="mt-6 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600">
              Browse Pets
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm overflow-hidden sm:rounded-xl border border-gray-100">
          <ul className="divide-y divide-gray-200">
            {requests.map((request: any) => (
              <li key={request._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Pet Info */}
                  <div className="shrink-0">
                    <Link to={`/pets/${request.pet._id}`}>
                      <img className="h-24 w-24 rounded-lg object-cover border border-gray-200" src={request.pet.image} alt={request.pet.name} referrerPolicy="no-referrer" />
                    </Link>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/pets/${request.pet._id}`} className="text-lg font-bold text-gray-900 hover:text-orange-500">
                            {request.pet.name}
                          </Link>
                          <p className="text-sm text-gray-500">{request.pet.species} • {request.pet.breed}</p>
                        </div>
                        <div>{getStatusBadge(request.status)}</div>
                      </div>
                      
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {user?.role === 'shelter' ? `Message from ${request.adopter.firstName}:` : 'Your message:'}
                        </p>
                        <p className="text-sm text-gray-600 italic">"{request.message}"</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {user?.role === 'shelter' ? (
                          <span className="flex items-center gap-2">
                            <img src={request.adopter.profileImage || 'https://picsum.photos/seed/user/200/200'} alt="" className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
                            Applicant: {request.adopter.firstName} {request.adopter.lastName}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <img src={request.shelter.profileImage || 'https://picsum.photos/seed/user/200/200'} alt="" className="h-6 w-6 rounded-full" referrerPolicy="no-referrer" />
                            Shelter: {request.shelter.firstName} {request.shelter.lastName}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="text-gray-500 hover:text-orange-500 p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        
                        {user?.role === 'shelter' && request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'approved')}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(request._id, 'rejected')}
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Requests;
