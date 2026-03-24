import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
          Find your new <span className="text-orange-500">best friend</span> today.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
          Adopt Buddy connects loving homes with pets in need. Browse thousands of adoptable pets from local shelters and rescues.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link
            to="/pets"
            className="rounded-full bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-all"
          >
            Find a Pet
          </Link>
          <Link
            to="/signup"
            className="rounded-full px-8 py-3.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:ring-slate-300 transition-all bg-white"
          >
            Register Shelter
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-orange-500">Adopt, Don't Shop</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to adopt a pet
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                    <Search className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Easy Search
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Filter by species, breed, age, and location to find the perfect match for your family and lifestyle.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                    <ShieldCheck className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Verified Shelters
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  We work exclusively with verified shelters and rescue organizations to ensure safe and ethical adoptions.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
                    <Heart className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Direct Communication
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Chat directly with shelters in real-time to ask questions and arrange meet-and-greets.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
