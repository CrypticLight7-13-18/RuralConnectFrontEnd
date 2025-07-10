import { useState, useCallback } from 'react';
import { 
  getAppointments, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} from '../services/appointments';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAppointments();
      setAppointments(data || []);
    } catch (err) {
      setError(`Failed to load appointments: ${err.message}`);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewAppointment = useCallback(async (appointmentData) => {
    try {
      setLoading(true);
      setError(null);
      const createdAppointment = await createAppointment(appointmentData);
      await loadAppointments(); // Refresh the list
      return createdAppointment;
    } catch (err) {
      setError(`Failed to create appointment: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadAppointments]);

  const updateExistingAppointment = useCallback(async (appointmentId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAppointment = await updateAppointment(appointmentId, updateData);
      await loadAppointments(); // Refresh the list
      return updatedAppointment;
    } catch (err) {
      setError(`Failed to update appointment: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadAppointments]);

  const cancelAppointment = useCallback(async (appointmentId) => {
    try {
      setLoading(true);
      setError(null);
      await deleteAppointment(appointmentId);
      await loadAppointments(); // Refresh the list
    } catch (err) {
      setError(`Failed to cancel appointment: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadAppointments]);

  const filterAppointments = useCallback((filter) => {
    if (filter === 'all') return appointments;
    return appointments.filter(appointment => 
      appointment.status.toLowerCase() === filter.toLowerCase()
    );
  }, [appointments]);

  return {
    appointments,
    loading,
    error,
    loadAppointments,
    createNewAppointment,
    updateExistingAppointment,
    cancelAppointment,
    filterAppointments,
    clearError: () => setError(null),
  };
};