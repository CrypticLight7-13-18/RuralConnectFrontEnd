import axiosInstance from "./api";

export const addConsultationReport = async (
  appointmentId,
  consultationReport
) => {
  const response = await axiosInstance.patch(
    `/api/appointments/${appointmentId}/report`,
    {
      consultationReport,
    }
  );

  return response.data.data;
};

// Get appointments with optional filtering
export const getAppointments = async () => {
  try {
    const response = await axiosInstance.get(`/api/appointments`);
    return response.data.data.appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axiosInstance.post(
      "/api/appointments",
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Update an existing appointment
export const updateAppointment = async (appointmentId, updateData) => {
  try {
    const response = await axiosInstance.patch(
      `/api/appointments/${appointmentId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Delete/Cancel an appointment
export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await axiosInstance.delete(
      `/api/appointments/${appointmentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};
