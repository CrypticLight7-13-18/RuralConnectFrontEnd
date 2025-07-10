// src/components/Appointments/AppointmentsList.jsx
import { memo } from 'react';
import AppointmentCard from './AppointmentCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const AppointmentsList = memo(({
  appointments,
  loading,
  filter,
  onEdit,
  onCancel,
  onViewReport,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="medium" />
        <span className="ml-2 text-slate-600">Loading appointments...</span>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 mb-3">
          <svg 
            className="mx-auto h-12 w-12" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3a4 4 0 118 0v4m-4 0v2m0 6V9m0 0a6 6 0 11-6 6 6-6 0 016-6z" 
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-slate-600 mb-2">
          No appointments found
        </h3>
        
        <p className="text-slate-500">
          {filter === 'all'
            ? "You haven't booked any appointments yet."
            : `No ${filter} appointments found.`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          appointment={appointment}
          getStatusColor={getStatusColor}
          onEdit={onEdit}
          onCancel={onCancel}
          onViewReport={onViewReport}
        />
      ))}
    </div>
  );
});

AppointmentsList.displayName = 'AppointmentsList';

export default AppointmentsList;