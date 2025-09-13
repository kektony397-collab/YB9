
import React, { useState, useMemo } from 'react';
import { BIKE_DATA } from '../constants';
import { Bike } from '../types';

const BikeCard: React.FC<{ bike: Bike }> = ({ bike }) => (
  <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700/50 transform hover:scale-105 transition-transform duration-300">
    <img src={bike.image} alt={bike.name} className="w-full h-40 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-bold text-white">{bike.name}</h3>
      <p className="text-sm text-sky-400">{bike.brand}</p>
      <div className="mt-4 flex justify-between items-center text-sm text-slate-300">
        <span><span className="font-semibold text-white">{bike.mileage}</span> kmpl</span>
        <span><span className="font-semibold text-white">{bike.engine_cc}</span> cc</span>
      </div>
      <div className="mt-2 text-right font-bold text-lg text-green-400">
        {bike.price}
      </div>
    </div>
  </div>
);


export default function BikeDatabase() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBikes = useMemo(() => {
    if (!searchQuery) {
      return BIKE_DATA;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return BIKE_DATA.filter(bike =>
      bike.name.toLowerCase().includes(lowercasedQuery) ||
      bike.brand.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Bike Database</h2>
        <p className="text-slate-400">Search for your favorite bike models.</p>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
      
      {filteredBikes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBikes.map(bike => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <p className="text-slate-400">No bikes found for "{searchQuery}".</p>
        </div>
      )}

    </div>
  );
}
