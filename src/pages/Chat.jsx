import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Chat/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import MessageInput from "../components/Chat/MessageInput";
import MainArea from "../components/Chat/MainArea";
import { dummyPatientData } from "../assets/dummyVariables";
import {
  fetchChatSummaries,
  createChat,
  deleteChatById,
} from "../services/chat";
import { socketService } from "../services/secureSocket";
import { colors } from "../utils/colors";
import { useError } from "../contexts/ErrorContext";
import { sanitizeUserInput, ClientRateLimit } from "../utils/security";

// Rate limiter for chat messages
const messageRateLimit = new ClientRateLimit(10, 60000); // 10 messages per minute

const getPatientProfile = () => Promise.resolve(dummyPatientData);

const ChatPage = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatSummary, setChatSummary] = useState([]);
  const [patientProfile, setPatientProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const messagesEndRef = useRef(null);
  const { addError } = useError();

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      const profile = await getPatientProfile();
      let summaries = [];
      try {
        summaries = await fetchChatSummaries();
      } catch {
        summaries = [];
      }
      setPatientProfile(profile);
      setChatSummary(summaries);
    };
    loadData();
  }, []);

  // Initialize secure socket connection
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        setConnectionStatus('connecting');
        await socketService.connect();
        setConnectionStatus('connected');
        
        // Set up socket event listeners
        socketService.on("chatHistory", (messages) => {
          const summary = chatSummary.find((c) => c.id === selectedChatId);
          if (summary) {
            setCurrentChat({ ...summary, messageHistory: messages.messageHistory });
          }
        });

        socketService.on("message", (msg) => {
          setCurrentChat((prev) => {
            if (!prev) return prev;
            const history = prev.messageHistory || [];
            
            // Prevent duplicate messages
            if (history.length > 0) {
              const last = history[history.length - 1];
              if (
                last &&
                last.message === msg.message &&
                last.role === msg.role &&
                new Date(last.timestamp).getTime() === new Date(msg.timestamp).getTime()
              ) {
                return prev;
              }
            }
            return { ...prev, messageHistory: [...history, msg] };
          });
        });

      } catch (error) {
        console.error('Failed to initialize socket:', error);
        setConnectionStatus('error');
        addError(error.message || 'Failed to connect to chat server');
      }
    };

    initializeSocket();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Join chat room when chat changes
  useEffect(() => {
    const joinChatRoom = async () => {
      if (currentChat?.id && socketService.isSocketConnected()) {
        try {
          await socketService.joinChat(currentChat.id);
        } catch (error) {
          console.error('Failed to join chat:', error);
          addError('Failed to join chat room');
        }
      }
    };

    joinChatRoom();
  }, [currentChat?.id, addError]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messageHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startNewChat = async () => {
    const title = "New Consultation";
    const systemMessage =
      "Hello! I'm here to help with your preliminary health assessment. Please describe your symptoms in detail.";
    try {
      setIsLoading(true);
      const chat = await createChat(title, systemMessage);
      const newChat = {
        id: chat._id,
        title: chat.title,
        lastMessage: chat.lastMessage,
        timestamp: chat.updatedAt || chat.createdAt || new Date().toISOString(),
        messageHistory: chat.messageHistory || [],
      };
      setCurrentChat(newChat);
      setSelectedChatId(newChat.id); // Switch to the new chat
      setChatSummary([newChat, ...chatSummary]);
      setSidebarOpen(false);
    } catch (error) {
      addError(error.message || "Failed to create chat");
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = async (chat) => {
    if (!chat) {
      console.error("No chat or chat.id provided to selectChat", chat, chat?.id);
      return;
    }
    
    try {
      setSelectedChatId(chat.id);
      await socketService.joinChat(chat.id);
      setSidebarOpen(false);
    } catch (error) {
      console.error('Failed to select chat:', error);
      addError('Failed to join chat');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading || !currentChat?.id) return;
    
    // Validate message length and rate limiting
    if (message.length > 1000) {
      addError('Message is too long (max 1000 characters)');
      return;
    }

    if (!messageRateLimit.isAllowed('sendMessage')) {
      addError('You are sending messages too quickly. Please slow down.');
      return;
    }

    // Sanitize the message
    const sanitizedMessage = sanitizeUserInput(message.trim());
    
    try {
      setIsLoading(true);
      await socketService.sendMessage(currentChat.id, sanitizedMessage, "User");
      setMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
      addError(error.message || 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await deleteChatById(chatId);
      setChatSummary((prev) => prev.filter((chat) => chat.id !== chatId));
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
    } catch (error) {
      addError(error.message || "Failed to delete chat");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-1 min-h-0"
      style={{ backgroundColor: colors.lightestBlue }}
    >
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
      <div className="flex-1 flex flex-col min-h-0 max-h-[90.5vh]">
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
