import { Menu } from "lucide-react";
import { colors } from "../../utils/colors";

export default function ChatHeader({ currentChat , setSidebarOpen }) {
  return (
    <div
      className="flex items-center justify-between p-4 border-b"
      style={{ borderColor: colors.mediumBlue, backgroundColor: "white" }}
    >
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg transition-colors duration-200"
          style={{ color: colors.darkBlue }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = colors.lightBlue)
          }
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        >
          <Menu size={20} />
        </button>
        <h1
          className="text-xl font-semibold"
          style={{ color: colors.darkestBlue }}
        >
          {currentChat ? currentChat.title : "Medical Consultation"}
        </h1>
      </div>
      <div className="text-sm" style={{ color: colors.darkBlue }}>
        Preliminary Assessment Tool
      </div>
    </div>
  );
}
