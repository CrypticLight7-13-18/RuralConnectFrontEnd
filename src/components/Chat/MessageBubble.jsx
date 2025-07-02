import Markdown from "react-markdown";
import { colors } from "../../utils/colors";
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "User";
  const isSystem = msg.role === "System";

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isUser
          ? `text-white`
          : isSystem
            ? `text-gray-700 border-2 border-dashed`
            : `text-gray-800`
          }`}
        style={{
          backgroundColor: isUser
            ? colors.darkBlue
            : isSystem
              ? colors.lightestBlue
              : colors.lightBlue,
          borderColor: isSystem ? colors.mediumBlue : "transparent",
        }}
      >
        <p className="text-sm"><Markdown>{msg.message}</Markdown></p>
        <p className="text-xs mt-1 opacity-70">{formatTime(msg.timestamp)}</p>
      </div>
    </div>

  );
};

export default MessageBubble;