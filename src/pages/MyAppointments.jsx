import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { useAppointments } from '../hooks/useAppointments';
import { useDoctors, useDoctorAvailability } from '../hooks/useDoctors';
import { useAppointmentForm } from '../hooks/useAppointmentForm';

import { TABS } from '../constants/MyAppointments.constants';

import TabNavigation from '../components/MyAppointments/TabNavigation';
import AppointmentFilters from '../components/MyAppointments/AppointmentFilters';
import AppointmentsList from '../components/MyAppointments/AppointmentsList';
import DoctorSearchFilters from '../components/MyAppointments/DoctorFilters';
import DoctorsList from '../components/MyAppointments/DoctorsList';
import AppointmentModal from '../components/MyAppointments/AppointmentModal';
import ReportModal from '../components/MyAppointments/ReportModal';
import AppointmentSuccessModal from '../components/MyAppointments/AppointmentSuccessModal';


const INITIAL_DOCTOR_FILTERS = {
  search: '',
  specialization: '',
  location: '',
  maxFee: '',
};

const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState(TABS.APPOINTMENTS);
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [doctorFilters, setDoctorFilters] = useState(INITIAL_DOCTOR_FILTERS);
  const [viewingReport, setViewingReport] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const {
    loading: appointmentsLoading,
    error: appointmentsError,
    loadAppointments,
    createNewAppointment,
    updateExistingAppointment,
    cancelAppointment,
    filterAppointments,
    clearError: clearAppointmentsError,
  } = useAppointments();

  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
    searchDoctors,
    clearError: clearDoctorsError,
  } = useDoctors();

  const {
    availableSlots,
    loading: availabilityLoading,
    error: availabilityError,
    loadAvailability,
    clearAvailability,
    clearError: clearAvailabilityError,
  } = useDoctorAvailability();

  const {
    formData,
    selectedDoctor,
    editingAppointment,
    isModalOpen,
    isEditing,
    updateFormData,
    openNewAppointmentModal,
    openEditAppointmentModal,
    closeModal,
    getSubmissionData,
    isFormValid,
  } = useAppointmentForm();

  const filteredAppointments = filterAppointments(appointmentFilter);
  const isLoading = appointmentsLoading || doctorsLoading || availabilityLoading;

  useEffect(() => {
    if (activeTab === TABS.APPOINTMENTS) {
      loadAppointments();
    } else {
      searchDoctors(doctorFilters);
    }
  }, [activeTab, loadAppointments, searchDoctors, doctorFilters]);

  useEffect(() => {
    if (formData.appointmentDate && selectedDoctor) {
      const doctorId = selectedDoctor._id || selectedDoctor;
      loadAvailability(doctorId, formData.appointmentDate);
    } else {
      clearAvailability();
    }
  }, [formData.appointmentDate, selectedDoctor, loadAvailability, clearAvailability]);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleAppointmentFilterChange = useCallback((filter) => {
    setAppointmentFilter(filter);
  }, []);

  const handleDoctorFiltersChange = useCallback((filters) => {
    setDoctorFilters(filters);
  }, []);

  const handleDoctorSearch = useCallback((filters) => {
    searchDoctors(filters);
  }, [searchDoctors]);

  const handleBookAppointment = useCallback((doctor) => {
    openNewAppointmentModal(doctor);
  }, [openNewAppointmentModal]);

  const handleEditAppointment = useCallback((appointment) => {
    openEditAppointmentModal(appointment);
  }, [openEditAppointmentModal]);

  const handleCancelAppointment = useCallback(async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await cancelAppointment(appointmentId);
      toast.success('Appointment cancelled successfully');
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  }, [cancelAppointment]);

  const handleViewReport = useCallback((appointment) => {
    setViewingReport(appointment);
  }, []);

  const handleSubmitAppointment = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { id, data } = getSubmissionData();
      let result;

      if (isEditing) {
        result = await updateExistingAppointment(id, data);
        toast.success('Appointment updated successfully');
      } else {
        result = await createNewAppointment(data);
        toast.success('Appointment booked successfully');
      }

      // Prepare success modal data
      const successAppointmentData = {
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        doctorName: selectedDoctor?.name || 'Doctor',
        consultationFee: selectedDoctor?.consultationFee || editingAppointment?.consultationFee || 500,
        status: result?.status || (isEditing ? editingAppointment.status : 'Pending'),
      };

      setSuccessData(successAppointmentData);
      setShowSuccessModal(true);
      closeModal();
    } catch (error) {
      const action = isEditing ? 'update' : 'book';
      toast.error(`Failed to ${action} appointment`);
    }
  }, [
    isFormValid,
    getSubmissionData,
    isEditing,
    updateExistingAppointment,
    createNewAppointment,
    selectedDoctor,
    editingAppointment,
    closeModal,
  ]);

  const handleCloseModal = useCallback(() => {
    closeModal();
    clearAvailability();
  }, [closeModal, clearAvailability]);

  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    setSuccessData(null);
  }, []);

  const handleCloseReportModal = useCallback(() => {
    setViewingReport(null);
  }, []);

  const displayError = appointmentsError || doctorsError || availabilityError;

  const handleClearError = useCallback(() => {
    clearAppointmentsError();
    clearDoctorsError();
    clearAvailabilityError();
  }, [clearAppointmentsError, clearDoctorsError, clearAvailabilityError]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <TabNavigation 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
        />

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === TABS.APPOINTMENTS ? (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <AppointmentFilters
                  selectedFilter={appointmentFilter}
                  onFilterChange={handleAppointmentFilterChange}
                  appointmentCount={filteredAppointments.length}
                />

                <AppointmentsList
                  appointments={filteredAppointments}
                  loading={appointmentsLoading}
                  filter={appointmentFilter}
                  onEdit={handleEditAppointment}
                  onCancel={handleCancelAppointment}
                  onViewReport={handleViewReport}
                />
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
              <DoctorSearchFilters
                filters={doctorFilters}
                onFiltersChange={handleDoctorFiltersChange}
                onSearch={handleDoctorSearch}
                isSearching={doctorsLoading}
              />

              <DoctorsList
                doctors={doctors}
                loading={doctorsLoading}
                onBookAppointment={handleBookAppointment}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AppointmentModal
        showModal={isModalOpen}
        selectedDoctor={selectedDoctor}
        editingAppointment={editingAppointment}
        appointmentForm={formData}
        setAppointmentForm={updateFormData}
        availableSlots={availableSlots}
        loading={isLoading}
        onSubmit={handleSubmitAppointment}
        onClose={handleCloseModal}
        isEditing={isEditing}
      />

      <ReportModal
        isOpen={!!viewingReport}
        appointment={viewingReport}
        onClose={handleCloseReportModal}
      />

      <AppointmentSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        appointmentData={successData}
        isUpdate={isEditing}
      />
    </div>
  );
};

export default MyAppointments;