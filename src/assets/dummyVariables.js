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

const dummyChatHistory = [{
        id: "chat-1",
        title: "Headache and Fever",
        lastMessage: "Thank you for the consultation",
        timestamp: "2024-06-20T10:30:00Z",
        messageHistory: [{
                role: "System",
                message: "Hello! I'm here to help with your preliminary health assessment. Please describe your symptoms.",
                timestamp: "2024-06-20T10:00:00Z",
            },
            {
                role: "User",
                message: "I've been having severe headaches and fever for the past 2 days",
                timestamp: "2024-06-20T10:05:00Z",
            },
            {
                role: "Assistant",
                message: "I understand you're experiencing headaches and fever. Can you tell me more about the headache - is it throbbing, constant, or does it come and go?",
                timestamp: "2024-06-20T10:06:00Z",
            },
            {
                role: "User",
                message: "It's a constant throbbing pain, mostly on the right side",
                timestamp: "2024-06-20T10:10:00Z",
            },
            {
                role: "Assistant",
                message: "Based on your symptoms, this could be related to several conditions. I recommend consulting with a healthcare provider for proper evaluation. In the meantime, ensure adequate rest and hydration.",
                timestamp: "2024-06-20T10:15:00Z",
            },
        ],
    },
    {
        id: "chat-2",
        title: "Stomach Pain",
        lastMessage: "Consider scheduling an appointment",
        timestamp: "2024-06-18T14:20:00Z",
        messageHistory: [{
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
                message: "Stomach pain after eating can have various causes. How long after eating does the pain typically occur?",
                timestamp: "2024-06-18T14:12:00Z",
            },
        ],
    },
    {
        id: "chat-3",
        title: "Sleep Issues",
        lastMessage: "Try maintaining a regular sleep schedule",
        timestamp: "2024-06-15T20:45:00Z",
        messageHistory: [{
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
                message: "Sleep difficulties can significantly impact your well-being. Can you describe what specifically is making it hard to sleep?",
                timestamp: "2024-06-15T20:37:00Z",
            },
        ],
    },
];

// Sample doctors data for testing
export const dummyDoctors = [{
        _id: "1",
        name: "Dr. Rajesh Kumar",
        specialization: "Cardiologist",
        location: "Koramangala, Bangalore",
        consultationFee: 800,
        experience: 15,
        rating: 4.8,
        availability: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
    },
    {
        _id: "2",
        name: "Dr. Priya Sharma",
        specialization: "Dermatologist",
        location: "Indiranagar, Bangalore",
        consultationFee: 600,
        experience: 12,
        rating: 4.9,
        availability: ["09:30 AM", "10:30 AM", "11:30 AM", "02:30 PM", "03:30 PM"],
    },
    {
        _id: "3",
        name: "Dr. Amit Patel",
        specialization: "Neurologist",
        location: "Whitefield, Bangalore",
        consultationFee: 1000,
        experience: 18,
        rating: 4.7,
        availability: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"],
    },
    {
        _id: "4",
        name: "Dr. Sunita Rao",
        specialization: "Pediatrician",
        location: "Jayanagar, Bangalore",
        consultationFee: 500,
        experience: 10,
        rating: 4.6,
        availability: ["09:00 AM", "10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM"],
    },
    {
        _id: "5",
        name: "Dr. Vikram Singh",
        specialization: "Orthopedic",
        location: "HSR Layout, Bangalore",
        consultationFee: 750,
        experience: 14,
        rating: 4.8,
        availability: ["09:30 AM", "10:30 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
    },
    {
        _id: "6",
        name: "Dr. Meera Iyer",
        specialization: "Gynecologist",
        location: "BTM Layout, Bangalore",
        consultationFee: 700,
        experience: 16,
        rating: 4.9,
        availability: ["10:00 AM", "11:00 AM", "02:30 PM", "03:30 PM", "04:30 PM"],
    },
];

// Sample appointments data for testing
export const dummyAppointments = [{
        _id: "app1",
        doctorId: {
            _id: "1",
            name: "Dr. Rajesh Kumar",
            specialization: "Cardiologist",
            location: "Koramangala, Bangalore",
        },
        appointmentDate: "2025-07-02T00:00:00.000Z",
        appointmentTime: "10:00 AM",
        status: "Pending",
        consultationFee: 800,
        createdAt: "2025-06-28T10:30:00.000Z",
    },
    {
        _id: "app2",
        doctorId: {
            _id: "2",
            name: "Dr. Priya Sharma",
            specialization: "Dermatologist",
            location: "Indiranagar, Bangalore",
        },
        appointmentDate: "2025-06-30T00:00:00.000Z",
        appointmentTime: "02:30 PM",
        status: "Completed",
        consultationFee: 600,
        createdAt: "2025-06-25T14:20:00.000Z",
    },
    {
        _id: "app3",
        doctorId: {
            _id: "3",
            name: "Dr. Amit Patel",
            specialization: "Neurologist",
            location: "Whitefield, Bangalore",
        },
        appointmentDate: "2025-07-05T00:00:00.000Z",
        appointmentTime: "11:00 AM",
        status: "Pending",
        consultationFee: 1000,
        createdAt: "2025-06-27T16:45:00.000Z",
    },
    {
        _id: "app4",
        doctorId: {
            _id: "4",
            name: "Dr. Sunita Rao",
            specialization: "Pediatrician",
            location: "Jayanagar, Bangalore",
        },
        appointmentDate: "2025-06-25T00:00:00.000Z",
        appointmentTime: "04:00 PM",
        status: "Cancelled",
        consultationFee: 500,
        createdAt: "2025-06-20T09:15:00.000Z",
    },
    {
        _id: "app5",
        doctorId: {
            _id: "5",
            name: "Dr. Vikram Singh",
            specialization: "Orthopedic",
            location: "HSR Layout, Bangalore",
        },
        appointmentDate: "2025-07-01T00:00:00.000Z",
        appointmentTime: "03:00 PM",
        status: "Pending",
        consultationFee: 750,
        createdAt: "2025-06-26T11:30:00.000Z",
    },
];

// Sample time slots for testing
export const dummyTimeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
];

// Sample specializations for filtering
export const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedic",
    "Gynecologist",
    "Psychiatrist",
    "General Physician",
    "ENT Specialist",
    "Ophthalmologist",
];

// Sample locations in Bangalore
export const locations = [
    "Koramangala",
    "Indiranagar",
    "Whitefield",
    "Jayanagar",
    "HSR Layout",
    "BTM Layout",
    "Electronic City",
    "Marathahalli",
    "Banashankari",
    "Rajajinagar",
];

export { dummyPatientData, dummyChatHistory };