// src/components/Appointments/DoctorsList.jsx
import { memo } from 'react';
import DoctorCard from './DoctorCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const DoctorsList = memo(({
  doctors,
  loading,
  onBookAppointment,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="medium" />
        <span className="ml-2 text-slate-600">Loading doctors...</span>
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
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
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-medium text-slate-600 mb-2">
          No doctors found
        </h3>
        
        <p className="text-slate-500">
          Try adjusting your search filters to find more doctors.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor._id}
          doctor={doctor}
          onBookAppointment={onBookAppointment}
        />
      ))}
    </div>
  );
});

DoctorsList.displayName = 'DoctorsList';

export default DoctorsList;