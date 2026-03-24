import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Info } from 'lucide-react';

interface PetCardProps {
  pet: {
    _id: string;
    name: string;
    age: number;
    species: string;
    breed: string;
    gender: string;
    image: string;
    shelter: {
      firstName: string;
      lastName: string;
    };
    createdAt: string;
  };
}

const PetCard = memo(({ pet }: PetCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          src={pet.image}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
          {pet.species}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 truncate pr-2">{pet.name}</h3>
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
            {pet.gender}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 font-medium">{pet.breed} • {pet.age} years old</p>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">Shelter: {pet.shelter.firstName} {pet.shelter.lastName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>Added {new Date(pet.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <Link
          to={`/pets/${pet._id}`}
          className="mt-5 w-full flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Info className="h-4 w-4" /> View Details
        </Link>
      </div>
    </div>
  );
});

export default PetCard;
