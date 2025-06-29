import axiosInstance from "./api";

// Fetch paginated list of medicines
// params can include { page, limit, category }
export const fetchMedicines = async (params = {}) => {
  const response = await axiosInstance.get("/api/medicines", { params });
  return response.data.data; // returns array of medicines
};

// Search medicines with query params { q, category, minPrice, maxPrice }
export const searchMedicines = async (params) => {
  const response = await axiosInstance.get("/api/medicines/search", { params });
  return response.data.data;
};

// Fetch single medicine by id
export const fetchMedicineById = async (id) => {
  const response = await axiosInstance.get(`/api/medicines/${id}`);
  return response.data.data;
};

// Admin-only helpers (not used on client side for now)
export const createMedicine = async (medicineData) => {
  const response = await axiosInstance.post("/api/medicines", medicineData);
  return response.data.data;
};

export const updateMedicine = async (id, update) => {
  const response = await axiosInstance.put(`/api/medicines/${id}`, update);
  return response.data.data;
};

export const deleteMedicine = async (id) => {
  const response = await axiosInstance.delete(`/api/medicines/${id}`);
  return response.data;
};
