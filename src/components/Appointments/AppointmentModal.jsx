import { AnimatePresence, motion } from "framer-motion";
import { X, Stethoscope, Loader2 } from "lucide-react";

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
  if (!showModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <form onSubmit={onSubmit}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingAppointment ? "Edit Appointment" : "Book Appointment"}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedDoctor && (
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {selectedDoctor.name}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {selectedDoctor.specialization}
                      </p>
                      <p className="text-sm text-slate-600">
                        ₹{selectedDoctor.consultationFee || "Fee not specified"} consultation
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Appointment Date
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
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Available Time Slots
                  </label>
                  {appointmentForm.appointmentDate ? (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() =>
                            setAppointmentForm({
                              ...appointmentForm,
                              appointmentTime: time,
                            })
                          }
                          className={`p-2 text-sm rounded-lg border transition-colors ${
                            appointmentForm.appointmentTime === time
                              ? "border-slate-600 bg-slate-50 text-slate-800"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                      {availableSlots.length === 0 && (
                        <div className="col-span-3 text-center text-slate-500 py-4">
                          No available slots for this date
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-sm">
                      Please select a date first
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
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
                    className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingAppointment ? (
                      "Update Appointment"
                    ) : (
                      "Book Appointment"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}