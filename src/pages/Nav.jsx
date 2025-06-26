// components/Navbar.tsx
// components/Navbar.tsx
import React, { useEffect, useState } from 'react';
import { SessionUData } from '../assets/uasd';

export default function Navbar() {
  const [userData, setUserData] = useState(() => ({
    name: SessionUData.name,
    role: SessionUData.role,
    reports: SessionUData.reports,
    consultations: SessionUData.consultations,
    appointments: SessionUData.appointments,
  }));

  // Optional: Reload on interval or custom event
  useEffect(() => {
    const interval = setInterval(() => {
      setUserData({
        name: SessionUData.name,
        role: SessionUData.role,
        reports: SessionUData.reports,
        consultations: SessionUData.consultations,
        appointments: SessionUData.appointments,
      });
    }, 1000); // or use a custom event/listener

    return () => clearInterval(interval);
  }, []);

  if (userData.name === '') return null;

  return (
    <nav className="bg-blue-600 text-white p-2 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">User Dashboard</h1>
          <p className="text-sm">Role: {userData.role}</p>
        </div>

        <div className="space-x-4 text-sm">
          <span>Name: <strong>{userData.name}</strong></span>
          <span>Reports: {Object.keys(userData.reports).length}</span>
          <span>Consultations: {Object.keys(userData.consultations).length}</span>
          <span>Appointments: {Object.keys(userData.appointments).length}</span>
        </div>

        <button
          onClick={() => {
            setUserData({
              name: SessionUData.name,
              role: SessionUData.role,
              reports: SessionUData.reports,
              consultations: SessionUData.consultations,
              appointments: SessionUData.appointments,
            });
          }}
          className="ml-4 px-3 py-1 bg-white text-blue-600 rounded-md shadow-sm hover:bg-blue-100"
        >
          Reload
        </button>
      </div>
    </nav>
  );
}

