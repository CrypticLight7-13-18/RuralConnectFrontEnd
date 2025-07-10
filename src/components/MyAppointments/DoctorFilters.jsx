// src/components/Appointments/DoctorFilters.jsx
import { memo, useState, useCallback } from 'react';
import { DOCTOR_SPECIALIZATIONS } from '../../constants/MyAppointments.constants';

const DoctorFilters = memo(({ 
  filters, 
  onFiltersChange,
  onSearch,
  isSearching = false 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = useCallback((field, value) => {
    const updatedFilters = { ...localFilters, [field]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  }, [localFilters, onFiltersChange]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSearch(localFilters);
  }, [localFilters, onSearch]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      search: '',
      specialization: '',
      location: '',
      maxFee: '',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onSearch(resetFilters);
  }, [onFiltersChange, onSearch]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">
        Find Doctors
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="doctor-search" className="sr-only">
              Search doctors by name
            </label>
            <input
              id="doctor-search"
              type="text"
              placeholder="Search doctors..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
              disabled={isSearching}
            />
          </div>

          <div>
            <label htmlFor="specialization-filter" className="sr-only">
              Filter by specialization
            </label>
            <select
              id="specialization-filter"
              value={localFilters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
              disabled={isSearching}
            >
              <option value="">All Specializations</option>
              {DOCTOR_SPECIALIZATIONS.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location-filter" className="sr-only">
              Filter by location
            </label>
            <input
              id="location-filter"
              type="text"
              placeholder="Location"
              value={localFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
              disabled={isSearching}
            />
          </div>

          <div>
            <label htmlFor="max-fee-filter" className="sr-only">
              Maximum consultation fee
            </label>
            <input
              id="max-fee-filter"
              type="number"
              placeholder="Max Fee"
              min="0"
              step="50"
              value={localFilters.maxFee}
              onChange={(e) => handleFilterChange('maxFee', e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
              disabled={isSearching}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            disabled={isSearching}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            disabled={isSearching}
            className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
});

DoctorFilters.displayName = 'DoctorFilters';

export default DoctorFilters;