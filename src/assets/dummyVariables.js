const dummyPatientData = {
    userName: "john_doe",
    personalInfo: {
      name: "John Doe",
      dateOfBirth: "1990-05-15",
      email: "john.doe@email.com",
      phone: "+1-234-567-8900",
    },
    role: "Patient",
    chatIds: ["chat-1", "chat-2", "chat-3"],
    appointmentIds: ["apt-1", "apt-2"],
    orderIds: ["order-1"],
  };
  
  const dummyChatHistory = [
    {
      id: "chat-1",
      title: "Headache and Fever",
      lastMessage: "Thank you for the consultation",
      timestamp: "2024-06-20T10:30:00Z",
      messageHistory: [
        {
          role: "System",
          message:
            "Hello! I'm here to help with your preliminary health assessment. Please describe your symptoms.",
          timestamp: "2024-06-20T10:00:00Z",
        },
        {
          role: "User",
          message:
            "I've been having severe headaches and fever for the past 2 days",
          timestamp: "2024-06-20T10:05:00Z",
        },
        {
          role: "Assistant",
          message:
            "I understand you're experiencing headaches and fever. Can you tell me more about the headache - is it throbbing, constant, or does it come and go?",
          timestamp: "2024-06-20T10:06:00Z",
        },
        {
          role: "User",
          message: "It's a constant throbbing pain, mostly on the right side",
          timestamp: "2024-06-20T10:10:00Z",
        },
        {
          role: "Assistant",
          message:
            "Based on your symptoms, this could be related to several conditions. I recommend consulting with a healthcare provider for proper evaluation. In the meantime, ensure adequate rest and hydration.",
          timestamp: "2024-06-20T10:15:00Z",
        },
      ],
    },
    {
      id: "chat-2",
      title: "Stomach Pain",
      lastMessage: "Consider scheduling an appointment",
      timestamp: "2024-06-18T14:20:00Z",
      messageHistory: [
        {
          role: "System",
          message: "Welcome back! How can I assist you today?",
          timestamp: "2024-06-18T14:00:00Z",
        },
        {
          role: "User",
          message: "I have stomach pain after eating",
          timestamp: "2024-06-18T14:10:00Z",
        },
        {
          role: "Assistant",
          message:
            "Stomach pain after eating can have various causes. How long after eating does the pain typically occur?",
          timestamp: "2024-06-18T14:12:00Z",
        },
      ],
    },
    {
      id: "chat-3",
      title: "Sleep Issues",
      lastMessage: "Try maintaining a regular sleep schedule",
      timestamp: "2024-06-15T20:45:00Z",
      messageHistory: [
        {
          role: "System",
          message: "Good evening! What brings you here today?",
          timestamp: "2024-06-15T20:30:00Z",
        },
        {
          role: "User",
          message: "I've been having trouble sleeping lately",
          timestamp: "2024-06-15T20:35:00Z",
        },
        {
          role: "Assistant",
          message:
            "Sleep difficulties can significantly impact your well-being. Can you describe what specifically is making it hard to sleep?",
          timestamp: "2024-06-15T20:37:00Z",
        },
      ],
    },
  ];

  export { dummyPatientData, dummyChatHistory };