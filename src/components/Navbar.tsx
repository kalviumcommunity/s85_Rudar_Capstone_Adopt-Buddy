import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PawPrint, LogOut, User as UserIcon, MessageSquare, PlusCircle, ClipboardList } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <PawPrint className="h-8 w-8 text-orange-500" />
              <span className="font-bold text-xl text-gray-900">Adopt Buddy</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/pets" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Browse Pets
            </Link>

            {user ? (
              <>
                {user.role === 'shelter' && (
                  <Link to="/add-pet" className="text-gray-700 hover:text-orange-500 font-medium transition-colors flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" /> Add Pet
                  </Link>
                )}
                
                <Link to="/requests" className="text-gray-700 hover:text-orange-500 font-medium transition-colors flex items-center gap-1">
                  <ClipboardList className="h-4 w-4" /> Requests
                </Link>

                <Link to="/chat" className="text-gray-700 hover:text-orange-500 font-medium transition-colors flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> Chat
                </Link>

                <div className="relative group ml-4">
                  <button className="flex items-center gap-2 focus:outline-none">
                    <img
                      src={user.profileImage || 'https://picsum.photos/seed/user/200/200'}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover border-2 border-orange-200"
                    />
                    <span className="text-sm font-medium text-gray-700">{user.firstName}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 flex items-center gap-2">
                      <UserIcon className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 ml-4">
                <Link to="/login" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
