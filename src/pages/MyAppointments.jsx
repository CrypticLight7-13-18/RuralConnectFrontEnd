import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  IndianRupee,
  Filter,
  Plus,
  Search,
  X,
  Edit3,
  Trash2,
  Check,
  AlertCircle,
  ChevronDown,
  Heart,
  Loader2,
} from "lucide-react";

import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../services/appointments";
import { getDoctorAvailability, getDoctors } from "../services/doctors";
import { dummyAppointments, dummyDoctors } from "../assets/dummyVariables";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [useDummyData, setUseDummyData] = useState(true); // Toggle for testing

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

  // Generate dummy time slots for testing
  const generateDummyTimeSlots = () => {
    return [
      "09:00 AM",
      "09:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "02:00 PM",
      "02:30 PM",
      "03:00 PM",
      "03:30 PM",
      "04:00 PM",
      "04:30 PM",
    ];
  };

  // Load appointments
  const loadAppointments = async () => {
    try {
      setLoading(true);
      if (useDummyData) {
        // Use dummy data for testing
        setAppointments(dummyAppointments);
      } else {
        const data = await getAppointments(appointmentFilter);
        setAppointments(data);
      }
    } catch (err) {
      setError("Failed to load appointments: " + err.message);
      // Fallback to dummy data if API fails
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
        // Use dummy data for testing
        setDoctors(dummyDoctors);
      } else {
        const data = await getDoctors(doctorFilters);
        setDoctors(data);
      }
    } catch (err) {
      setError("Failed to load doctors: " + err.message);
      // Fallback to dummy data if API fails
      setDoctors(dummyDoctors);
    } finally {
      setLoading(false);
    }
  };

  // Load doctor availability
  const loadDoctorAvailability = async (doctorId, date) => {
    try {
      if (useDummyData) {
        // Use dummy time slots for testing
        setAvailableSlots(generateDummyTimeSlots());
      } else {
        const data = await getDoctorAvailability(doctorId, date);
        setAvailableSlots(data);
      }
    } catch (err) {
      setError("Failed to load availability: " + err.message);
      // Fallback to dummy slots
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

  const filteredAppointments = appointments.filter((appointment) => {
    if (appointmentFilter === "all") return true;
    return appointment.status.toLowerCase() === appointmentFilter.toLowerCase();
  });

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

  const handleEditAppointment = (appointment) => {
    // Find the doctor for this appointment
    const doctor = dummyDoctors.find(
      (d) => d._id === appointment.doctorId?._id || appointment.doctorId
    );

    setSelectedDoctor(
      doctor || {
        _id: appointment.doctorId?._id || appointment.doctorId,
        name: appointment.doctorId?.name || "Doctor Name",
        specialization:
          appointment.doctorId?.specialization || "Specialization",
        consultationFee: appointment.consultationFee,
      }
    );

    setAppointmentForm({
      doctorId: appointment.doctorId?._id || appointment.doctorId,
      appointmentDate: appointment.appointmentDate.split("T")[0], // Convert to YYYY-MM-DD format
      appointmentTime: appointment.appointmentTime,
    });

    setEditingAppointment(appointment);
    setShowNewAppointment(false);

    // Load available slots for the appointment date
    if (appointment.appointmentDate) {
      loadDoctorAvailability(
        appointment.doctorId?._id || appointment.doctorId,
        appointment.appointmentDate.split("T")[0]
      );
    }
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (useDummyData) {
        // Frontend-only testing logic
        if (editingAppointment) {
          // Update existing appointment
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
          alert("Appointment updated successfully!");
        } else {
          // Create new appointment
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
          alert("Appointment booked successfully!");
        }
      } else {
        // Real API calls
        if (editingAppointment) {
          await updateAppointment(editingAppointment._id, {
            appointmentDate: appointmentForm.appointmentDate,
            appointmentTime: appointmentForm.appointmentTime,
          });
          alert("Appointment updated successfully!");
        } else {
          await createAppointment({
            doctorId: appointmentForm.doctorId,
            appointmentDate: appointmentForm.appointmentDate,
            appointmentTime: appointmentForm.appointmentTime,
          });
          alert("Appointment booked successfully!");
        }
        loadAppointments(); // Refresh appointments list
      }

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
        // Frontend-only testing logic
        const updatedAppointments = appointments.filter(
          (apt) => apt._id !== appointmentId
        );
        setAppointments(updatedAppointments);
        alert("Appointment cancelled successfully!");
      } else {
        await deleteAppointment(appointmentId);
        loadAppointments(); // Refresh appointments list
        alert("Appointment cancelled successfully!");
      }
    } catch (err) {
      setError("Failed to cancel appointment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Testing Mode Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex justify-end">
          <label className="flex items-center space-x-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={useDummyData}
              onChange={(e) => setUseDummyData(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>Use Dummy Data (Testing Mode)</span>
          </label>
        </div>
      </div>

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

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center mb-8">
          <div className="relative bg-white rounded-full p-1 shadow-lg">
            <motion.div
              className="absolute inset-y-1 bg-slate-600 rounded-full"
              animate={{
                x: activeTab === "appointments" ? 4 : "calc(100% - 4px)",
                width: "calc(50% - 4px)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setActiveTab("appointments")}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors ${
                activeTab === "appointments" ? "text-white" : "text-slate-600"
              }`}
            >
              My Appointments
            </button>
            <button
              onClick={() => setActiveTab("doctors")}
              className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors ${
                activeTab === "doctors" ? "text-white" : "text-slate-600"
              }`}
            >
              Find Doctors
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "appointments" ? (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Appointments Filter */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Your Appointments
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-500" />
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

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
                    <span className="ml-2 text-slate-600">
                      Loading appointments...
                    </span>
                  </div>
                )}

                {/* Appointments List */}
                {!loading && (
                  <div className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <motion.div
                        key={appointment._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                                <Stethoscope className="w-6 h-6 text-slate-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-800">
                                  {appointment.doctorId?.name || "Doctor Name"}
                                </h3>
                                <p className="text-sm text-slate-600">
                                  {appointment.doctorId?.specialization ||
                                    "Specialization"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(appointment.appointmentDate)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {appointment.appointmentTime}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {appointment.doctorId?.location || "Location"}
                              </div>
                              <div className="flex items-center">
                                <IndianRupee className="w-4 h-4 mr-2" />
                                {appointment.consultationFee}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {appointment.status === "Pending" && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleEditAppointment(appointment)
                                  }
                                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  disabled={loading}
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleCancelAppointment(appointment._id)
                                  }
                                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  disabled={loading}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {!loading && filteredAppointments.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
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
              {/* Doctors Filter */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  Find Doctors
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
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
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600"
                    />
                  </div>

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

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
                  <span className="ml-2 text-slate-600">
                    Loading doctors...
                  </span>
                </div>
              )}

              {/* Doctors List */}
              {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor) => (
                    <motion.div
                      key={doctor._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-8 h-8 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {doctor.name}
                            </h3>
                            <p className="text-sm text-slate-600">
                              {doctor.specialization}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-600 mb-4">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {doctor.location}
                          </div>
                          <div className="flex items-center">
                            <IndianRupee className="w-4 h-4 mr-2" />
                            {doctor.consultationFee || "Fee not specified"}{" "}
                            consultation
                          </div>
                        </div>

                        <button
                          onClick={() => handleBookAppointment(doctor)}
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {!loading && doctors.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
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

      {/* New/Edit Appointment Modal */}
      <AnimatePresence>
        {((showNewAppointment && selectedDoctor) || editingAppointment) && (
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
              <form onSubmit={handleSubmitAppointment}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-800">
                      {editingAppointment
                        ? "Edit Appointment"
                        : "Book Appointment"}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewAppointment(false);
                        setSelectedDoctor(null);
                        setEditingAppointment(null);
                        setAppointmentForm({
                          doctorId: "",
                          appointmentDate: "",
                          appointmentTime: "",
                        });
                      }}
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
                            ₹
                            {selectedDoctor.consultationFee ||
                              "Fee not specified"}{" "}
                            consultation
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
                        onClick={() => {
                          setShowNewAppointment(false);
                          setSelectedDoctor(null);
                          setEditingAppointment(null);
                          setAppointmentForm({
                            doctorId: "",
                            appointmentDate: "",
                            appointmentTime: "",
                          });
                        }}
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
        )}
      </AnimatePresence>
    </div>
  );
}
