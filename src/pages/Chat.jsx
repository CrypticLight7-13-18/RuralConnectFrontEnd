import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Chat/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import MessageInput from "../components/Chat/MessageInput";
import MainArea from "../components/Chat/MainArea";
import ProfileModal from "../components/Chat/ProfileModal";
import { dummyPatientData } from "../assets/dummyVariables";

//Socket setup
import { io } from "socket.io-client";
import { backendURL } from "../services/api";

const socket = io(backendURL);

// Color scheme variables
const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

// Dummy functions
const getPatientProfile = () => Promise.resolve(dummyPatientData);

// Simulate backend data retrieval for chat details
const getChatSummaries = async () => {
  const res = await fetch("http://localhost:3000/api/chatSummaries");
  return await res.json();
};

const getMessagesForChat = (chatId) => {
  const chat = dummyChatHistory.find((chat) => chat.id === chatId);

  return new Promise((resolve) => {
    setTimeout(() => resolve(chat ? chat.messageHistory : []), 500); // simulate delay
  });
};

const ChatPage = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [chatSummary, setChatSummary] = useState([]);
  const [patientProfile, setPatientProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      const profile = await getPatientProfile();
      const summaries = await getChatSummaries();
      setPatientProfile(profile);
      setChatSummary(summaries);
    };
    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messageHistory]);

  useEffect(() => {
    if (!currentChat) return;

    // Join selected chat room
    socket.emit("joinChat", currentChat.id);

    // Receive existing messages
    socket.on("chatSummary", (messages) => {
      setCurrentChat((prev) => ({
        ...prev,
        messageHistory: messages,
      }));
    });

    // Listen for new incoming messages
    socket.on("message", (msg) => {
      setCurrentChat((prev) => ({
        ...prev,
        messageHistory: [...prev.messageHistory, msg],
      }));
    });

    return () => {
      socket.off("chatSummary");
      socket.off("message");
    };
  }, [currentChat?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewChat = () => {
    const newChat = {
      id: `chat-${Date.now()}`,
      title: "New Consultation",
      lastMessage: "",
      timestamp: new Date().toISOString(),
      messageHistory: [
        {
          role: "System",
          message:
            "Hello! I'm here to help with your preliminary health assessment. Please describe your symptoms in detail.",
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setCurrentChat(newChat);
    setChatSummary([newChat, ...chatSummary]);
    setSidebarOpen(false);
  };

  const selectChat = async (chat) => {
    const messages = await getMessagesForChat(chat.id);
    const chatWithMessages = {
      ...chat,
      messageHistory: messages,
    };
    setCurrentChat(chatWithMessages);
    setSidebarOpen(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      role: "User",
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedChat = {
      ...currentChat,
      messageHistory: [...currentChat.messageHistory, userMessage],
      lastMessage: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setCurrentChat(updatedChat);
    setMessage("");
    setIsLoading(true);

    try {
      socket.emit("newMessage", {
        chatId: currentChat.id,
        role: "User",
        message,
      });

      const assistantMessage = {
        role: "Assistant",
        message: response,
        timestamp: new Date().toISOString(),
      };

      const finalChat = {
        ...updatedChat,
        messageHistory: [...updatedChat.messageHistory, assistantMessage],
        lastMessage: response,
      };

      setCurrentChat(finalChat);

      // Update chat history
      setChatSummary((prev) =>
        prev.map((chat) => (chat.id === finalChat.id ? finalChat : chat))
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatSummary((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  };

  return (
    <div className="flex flex-1 min-h-0" style={{ backgroundColor: colors.lightestBlue }}>
      {/* Sidebar */}
      <Sidebar
        chatSummary={chatSummary}
        currentChat={currentChat}
        onSelectChat={selectChat}
        onNewChat={startNewChat}
        onDeleteChat={deleteChat}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        patientProfile={patientProfile}
        setShowProfile={setShowProfile}
        showProfile={showProfile}
      />
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <ChatHeader currentChat={currentChat} setSidebarOpen={setSidebarOpen} />
        {/* Chat Messages or Welcome Screen */}
        <MainArea
          currentChat={currentChat}
          isLoading={isLoading}
          startNewChat={startNewChat}
          messagesEndRef={messagesEndRef}
        />
        {/* Message Input */}
        <MessageInput
          currentChat={currentChat}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
      {/* Profile Modal */}
      <ProfileModal
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        patientProfile={patientProfile}
      />
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
