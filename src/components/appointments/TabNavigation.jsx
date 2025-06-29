import { motion } from "framer-motion";

export default function TabNavigation({ activeTab, setActiveTab }) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative bg-white rounded-full p-1 shadow-lg">
        <motion.div
          className="absolute inset-y-1 bg-slate-600 rounded-full"
          animate={{
            x: activeTab === "appointments" ? 4 : "calc(100% - 4px)",
            width: "calc(50% - 4px)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <button
          onClick={() => setActiveTab("appointments")}
          className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors ${
            activeTab === "appointments" ? "text-white" : "text-slate-600"
          }`}
        >
          My Appointments
        </button>
        <button
          onClick={() => setActiveTab("doctors")}
          className={`relative z-10 px-8 py-3 rounded-full text-sm font-semibold transition-colors ${
            activeTab === "doctors" ? "text-white" : "text-slate-600"
          }`}
        >
          Find Doctors
        </button>
      </div>
    </div>
  );
}
