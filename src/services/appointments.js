import axiosInstance from "./api";

export const fetchDoctorAppointments = async () => {
  const response = await axiosInstance.get("/api/appointments");
  return response.data.data; // list
};

export const addConsultationReport = async (
  appointmentId,
  consultationReport
) => {
  const response = await axiosInstance.put(
    `/api/appointments/${appointmentId}/report`,
    {
      consultationReport,
    }
  );
  return response.data.data;
};

export const fetchMyAppointments = async () => {
  const response = await axiosInstance.get("/api/appointments");
  return response.data.data;
};
