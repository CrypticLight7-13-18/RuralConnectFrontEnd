import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointments";
import {
  getDoctorAvailability,
  getDoctorById,
  getDoctors,
} from "../services/doctors";
import { dummyAppointments, dummyDoctors } from "../assets/dummyVariables";

import TabNavigation from "../components/Appointments/TabNavigation";
import AppointmentCard from "../components/Appointments/AppointmentCard";
import DoctorCard from "../components/Appointments/DoctorCard";
import AppointmentModal from "../components/Appointments/AppointmentModal";
import ReportModal from "../components/Appointments/ReportModal";
import AppointmentSuccessModal from "../components/Appointments/AppointmentSuccessModal";

// Helper functions
const generateDummyTimeSlots = () => [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "completed":
      return "bg-green-100 text-green-800 border-green-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export default function Appointments() {
    const [activeTab, setActiveTab] = useState("appointments");
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [showNewAppointment, setShowNewAppointment] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [viewingReport, setViewingReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [useDummyData, setUseDummyData] = useState(false);
    const [filteredAppointments, setFilteredAppointments] = useState([])

  // Filters
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [doctorFilters, setDoctorFilters] = useState({
    specialization: "",
    location: "",
    maxFee: "",
    search: "",
  });

  // Form data
  const [appointmentForm, setAppointmentForm] = useState({
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
  });

    // Load appointments
    const loadAppointments = async () => {
        try {
            setLoading(true);
            if (useDummyData) {
                setAppointments(dummyAppointments);
            } else {
                const data = await getAppointments();
                setAppointments(data);
            }
        } catch (err) {
            setError("Failed to load appointments: " + err.message);
            setAppointments(dummyAppointments);
        } finally {
            setLoading(false);
        }
    };

  // Load doctors
  const loadDoctors = async () => {
    try {
      setLoading(true);
      if (useDummyData) {
        setDoctors(dummyDoctors);
      } else {
        const data = await getDoctors(doctorFilters);
        const doctorData = data || [];
        setDoctors(doctorData);
      }
    } catch (err) {
      setError("Failed to load doctors: " + err.message);
      setDoctors(dummyDoctors);
    } finally {
      setLoading(false);
    }
  };

  // Load doctor availability
  const loadDoctorAvailability = async (doctorId, date) => {
    try {
      if (useDummyData) {
        setAvailableSlots(generateDummyTimeSlots());
      } else {
        const data = await getDoctorAvailability(doctorId, date);
        setAvailableSlots(data);
      }
    } catch (err) {
      setError("Failed to load availability: " + err.message);
      setAvailableSlots(generateDummyTimeSlots());
    }
  };

  useEffect(() => {
    if (activeTab === "appointments") {
      loadAppointments();
    } else {
      loadDoctors();
    }
  }, [activeTab, appointmentFilter, doctorFilters, useDummyData]);

  useEffect(() => {
    if (appointmentForm.appointmentDate && selectedDoctor) {
      loadDoctorAvailability(
        selectedDoctor._id,
        appointmentForm.appointmentDate
      );
    }
  }, [appointmentForm.appointmentDate, selectedDoctor]);

    useEffect(()=>{
      // console.log("appointments",appointments)
      setFilteredAppointments(appointments.filter((appointment) => {
        if (appointmentFilter === "all") return true;
        return appointment.status.toLowerCase() === appointmentFilter.toLowerCase();
      }));
      // console.log("filteredAppointments", filteredAppointments)
    },[appointmentFilter, appointments])


  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentForm({
      doctorId: doctor._id,
      appointmentDate: "",
      appointmentTime: "",
    });
    setAvailableSlots([]);
    setShowNewAppointment(true);
    setEditingAppointment(null);
  };

  const handleEditAppointment = async (appointment) => {
    setSelectedDoctor(appointment.doctorId);
    setAppointmentForm({
      doctorId: appointment.doctorId,
      appointmentDate: appointment.appointmentDate.split("T")[0],
      appointmentTime: appointment.appointmentTime,
    });
    setEditingAppointment(appointment);
    setShowNewAppointment(false);

    if (appointment.appointmentDate) {
      loadDoctorAvailability(
        appointment.doctorId._id,
        appointment.appointmentDate.split("T")[0]
      );
    }
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let appointmentData = null;
      let isUpdate = false;

      if (useDummyData) {
        if (editingAppointment) {
          const updatedAppointments = appointments.map((apt) =>
            apt._id === editingAppointment._id
              ? {
                  ...apt,
                  appointmentDate: appointmentForm.appointmentDate,
                  appointmentTime: appointmentForm.appointmentTime,
                }
              : apt
          );
          setAppointments(updatedAppointments);
          appointmentData = {
            ...editingAppointment,
            appointmentDate: appointmentForm.appointmentDate,
            appointmentTime: appointmentForm.appointmentTime,
            doctorName:
              selectedDoctor?.name || editingAppointment.doctorId?.name,
            consultationFee:
              selectedDoctor?.consultationFee ||
              editingAppointment.consultationFee ||
              500,
          };
          isUpdate = true;
        } else {
          const newAppointment = {
            _id: Date.now().toString(),
            doctorId: selectedDoctor,
            appointmentDate: appointmentForm.appointmentDate,
            appointmentTime: appointmentForm.appointmentTime,
            status: "Pending",
            consultationFee: selectedDoctor.consultationFee || 500,
            createdAt: new Date().toISOString(),
          };
          setAppointments([newAppointment, ...appointments]);
          appointmentData = {
            ...newAppointment,
            doctorName: selectedDoctor?.name,
          };
        }
      } else {
        if (editingAppointment) {
          await updateAppointment(editingAppointment._id, {
            appointmentDate: appointmentForm.appointmentDate,
            appointmentTime: appointmentForm.appointmentTime,
          });
          appointmentData = {
            ...editingAppointment,
            appointmentDate: appointmentForm.appointmentDate,
            appointmentTime: appointmentForm.appointmentTime,
          };
          isUpdate = true;
        } else {
          const createdAppointment = await createAppointment({
            doctorId: appointmentForm.doctorId,
            appointmentDate: appointmentForm.appointmentDate,
            appointmentTime: appointmentForm.appointmentTime,
          });
          appointmentData = {
            ...createdAppointment,
            appointmentDate: appointmentForm.appointmentDate,
            appointmentTime: appointmentForm.appointmentTime,
          };
        }
        loadAppointments();
      }

      // Show success modal instead of alert
      setSuccessAppointmentData(appointmentData);
      setIsUpdateSuccess(isUpdate);
      setShowSuccessModal(true);

      // Reset form and close modal
      setShowNewAppointment(false);
      setSelectedDoctor(null);
      setEditingAppointment(null);
      setAppointmentForm({
        doctorId: "",
        appointmentDate: "",
        appointmentTime: "",
      });
    } catch (err) {
      setError(
        `Failed to ${editingAppointment ? "update" : "book"} appointment: ` +
          err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    setLoading(true);
    try {
      if (useDummyData) {
        const updatedAppointments = appointments.filter(
          (apt) => apt._id !== appointmentId
        );
        setAppointments(updatedAppointments);
        alert("Appointment cancelled successfully!");
      } else {
        await deleteAppointment(appointmentId);
        loadAppointments();
        alert("Appointment cancelled successfully!");
      }
    } catch (err) {
      setError("Failed to cancel appointment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (appointment) => {
    setViewingReport(appointment);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-700 hover:text-red-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === "appointments" ? (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Appointments Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Your Appointments
                  </h2>
                  <div className="flex items-center space-x-2">
                    <select
                      value={appointmentFilter}
                      onChange={(e) => setAppointmentFilter(e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-600"
                    >
                      <option value="all">All Appointments</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-slate-600">
                      Loading appointments...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <AppointmentCard
                        key={appointment._id}
                        appointment={appointment}
                        getStatusColor={getStatusColor}
                        onEdit={handleEditAppointment}
                        onCancel={handleCancelAppointment}
                        onViewReport={handleViewReport}
                        loading={loading}
                      />
                    ))}

                    {filteredAppointments.length === 0 && (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium text-slate-600 mb-2">
                          No appointments found
                        </h3>
                        <p className="text-slate-500">
                          {appointmentFilter === "all"
                            ? "You haven't booked any appointments yet."
                            : `No ${appointmentFilter} appointments found.`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Doctors Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  Find Doctors
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={doctorFilters.search}
                    onChange={(e) =>
                      setDoctorFilters({
                        ...doctorFilters,
                        search: e.target.value,
                      })
                    }
                    className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  />

                  <select
                    value={doctorFilters.specialization}
                    onChange={(e) =>
                      setDoctorFilters({
                        ...doctorFilters,
                        specialization: e.target.value,
                      })
                    }
                    className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  >
                    <option value="">All Specializations</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="General Physician">General Physician</option>
                    <option value="ENT Specialist">ENT Specialist</option>
                    <option value="Ophthalmologist">Ophthalmologist</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Location"
                    value={doctorFilters.location}
                    onChange={(e) =>
                      setDoctorFilters({
                        ...doctorFilters,
                        location: e.target.value,
                      })
                    }
                    className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  />

                  <input
                    type="number"
                    placeholder="Max Fee"
                    value={doctorFilters.maxFee}
                    onChange={(e) =>
                      setDoctorFilters({
                        ...doctorFilters,
                        maxFee: e.target.value,
                      })
                    }
                    className="border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-600"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <span className="text-slate-600">Loading doctors...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor._id}
                      doctor={doctor}
                      onBookAppointment={handleBookAppointment}
                      loading={loading}
                    />
                  ))}

                  {doctors.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <h3 className="text-lg font-medium text-slate-600 mb-2">
                        No doctors found
                      </h3>
                      <p className="text-slate-500">
                        Try adjusting your search filters.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Appointment Modal */}
      <AppointmentModal
        showModal={showNewAppointment || !!editingAppointment}
        selectedDoctor={selectedDoctor}
        editingAppointment={editingAppointment}
        appointmentForm={appointmentForm}
        setAppointmentForm={setAppointmentForm}
        availableSlots={availableSlots}
        loading={loading}
        onSubmit={handleSubmitAppointment}
        onClose={() => {
          setShowNewAppointment(false);
          setSelectedDoctor(null);
          setEditingAppointment(null);
          setAppointmentForm({
            doctorId: "",
            appointmentDate: "",
            appointmentTime: "",
          });
        }}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={!!viewingReport}
        appointment={viewingReport}
        onClose={() => setViewingReport(null)}
      />

      {/* Appointment Success Modal */}
      <AppointmentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        appointmentData={successAppointmentData}
        isUpdate={isUpdateSuccess}
      />
    </div>
  );
}
