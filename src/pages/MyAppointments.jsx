import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  DollarSign,
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
} from "lucide-react";

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("appointments");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

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

  // Mock data - replace with actual API calls
  const mockAppointments = [
    {
      _id: "1",
      doctorName: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      appointmentDate: "2024-07-02T10:00:00Z",
      status: "Pending",
      location: "Downtown Medical Center",
      fee: 150,
    },
    {
      _id: "2",
      doctorName: "Dr. Michael Chen",
      specialization: "Neurologist",
      appointmentDate: "2024-06-25T14:30:00Z",
      status: "Completed",
      location: "City Hospital",
      fee: 200,
    },
    {
      _id: "3",
      doctorName: "Dr. Emily Davis",
      specialization: "Dermatologist",
      appointmentDate: "2024-07-05T09:15:00Z",
      status: "Cancelled",
      location: "Wellness Clinic",
      fee: 120,
    },
  ];

  const mockDoctors = [
    {
      _id: "d1",
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      location: "Downtown Medical Center",
      fee: 150,
      rating: 4.8,
      experience: "15 years",
      availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
    },
    {
      _id: "d2",
      name: "Dr. Michael Chen",
      specialization: "Neurologist",
      location: "City Hospital",
      fee: 200,
      rating: 4.9,
      experience: "12 years",
      availableSlots: ["10:30", "11:30", "14:30", "15:30", "16:30"],
    },
    {
      _id: "d3",
      name: "Dr. Emily Davis",
      specialization: "Dermatologist",
      location: "Wellness Clinic",
      fee: 120,
      rating: 4.7,
      experience: "8 years",
      availableSlots: ["09:15", "10:15", "11:15", "13:00", "14:00"],
    },
  ];

  useEffect(() => {
    // Load appointments and doctors
    setAppointments(mockAppointments);
    setDoctors(mockDoctors);
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    if (appointmentFilter === "all") return true;
    return appointment.status.toLowerCase() === appointmentFilter.toLowerCase();
  });

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(doctorFilters.search.toLowerCase()) ||
      doctor.specialization
        .toLowerCase()
        .includes(doctorFilters.search.toLowerCase());
    const matchesSpecialization =
      !doctorFilters.specialization ||
      doctor.specialization === doctorFilters.specialization;
    const matchesLocation =
      !doctorFilters.location ||
      doctor.location.includes(doctorFilters.location);
    const matchesFee =
      !doctorFilters.maxFee || doctor.fee <= parseInt(doctorFilters.maxFee);

    return (
      matchesSearch && matchesSpecialization && matchesLocation && matchesFee
    );
  });

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentForm({
      ...appointmentForm,
      doctorId: doctor._id,
    });
    setShowNewAppointment(true);
  };

  const handleSubmitAppointment = async (e) => {
    e.preventDefault();
    // API call to create appointment
    console.log("Creating appointment:", appointmentForm);
    setShowNewAppointment(false);
    setSelectedDoctor(null);
    setAppointmentForm({
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
    });
  };

  const handleCancelAppointment = async (appointmentId) => {
    // API call to cancel appointment
    console.log("Cancelling appointment:", appointmentId);
    setAppointments((prev) =>
      prev.map((apt) =>
        apt._id === appointmentId ? { ...apt, status: "Cancelled" } : apt
      )
    );
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-red-400 mr-3" />
              <h1 className="text-2xl font-bold text-slate-800">
                PharmaConnect
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600">Welcome back, Patient</span>
            </div>
          </div>
        </div>
      </div>

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

                {/* Appointments List */}
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
                                {appointment.doctorName}
                              </h3>
                              <p className="text-sm text-slate-600">
                                {appointment.specialization}
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
                              {formatTime(appointment.appointmentDate)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {appointment.location}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-2" />$
                              {appointment.fee}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>

                          {appointment.status === "Pending" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  setEditingAppointment(appointment)
                                }
                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleCancelAppointment(appointment._id)
                                }
                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredAppointments.length === 0 && (
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
                    placeholder="Max Fee ($)"
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

              {/* Doctors List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
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
                          <div className="flex items-center mt-1">
                            <div className="flex text-yellow-400">
                              {"★".repeat(Math.floor(doctor.rating))}
                            </div>
                            <span className="text-sm text-slate-500 ml-1">
                              ({doctor.rating})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {doctor.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {doctor.experience} experience
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />${doctor.fee}{" "}
                          consultation
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookAppointment(doctor)}
                        className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </motion.div>
                ))}

                {filteredDoctors.length === 0 && (
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showNewAppointment && selectedDoctor && (
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
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-800">
                    Book Appointment
                  </h2>
                  <button
                    onClick={() => {
                      setShowNewAppointment(false);
                      setSelectedDoctor(null);
                    }}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

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
                        ${selectedDoctor.fee} consultation
                      </p>
                    </div>
                  </div>
                </div>

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
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDoctor.availableSlots.map((time) => (
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
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewAppointment(false);
                        setSelectedDoctor(null);
                      }}
                      className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={handleSubmitAppointment}
                      disabled={
                        !appointmentForm.appointmentDate ||
                        !appointmentForm.appointmentTime
                      }
                      className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
