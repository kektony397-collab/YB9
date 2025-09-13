
import React, { useState, useMemo } from 'react';

export default function FuelCalculator() {
  const [distance, setDistance] = useState('');
  const [fuel, setFuel] = useState('');
  const [price, setPrice] = useState('');

  const { mileage, costPerKm } = useMemo(() => {
    const numDistance = parseFloat(distance);
    const numFuel = parseFloat(fuel);
    const numPrice = parseFloat(price);

    if (numDistance > 0 && numFuel > 0) {
      const calculatedMileage = (numDistance / numFuel).toFixed(2);
      if (numPrice > 0) {
        const calculatedCostPerKm = (numPrice * numFuel / numDistance).toFixed(2);
        return { mileage: calculatedMileage, costPerKm: calculatedCostPerKm };
      }
      return { mileage: calculatedMileage, costPerKm: null };
    }

    return { mileage: null, costPerKm: null };
  }, [distance, fuel, price]);

  const InputField: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string, unit: string}> = ({ label, value, onChange, placeholder, unit}) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <div className="relative">
            <input
                type="number"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 appearance-none"
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-slate-400">{unit}</span>
        </div>
    </div>
  );


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Fuel Management</h2>
        <p className="text-slate-400">Calculate your bike's mileage and trip cost.</p>
      </div>

      <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-4">
        <InputField label="Distance Traveled" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="e.g., 350" unit="km" />
        <InputField label="Fuel Consumed" value={fuel} onChange={(e) => setFuel(e.target.value)} placeholder="e.g., 10" unit="liters" />
        <InputField label="Price per Liter (Optional)" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 105.5" unit="₹" />
      </div>

      {(mileage || costPerKm) && (
        <div className="p-6 bg-green-900/50 rounded-xl border border-green-700/50 space-y-4 text-center">
            <h3 className="text-xl font-semibold text-green-300">Calculation Result</h3>
            <div className="flex justify-around items-center">
                {mileage && (
                    <div>
                        <p className="text-sm text-green-200">Mileage</p>
                        <p className="text-4xl font-bold text-white">{mileage}<span className="text-lg ml-1">km/l</span></p>
                    </div>
                )}
                {costPerKm && (
                    <div>
                        <p className="text-sm text-green-200">Cost</p>
                        <p className="text-4xl font-bold text-white">{costPerKm}<span className="text-lg ml-1">₹/km</span></p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
