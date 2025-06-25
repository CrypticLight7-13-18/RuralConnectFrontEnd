import { Send } from "lucide-react";

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

export default function MessageInput({
    currentChat,
    message,
    setMessage,
    handleSendMessage,
    isLoading = false,
}) {
  return (
    <>
      {currentChat && (
        <div
          className="border-t p-4"
          style={{ borderColor: colors.mediumBlue, backgroundColor: "white" }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Describe your symptoms..."
                className="flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-colors duration-200"
                style={{
                  borderColor: colors.mediumBlue,
                  backgroundColor: colors.lightestBlue,
                  focusRingColor: colors.darkBlue,
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: colors.darkBlue }}
                onMouseEnter={(e) =>
                  !e.target.disabled &&
                  (e.target.style.backgroundColor = colors.darkestBlue)
                }
                onMouseLeave={(e) =>
                  !e.target.disabled &&
                  (e.target.style.backgroundColor = colors.darkBlue)
                }
              >
                <Send size={20} />
              </button>
            </div>
            <p
              className="text-xs mt-2 text-center"
              style={{ color: colors.darkBlue }}
            >
              This is a preliminary assessment tool. Always consult with
              healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
