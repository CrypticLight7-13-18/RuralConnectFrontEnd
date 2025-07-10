import { useState, useCallback } from 'react';
import { getDoctors, getDoctorAvailability } from '../services/doctors';

export const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDoctors = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDoctors(filters);
      setDoctors(data || []);
    } catch (err) {
      setError(`Failed to load doctors: ${err.message}`);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchDoctors = useCallback(async (searchParams) => {
    const filteredParams = Object.entries(searchParams)
      .filter(([_, value]) => value && value.trim() !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    await loadDoctors(filteredParams);
  }, [loadDoctors]);

  return {
    doctors,
    loading,
    error,
    loadDoctors,
    searchDoctors,
    clearError: () => setError(null),
  };
};

export const useDoctorAvailability = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAvailability = useCallback(async (doctorId, date) => {
    if (!doctorId || !date) {
      setAvailableSlots([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const slots = await getDoctorAvailability(doctorId, date);
      console.log(slots)
      setAvailableSlots(slots || []);
    } catch (err) {
      setError(`Failed to load availability: ${err.message}`);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAvailability = useCallback(() => {
    setAvailableSlots([]);
    setError(null);
  }, []);

  return {
    availableSlots,
    loading,
    error,
    loadAvailability,
    clearAvailability,
    clearError: () => setError(null),
  };
};