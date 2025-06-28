import axiosInstance from "../services/api";

// Create a new chat
export const createChat = async (title, systemMessage) => {
  const response = await axiosInstance.post("/api/chat", { title, systemMessage });
  if (response.data && response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to create chat");
};

// Fetch chat summaries for the current user
export const fetchChatSummaries = async () => {
  const response = await axiosInstance.get("/api/chat/chatSummaries");
  // The backend returns { success: true, data: [...] }
  if (response.data && response.data.success) {
    console.log("Chat summaries fetched successfully:", response.data);
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to fetch chat summaries");
};

// Fetch message history for a specific chat
export const fetchChatMessages = async (chatId) => {
  const response = await axiosInstance.get(`/api/chat/${chatId}/messages`);
  if (response.data && response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || "Failed to fetch chat messages");
};
