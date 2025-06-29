import { AnimatePresence, motion } from "framer-motion";
import { X, FileText, Calendar, Clock, User, Stethoscope, Pill, Heart, Scale, Ruler } from "lucide-react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function ReportModal({ isOpen, appointment, onClose }) {
  if (!isOpen || !appointment) return null;

  // Get report data from appointment or use sample data
  const reportData = appointment.consultationReport || {
    name: "John Doe",
    age: 35,
    weight: 75,
    height: 175,
    comments: "Patient reports feeling much better after following the prescribed treatment. Blood pressure has normalized and symptoms have significantly reduced.",
    diagnosis: "Hypertension Stage 1 - Well controlled with medication",
    prescription: "1. Lisinopril 10mg - Take once daily in the morning\n2. Amlodipine 5mg - Take once daily\n3. Low sodium diet\n4. Regular exercise 30 min/day"
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Consultation Report</h2>
                  <p className="text-sm text-slate-600">Medical Report</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Appointment Details */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-slate-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-medium">Doctor:</span>
                  <span className="ml-1">{appointment.doctorId?.name || "Dr. Smith"}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  <span className="font-medium">Specialization:</span>
                  <span className="ml-1">{appointment.doctorId?.specialization || "General Physician"}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">Date:</span>
                  <span className="ml-1">{formatDate(appointment.appointmentDate)}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-medium">Time:</span>
                  <span className="ml-1">{appointment.appointmentTime}</span>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="space-y-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-500" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium">Name</p>
                    <p className="text-sm font-semibold text-slate-800">{reportData.name}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-xs text-green-600 font-medium">Age</p>
                    <p className="text-sm font-semibold text-slate-800">{reportData.age} years</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 flex items-center">
                    <div className="flex-1">
                      <p className="text-xs text-orange-600 font-medium">Weight</p>
                      <p className="text-sm font-semibold text-slate-800">{reportData.weight} kg</p>
                    </div>
                    <Scale className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex items-center">
                    <div className="flex-1">
                      <p className="text-xs text-purple-600 font-medium">Height</p>
                      <p className="text-sm font-semibold text-slate-800">{reportData.height} cm</p>
                    </div>
                    <Ruler className="w-4 h-4 text-purple-500" />
                  </div>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Diagnosis
                </h3>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <p className="text-slate-700 leading-relaxed">{reportData.diagnosis}</p>
                </div>
              </div>

              {/* Prescription */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-blue-500" />
                  Prescription & Treatment Plan
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <pre className="text-slate-700 leading-relaxed whitespace-pre-wrap font-sans">
                    {reportData.prescription}
                  </pre>
                </div>
              </div>

              {/* Doctor's Comments */}
              {reportData.comments && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Doctor's Comments</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border">
                    <p className="text-slate-700 leading-relaxed">{reportData.comments}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">
                  Report generated on {new Date().toLocaleDateString()}
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Close Report
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}