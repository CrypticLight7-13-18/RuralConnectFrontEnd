import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Chat/Sidebar";
import ChatHeader from "../components/Chat/ChatHeader";
import MessageInput from "../components/Chat/MessageInput";
import MainArea from "../components/Chat/MainArea";
import { dummyPatientData } from "../assets/dummyVariables";
import { fetchChatSummaries, createChat } from "../services/chat";
import { io } from "socket.io-client";
import { backendURL } from "../services/api";

const socket = io(backendURL);

const colors = {
    lightestBlue: "#e0fbfc",
    lightBlue: "#c2dfe3",
    mediumBlue: "#9db4c0",
    darkBlue: "#5c6b73",
    darkestBlue: "#253237",
};

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
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Load initial data
        const loadData = async () => {
            const profile = await getPatientProfile();
            let summaries = [];
            try {
                summaries = await fetchChatSummaries();
            } catch (e) {
                summaries = [];
            }
            setPatientProfile(profile);
            setChatSummary(summaries);
        };
        loadData();
    }, []);

    useEffect(() => {
        // Removed console.log for production
    }, [currentChat]);

    // Socket listeners for chatHistory and message
    useEffect(() => {
        socket.on("chatHistory", (messages) => {
            // Find the summary for the selected chat
            const summary = chatSummary.find((c) => c.id === selectedChatId);
            if (summary) {
                setCurrentChat({ ...summary, messageHistory: messages.messageHistory });
            }
        });
        socket.on("message", (msg) => {
            setCurrentChat((prev) => {
                if (!prev) return prev;
                const history = prev.messageHistory || [];
                // Prevent duplicate if the last message is identical
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
        return () => {
            socket.off("chatHistory");
            socket.off("message");
        };
    }, [chatSummary, selectedChatId]);

    useEffect(() => {
        scrollToBottom();
    }, [currentChat?.messageHistory]);

    // Join chat room when chat changes
    useEffect(() => {
        if (currentChat && currentChat.id) {
            socket.emit("joinChat", { chatId: currentChat.id });
        }
    }, [currentChat?.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const startNewChat = async () => {
        const title = "New Consultation";
        const systemMessage = "Hello! I'm here to help with your preliminary health assessment. Please describe your symptoms in detail.";
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
            setChatSummary([newChat, ...chatSummary]);
            setSidebarOpen(false);
        } catch (error) {
            alert(error.message || "Failed to create chat");
        } finally {
            setIsLoading(false);
        }
    };

    const selectChat = (chat) => {
        if (!chat) {
            console.error("No chat or chat.id provided to selectChat", chat, chat?.id);
            return;
        }
        setSelectedChatId(chat.id);
        socket.emit("joinChat", { chatId: chat.id });
        setSidebarOpen(false);
    };

    const handleSendMessage = async () => {
        if (!message.trim() || isLoading || !currentChat?.id) return;
        setIsLoading(true);
        socket.emit("newMessage", {
            chatId: currentChat.id,
            role: "User",
            message,
        });
        setMessage("");
        setIsLoading(false);
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
