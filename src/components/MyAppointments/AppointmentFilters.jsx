import { memo } from 'react';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Appointments' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const AppointmentFilters = memo(({ 
  selectedFilter, 
  onFilterChange,
  appointmentCount = 0 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-slate-800">
        Your Appointments {appointmentCount > 0 && `(${appointmentCount})`}
      </h2>
      
      <div className="flex items-center space-x-2">
        <label htmlFor="appointment-filter" className="sr-only">
          Filter appointments
        </label>
        <select
          id="appointment-filter"
          value={selectedFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
          aria-label="Filter appointments by status"
        >
          {FILTER_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

AppointmentFilters.displayName = 'AppointmentFilters';

export default AppointmentFilters;