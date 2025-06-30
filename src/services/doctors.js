import axiosInstance from "./api";

// Get doctors with optional filtering
export const getDoctors = async(filters = {}) => {
    try {
        const queryParams = new URLSearchParams();

        // Add filters to query parameters
        if (filters.search) {
            queryParams.append("search", filters.search);
        }
        if (filters.specialization) {
            queryParams.append("specialization", filters.specialization);
        }
        if (filters.location) {
            queryParams.append("location", filters.location);
        }
        if (filters.maxFee) {
            queryParams.append("maxFee", filters.maxFee);
        }
        console.log(filters, queryParams.toString())
        const response = await axiosInstance.get(
            `/api/doctors?${queryParams.toString()}`
        );
        console.log("response", response)
        console.log("doctor.js",response.data.doctors)
        return response.data.data.doctors;
    } catch (error) {
        console.error("Error fetching doctors:", error);
        throw error;
    }
};



// Get doctor availability for a specific date
export const getDoctorAvailability = async(doctorId, date) => {
    try {
        const response = await axiosInstance.get(
            `/api/doctors/${doctorId}/availability?date=${date}`
        );
        return response.data.data.availableSlots;
    } catch (error) {
        console.error("Error fetching doctor availability:", error);
        throw error;
    }
};

