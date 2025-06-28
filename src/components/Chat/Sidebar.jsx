import {
  X,
  Plus,
  Clock,
  Trash2,
  MessageCircle,
} from "lucide-react";

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

export default function Sidebar({
  chatSummary,
  currentChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  sidebarOpen,
  setSidebarOpen,
}) {
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };
  return (
    <div
      className={`${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } fixed inset-y-0 left-0 z-50 w-80 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:h-[90.5vh] max-h-[100vh]`}
      style={{ backgroundColor: colors.darkestBlue }}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: colors.darkBlue }}
        >
          <h2 className="text-xl font-semibold text-white">
            Medical Assistant
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-opacity-20 hover:bg-white rounded p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white transition-colors duration-200"
            style={{ backgroundColor: colors.darkBlue }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = colors.mediumBlue)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = colors.darkBlue)
            }
          >
            <Plus size={20} />
            <span>New Consultation</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 min-h-0">
          <div className="p-4 h-full flex flex-col">
            <h3 className="text-gray-300 text-sm font-medium mb-3">
              Recent Consultations
            </h3>
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2">
              {/* Remove console.log from rendering logic, just map directly */}
              {Array.isArray(chatSummary) && chatSummary.length > 0 ? chatSummary.map((chat) => (
                <div
                  key={chat.id}
                  className={`group cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
                    currentChat?.id === chat.id
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  style={{
                    backgroundColor:
                      currentChat?.id === chat.id
                        ? colors.darkBlue
                        : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (currentChat?.id !== chat.id) {
                      e.currentTarget.style.backgroundColor =
                        colors.darkBlue + "40";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentChat?.id !== chat.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                  onClick={() => onSelectChat(chat)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <MessageCircle size={16} />
                        <p className="font-medium truncate">{chat.title}</p>
                      </div>
                      {/* Show last message details if available */}
                      {chat.lastMessage && typeof chat.lastMessage === 'object' ? (
                        <div className="text-sm opacity-70 truncate mt-1">
                          <span className="font-semibold mr-1">{chat.lastMessage.role}:</span>
                          <span>{chat.lastMessage.message}</span>
                        </div>
                      ) : (
                        <p className="text-sm opacity-70 truncate mt-1">{chat.lastMessage}</p>
                      )}
                      <div className="flex items-center space-x-1 mt-2 text-xs opacity-60">
                        <Clock size={12} />
                        <span>
                          {chat.lastMessage && chat.lastMessage.timestamp
                            ? formatDate(chat.lastMessage.timestamp)
                            : formatDate(chat.timestamp)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => onDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 ml-2 p-1 hover:bg-red-500 rounded transition-all duration-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-gray-400 text-center mt-8">No consultations found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
