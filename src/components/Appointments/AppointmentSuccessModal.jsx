import React from "react";
import {
  CheckCircle,
  Calendar,
  User,
  Clock,
  DollarSign,
  X,
} from "lucide-react";

export default function AppointmentSuccessModal({
  isOpen,
  onClose,
  appointmentData,
  isUpdate = false,
}) {
  if (!isOpen || !appointmentData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-md relative animate-pulse"
          style={{ borderTop: `6px solid #3b82f6` }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {/* Content */}
          <div className="p-6 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-blue-600" />
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isUpdate
                ? "Appointment Updated!"
                : "Appointment Booked Successfully!"}
            </h2>
            <p className="text-gray-600 mb-6">
              {isUpdate
                ? "Your appointment has been updated successfully."
                : "Your appointment has been confirmed with the doctor."}
            </p>

            {/* Appointment Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-3">
                {/* Doctor Name */}
                <div className="flex items-center">
                  <User size={18} className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-semibold text-gray-800">
                      {appointmentData.doctorName ||
                        appointmentData.doctorId?.name ||
                        "Dr. Smith"}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center">
                  <Calendar size={18} className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-800">
                      {formatDate(appointmentData.appointmentDate)}
                    </p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center">
                  <Clock size={18} className="text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-800">
                      {formatTime(appointmentData.appointmentTime)}
                    </p>
                  </div>
                </div>

                {/* Consultation Fee */}
                {appointmentData.consultationFee && (
                  <div className="flex items-center">
                    <DollarSign size={18} className="text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Consultation Fee</p>
                      <p className="font-semibold text-gray-800">
                        ₹{appointmentData.consultationFee}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Status:</strong> {appointmentData.status || "Pending"}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                You will receive a confirmation once the doctor approves your
                appointment.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
