import { motion } from "framer-motion";
import { Stethoscope, MapPin, IndianRupee } from "lucide-react";

export default function DoctorCard({ doctor, onBookAppointment, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <Stethoscope className="w-8 h-8 text-slate-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{doctor.name}</h3>
            <p className="text-sm text-slate-600">{doctor.specialization}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-600 mb-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {doctor.location}
          </div>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 mr-2" />
            {doctor.consultationFee || "Fee not specified"} consultation
          </div>
        </div>

        <button
          onClick={() => onBookAppointment(doctor)}
          disabled={loading}
          className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Book Appointment
        </button>
      </div>
    </motion.div>
  );
}