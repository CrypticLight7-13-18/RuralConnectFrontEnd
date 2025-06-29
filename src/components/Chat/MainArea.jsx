import MessageBubble from "./MessageBubble";
import { MessageCircle } from "lucide-react";

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

export default function MainArea({
  currentChat,
  isLoading,
  startNewChat,
  messagesEndRef,
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {currentChat ? (
        <div className="max-w-4xl mx-auto">
          {currentChat.messageHistory.map((msg, index) => (
              <MessageBubble key={index} msg={msg} />
            ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div
                className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
                style={{ backgroundColor: colors.lightBlue }}
              >
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: colors.darkBlue }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: colors.darkBlue,
                      animationDelay: "0.1s",
                    }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: colors.darkBlue,
                      animationDelay: "0.2s",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.lightBlue }}
            >
              <MessageCircle size={32} style={{ color: colors.darkBlue }} />
            </div>
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ color: colors.darkestBlue }}
            >
              Welcome to Medical Assistant
            </h2>
            <p className="mb-6" style={{ color: colors.darkBlue }}>
              Start a new consultation to get preliminary health assessment
              based on your symptoms.
            </p>
            <button
              onClick={startNewChat}
              className="px-6 py-3 rounded-lg text-white font-medium transition-colors duration-200"
              style={{ backgroundColor: colors.darkBlue }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = colors.darkestBlue)
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = colors.darkBlue)
              }
            >
              Start New Consultation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
