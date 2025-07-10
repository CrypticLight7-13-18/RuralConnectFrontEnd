import React from "react";
import { MapPin, Star, Clock } from "lucide-react";

export default function DoctorCard({ doctor, onBookAppointment, loading }) {
  if (!doctor) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      {/* Doctor Info */}
      <div className="flex items-center mb-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
          style={{ backgroundColor: "#e0fbfc" }}
        >
          <span className="font-semibold text-xl" style={{ color: "#5c6b73" }}>
            {doctor.name?.charAt(0) || "D"}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold" style={{ color: "#253237" }}>
            {doctor.name || "Doctor"}
          </h3>
          <p className="text-sm" style={{ color: "#5c6b73" }}>
            {doctor.specialization || "General Physician"}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {doctor.location && (
          <div
            className="flex items-center text-sm"
            style={{ color: "#5c6b73" }}
          >
            <MapPin size={16} className="mr-2" style={{ color: "#9db4c0" }} />
            <span>{doctor.location}</span>
          </div>
        )}

        {doctor.rating && (
          <div
            className="flex items-center text-sm"
            style={{ color: "#5c6b73" }}
          >
            <Star size={16} className="mr-2" style={{ color: "#9db4c0" }} />
            <span>{doctor.rating} rating</span>
          </div>
        )}

        {doctor.experience && (
          <div
            className="flex items-center text-sm"
            style={{ color: "#5c6b73" }}
          >
            <Clock size={16} className="mr-2" style={{ color: "#9db4c0" }} />
            <span>{doctor.experience} years experience</span>
          </div>
        )}
      </div>

      {/* Fee */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm" style={{ color: "#5c6b73" }}>
          Consultation Fee
        </span>
        <span className="text-lg font-semibold" style={{ color: "#5c6b73" }}>
          ₹{doctor.consultationFee || 500}
        </span>
      </div>

      {/* Book Appointment Button */}
      <button
        onClick={() => onBookAppointment(doctor)}
        disabled={loading}
        className="w-full text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#5c6b73" }}
        onMouseEnter={(e) => {
          if (!loading) e.target.style.backgroundColor = "#253237";
        }}
        onMouseLeave={(e) => {
          if (!loading) e.target.style.backgroundColor = "#5c6b73";
        }}
      >
        {loading ? "Loading..." : "Book Appointment"}
      </button>
    </div>
  );
}
