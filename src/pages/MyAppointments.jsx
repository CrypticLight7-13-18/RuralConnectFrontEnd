import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { fetchMyAppointments } from "../services/appointments";

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyAppointments();
        const transformed = data.map((a) => ({
          id: a._id,
          doctorName: a.doctorId.name,
          date: a.appointmentDate,
          status: a.status,
        }));
        setAppointments(transformed);
      } catch (err) {
        console.error("Failed to fetch my appointments", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.lightestBlue }}
    >
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: colors.darkestBlue }}
      >
        My Appointments
      </h1>
      {appointments.length === 0 ? (
        <p style={{ color: colors.darkBlue }}>No appointments yet.</p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((a) => (
            <li
              key={a.id}
              className="bg-white p-4 rounded shadow flex justify-between"
              style={{ borderLeft: `4px solid ${colors.mediumBlue}` }}
            >
              <div>
                <p
                  className="font-medium"
                  style={{ color: colors.darkestBlue }}
                >
                  Dr. {a.doctorName}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="inline mr-1" />
                  {new Date(a.date).toLocaleDateString()} – {a.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
