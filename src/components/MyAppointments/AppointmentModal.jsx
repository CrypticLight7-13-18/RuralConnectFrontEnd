import React from "react";
import { X, Calendar, Clock, User } from "lucide-react";
import { useError } from "../../contexts/ErrorContext";

export default function AppointmentModal({
  showModal,
  selectedDoctor,
  editingAppointment,
  appointmentForm,
  setAppointmentForm,
  availableSlots,
  loading,
  onSubmit,
  onClose,
}) {
  const { addError } = useError();
  if (!showModal && !editingAppointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!appointmentForm.appointmentDate || !appointmentForm.appointmentTime) {
      addError("Please select both date and time");
      return;
    }
    onSubmit(e);
  };

  const doctor = selectedDoctor || editingAppointment?.doctorId;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>

          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {editingAppointment ? "Edit Appointment" : "Book Appointment"}
            </h2>

            {doctor && (
              <div className="flex items-center text-gray-600">
                <User size={16} className="mr-2 text-blue-600" />
                <span className="text-sm">
                  {doctor.name} - {doctor.specialization}
                </span>
              </div>
            )}
            {doctor && doctor.consultationFee && (
              <div className="flex items-center text-gray-600 mt-1">
                <span className="text-sm ml-6">
                  Consultation Fee: ₹{doctor.consultationFee}
                </span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2 text-blue-600" />
                Select Date
              </label>
              <input
                type="date"
                value={appointmentForm.appointmentDate}
                onChange={(e) =>
                  setAppointmentForm({
                    ...appointmentForm,
                    appointmentDate: e.target.value,
                  })
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2 text-blue-600" />
                Select Time
              </label>

              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setAppointmentForm({
                          ...appointmentForm,
                          appointmentTime: slot,
                        })
                      }
                      className={`py-2 px-3 text-sm rounded-lg border transition-colors ${
                        appointmentForm.appointmentTime === slot
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Please select a date to see available time slots
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading ||
                  !appointmentForm.appointmentDate ||
                  !appointmentForm.appointmentTime
                }
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : editingAppointment
                  ? "Update Appointment"
                  : "Book Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
