// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  IndianRupee,
  Edit3,
  Trash2,
  FileText,
} from "lucide-react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function AppointmentCard({
  appointment,
  getStatusColor,
  onEdit,
  onCancel,
  onViewReport,
  loading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
      style={{ borderColor: "#c2dfe3" }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#e0fbfc" }}
            >
              <Stethoscope className="w-6 h-6" style={{ color: "#5c6b73" }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "#253237" }}>
                {appointment.doctorId?.name || "Doctor Name"}
              </h3>
              <p className="text-sm" style={{ color: "#5c6b73" }}>
                {appointment.doctorId?.specialization || "Specialization"}
              </p>
            </div>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
            style={{ color: "#5c6b73" }}
          >
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" style={{ color: "#9db4c0" }} />
              {formatDate(appointment.appointmentDate)}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" style={{ color: "#9db4c0" }} />
              {appointment.appointmentTime}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" style={{ color: "#9db4c0" }} />
              {appointment.doctorId?.location || "Location"}
            </div>
            <div className="flex items-center">
              <IndianRupee
                className="w-4 h-4 mr-2"
                style={{ color: "#9db4c0" }}
              />
              {appointment.consultationFee}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {appointment.status === "Pending" && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(appointment)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  color: "#5c6b73",
                  ":hover": { color: "#9db4c0", backgroundColor: "#e0fbfc" },
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#9db4c0";
                  e.target.style.backgroundColor = "#e0fbfc";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#5c6b73";
                  e.target.style.backgroundColor = "transparent";
                }}
                disabled={loading}
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onCancel(appointment._id)}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
          {appointment.status === "Completed" && (
            <button
              onClick={() => onViewReport(appointment)}
              className="p-2 rounded-lg transition-colors"
              style={{
                color: "#5c6b73",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#9db4c0";
                e.target.style.backgroundColor = "#e0fbfc";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#5c6b73";
                e.target.style.backgroundColor = "transparent";
              }}
              title="View Report"
            >
              <FileText className="w-4 h-4" />
            </button>
          )}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
