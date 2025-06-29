import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Stethoscope,
  MapPin,
  IndianRupee,
  Edit3,
  Trash2,
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
  loading 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                {appointment.doctorId?.name || "Doctor Name"}
              </h3>
              <p className="text-sm text-slate-600">
                {appointment.doctorId?.specialization || "Specialization"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(appointment.appointmentDate)}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {appointment.appointmentTime}
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {appointment.doctorId?.location || "Location"}
            </div>
            <div className="flex items-center">
              <IndianRupee className="w-4 h-4 mr-2" />
              {appointment.consultationFee}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {appointment.status === "Pending" && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(appointment)}
                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
