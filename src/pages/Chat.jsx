import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageCircle, User, Settings, Menu, X, Clock, Trash2 } from 'lucide-react';

// Color scheme variables
const colors = {
  lightestBlue: '#e0fbfc',
  lightBlue: '#c2dfe3',
  mediumBlue: '#9db4c0',
  darkBlue: '#5c6b73',
  darkestBlue: '#253237'
};

// Dummy data and functions
const dummyPatientData = {
  userName: 'john_doe',
  personalInfo: {
    name: 'John Doe',
    dateOfBirth: '1990-05-15',
    email: 'john.doe@email.com',
    phone: '+1-234-567-8900'
  },
  role: 'Patient',
  chatIds: ['chat-1', 'chat-2', 'chat-3'],
  appointmentIds: ['apt-1', 'apt-2'],
  orderIds: ['order-1']
};

const dummyChatHistory = [
  {
    id: 'chat-1',
    title: 'Headache and Fever',
    lastMessage: 'Thank you for the consultation',
    timestamp: '2024-06-20T10:30:00Z',
    messageHistory: [
      { role: 'System', message: 'Hello! I\'m here to help with your preliminary health assessment. Please describe your symptoms.', timestamp: '2024-06-20T10:00:00Z' },
      { role: 'User', message: 'I\'ve been having severe headaches and fever for the past 2 days', timestamp: '2024-06-20T10:05:00Z' },
      { role: 'Assistant', message: 'I understand you\'re experiencing headaches and fever. Can you tell me more about the headache - is it throbbing, constant, or does it come and go?', timestamp: '2024-06-20T10:06:00Z' },
      { role: 'User', message: 'It\'s a constant throbbing pain, mostly on the right side', timestamp: '2024-06-20T10:10:00Z' },
      { role: 'Assistant', message: 'Based on your symptoms, this could be related to several conditions. I recommend consulting with a healthcare provider for proper evaluation. In the meantime, ensure adequate rest and hydration.', timestamp: '2024-06-20T10:15:00Z' }
    ]
  },
  {
    id: 'chat-2',
    title: 'Stomach Pain',
    lastMessage: 'Consider scheduling an appointment',
    timestamp: '2024-06-18T14:20:00Z',
    messageHistory: [
      { role: 'System', message: 'Welcome back! How can I assist you today?', timestamp: '2024-06-18T14:00:00Z' },
      { role: 'User', message: 'I have stomach pain after eating', timestamp: '2024-06-18T14:10:00Z' },
      { role: 'Assistant', message: 'Stomach pain after eating can have various causes. How long after eating does the pain typically occur?', timestamp: '2024-06-18T14:12:00Z' }
    ]
  },
  {
    id: 'chat-3',
    title: 'Sleep Issues',
    lastMessage: 'Try maintaining a regular sleep schedule',
    timestamp: '2024-06-15T20:45:00Z',
    messageHistory: [
      { role: 'System', message: 'Good evening! What brings you here today?', timestamp: '2024-06-15T20:30:00Z' },
      { role: 'User', message: 'I\'ve been having trouble sleeping lately', timestamp: '2024-06-15T20:35:00Z' },
      { role: 'Assistant', message: 'Sleep difficulties can significantly impact your well-being. Can you describe what specifically is making it hard to sleep?', timestamp: '2024-06-15T20:37:00Z' }
    ]
  }
];

// Dummy functions
const getPatientProfile = () => Promise.resolve(dummyPatientData);
const getChatHistory = () => Promise.resolve(dummyChatHistory);
const sendMessage = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Thank you for sharing your symptoms. Based on what you\'ve described, I recommend scheduling an appointment with a healthcare provider for a thorough evaluation. This is a preliminary assessment and should not replace professional medical advice.');
    }, 1000);
  });
};

const ChatPage = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [patientProfile, setPatientProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      const profile = await getPatientProfile();
      const history = await getChatHistory();
      setPatientProfile(profile);
      setChatHistory(history);
    };
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messageHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startNewChat = () => {
    const newChat = {
      id: `chat-${Date.now()}`,
      title: 'New Consultation',
      lastMessage: '',
      timestamp: new Date().toISOString(),
      messageHistory: [
        {
          role: 'System',
          message: 'Hello! I\'m here to help with your preliminary health assessment. Please describe your symptoms in detail.',
          timestamp: new Date().toISOString()
        }
      ]
    };
    setCurrentChat(newChat);
    setChatHistory([newChat, ...chatHistory]);
    setSidebarOpen(false);
  };

  const selectChat = (chat) => {
    setCurrentChat(chat);
    setSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      role: 'User',
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedChat = {
      ...currentChat,
      messageHistory: [...currentChat.messageHistory, userMessage],
      lastMessage: message.trim(),
      timestamp: new Date().toISOString()
    };

    setCurrentChat(updatedChat);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(message);
      const assistantMessage = {
        role: 'Assistant',
        message: response,
        timestamp: new Date().toISOString()
      };

      const finalChat = {
        ...updatedChat,
        messageHistory: [...updatedChat.messageHistory, assistantMessage],
        lastMessage: response
      };

      setCurrentChat(finalChat);
      
      // Update chat history
      setChatHistory(prev => 
        prev.map(chat => chat.id === finalChat.id ? finalChat : chat)
      );
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const MessageBubble = ({ msg }) => {
    const isUser = msg.role === 'User';
    const isSystem = msg.role === 'System';
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser 
            ? `text-white` 
            : isSystem 
            ? `text-gray-700 border-2 border-dashed` 
            : `text-gray-800`
        }`}
        style={{
          backgroundColor: isUser ? colors.darkBlue : isSystem ? colors.lightestBlue : colors.lightBlue,
          borderColor: isSystem ? colors.mediumBlue : 'transparent'
        }}>
          <p className="text-sm">{msg.message}</p>
          <p className="text-xs mt-1 opacity-70">{formatTime(msg.timestamp)}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-lightestBlue" >
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
           style={{ backgroundColor: colors.darkestBlue }}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.darkBlue }}>
            <h2 className="text-xl font-semibold text-white">Medical Assistant</h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-opacity-20 hover:bg-white rounded p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Profile Section */}
          <div className="p-4 border-b" style={{ borderColor: colors.darkBlue }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: colors.mediumBlue }}>
                <User size={20} />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{patientProfile?.personalInfo?.name}</p>
                <p className="text-gray-300 text-sm">{patientProfile?.role}</p>
              </div>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="text-gray-300 hover:text-white"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>

          {/* New Chat Button */}
          <div className="p-4">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white transition-colors duration-200"
              style={{ backgroundColor: colors.darkBlue }}
              onMouseEnter={(e) => e.target.style.backgroundColor = colors.mediumBlue}
              onMouseLeave={(e) => e.target.style.backgroundColor = colors.darkBlue}
            >
              <Plus size={20} />
              <span>New Consultation</span>
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-gray-300 text-sm font-medium mb-3">Recent Consultations</h3>
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
                      currentChat?.id === chat.id ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                    style={{ 
                      backgroundColor: currentChat?.id === chat.id ? colors.darkBlue : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (currentChat?.id !== chat.id) {
                        e.currentTarget.style.backgroundColor = colors.darkBlue + '40';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentChat?.id !== chat.id) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                    onClick={() => selectChat(chat)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <MessageCircle size={16} />
                          <p className="font-medium truncate">{chat.title}</p>
                        </div>
                        <p className="text-sm opacity-70 truncate mt-1">{chat.lastMessage}</p>
                        <div className="flex items-center space-x-1 mt-2 text-xs opacity-60">
                          <Clock size={12} />
                          <span>{formatDate(chat.timestamp)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => deleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-red-500 rounded transition-all duration-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.mediumBlue, backgroundColor: 'white' }}>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors duration-200"
              style={{ color: colors.darkBlue }}
              onMouseEnter={(e) => e.target.style.backgroundColor = colors.lightBlue}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-xl font-semibold" style={{ color: colors.darkestBlue }}>
              {currentChat ? currentChat.title : 'Medical Consultation'}
            </h1>
          </div>
          <div className="text-sm" style={{ color: colors.darkBlue }}>
            Preliminary Assessment Tool
          </div>
        </div>

        {/* Chat Messages or Welcome Screen */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentChat ? (
            <div className="max-w-4xl mx-auto">
              {currentChat.messageHistory.map((msg, index) => (
                <MessageBubble key={index} msg={msg} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg" style={{ backgroundColor: colors.lightBlue }}>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.darkBlue }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.darkBlue, animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: colors.darkBlue, animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.lightBlue }}>
                  <MessageCircle size={32} style={{ color: colors.darkBlue }} />
                </div>
                <h2 className="text-2xl font-semibold mb-2" style={{ color: colors.darkestBlue }}>Welcome to Medical Assistant</h2>
                <p className="mb-6" style={{ color: colors.darkBlue }}>Start a new consultation to get preliminary health assessment based on your symptoms.</p>
                <button
                  onClick={startNewChat}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200"
                  style={{ backgroundColor: colors.darkBlue }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = colors.darkestBlue}
                  onMouseLeave={(e) => e.target.style.backgroundColor = colors.darkBlue}
                >
                  Start New Consultation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        {currentChat && (
          <div className="border-t p-4" style={{ borderColor: colors.mediumBlue, backgroundColor: 'white' }}>
            <div className="max-w-4xl mx-auto">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe your symptoms..."
                  className="flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors duration-200"
                  style={{ 
                    borderColor: colors.mediumBlue,
                    backgroundColor: colors.lightestBlue,
                    focusRingColor: colors.darkBlue
                  }}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: colors.darkBlue }}
                  onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = colors.darkestBlue)}
                  onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = colors.darkBlue)}
                >
                  <Send size={20} />
                </button>
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: colors.darkBlue }}>
                This is a preliminary assessment tool. Always consult with healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: colors.darkestBlue }}>Profile Information</h3>
              <button onClick={() => setShowProfile(false)} style={{ color: colors.darkBlue }}>
                <X size={24} />
              </button>
            </div>
            {patientProfile && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.darkBlue }}>Name</label>
                  <p className="text-gray-800">{patientProfile.personalInfo.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.darkBlue }}>Email</label>
                  <p className="text-gray-800">{patientProfile.personalInfo.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.darkBlue }}>Phone</label>
                  <p className="text-gray-800">{patientProfile.personalInfo.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.darkBlue }}>Date of Birth</label>
                  <p className="text-gray-800">{patientProfile.personalInfo.dateOfBirth}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;