import { useState, useCallback } from 'react';

const initialFormState = {
  doctorId: '',
  appointmentDate: '',
  appointmentTime: '',
};

export const useAppointmentForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setSelectedDoctor(null);
    setEditingAppointment(null);
    setIsModalOpen(false);
  }, []);

  const openNewAppointmentModal = useCallback((doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      doctorId: doctor._id,
      appointmentDate: '',
      appointmentTime: '',
    });
    setEditingAppointment(null);
    setIsModalOpen(true);
  }, []);

  const openEditAppointmentModal = useCallback((appointment) => {
    setSelectedDoctor(appointment.doctorId);
    setFormData({
      doctorId: appointment.doctorId._id || appointment.doctorId,
      appointmentDate: appointment.appointmentDate.split('T')[0],
      appointmentTime: appointment.appointmentTime,
    });
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const isEditing = Boolean(editingAppointment);

  const getSubmissionData = useCallback(() => {
    if (isEditing) {
      return {
        id: editingAppointment._id,
        data: {
          appointmentDate: formData.appointmentDate,
          appointmentTime: formData.appointmentTime,
        },
      };
    }

    return {
      data: {
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
      },
    };
  }, [formData, editingAppointment, isEditing]);

  const isFormValid = useCallback(() => {
    return formData.doctorId && formData.appointmentDate && formData.appointmentTime;
  }, [formData]);

  return {
    formData,
    selectedDoctor,
    editingAppointment,
    isModalOpen,
    isEditing,
    updateFormData,
    resetForm,
    openNewAppointmentModal,
    openEditAppointmentModal,
    closeModal,
    getSubmissionData,
    isFormValid,
  };
};