// src/pages/doctor/DoctorAppointments.jsx

import React, { useState, useEffect } from "react";
import { Search, Calendar, FileText, Plus } from "lucide-react";
import ReportForm from "../../components/doctor/ReportForm";
import {
  getAppointments,
  addConsultationReport,
} from "../../services/appointments";

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue: "#c2dfe3",
  mediumBlue: "#9db4c0",
  darkBlue: "#5c6b73",
  darkestBlue: "#253237",
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportFor, setReportFor] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getAppointments();
        // Transform backend shape into UI shape
        const transformed = data.map((a) => ({
          id: a._id,
          patientName: a.patientId.name,
          appointmentDate: a.appointmentDate,
          pastReports: a.pastReports || [],
          consultationReport: a.consultationReport,
          status : a.status
        }));
        const incomplete = transformed.filter((a) => a.status === "Pending");
        setAppointments(incomplete);
        setFiltered(incomplete);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setFiltered(
      search
        ? appointments.filter((a) =>
            a.patientName.toLowerCase().includes(search.toLowerCase())
          )
        : appointments
    );
  }, [search, appointments]);

  const openReport = (appt) => setReportFor(appt);
  const closeReport = () => setReportFor(null);

  const saveReport = async (id, reportData) => {
    try {
      await addConsultationReport(id, reportData);
      const remaining = appointments.filter((a) => a.id !== id);
      setAppointments(remaining);
      setFiltered(remaining);
    } catch (err) {
      console.error("Failed to save report", err);
    } finally {
      closeReport();
    }
  };

  if (loading) {
    return (
      <div className="p-6" style={{ color: colors.darkestBlue }}>
        Loading…
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full p-6"
      style={{ backgroundColor: colors.lightestBlue }}
    >
      <div className="w-full">
        <h1
          className="text-2xl font-bold mb-4"
          style={{ color: colors.darkestBlue }}
        >
          Incomplete Appointments
        </h1>

        {/* Search */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name…"
            className="pl-10 pr-4 py-2 w-full border rounded"
            style={{
              borderColor: colors.lightBlue,
              color: colors.darkestBlue,
              backgroundColor: "white",
            }}
          />
        </div>

        {/* Appointment Cards */}
        {filtered.length === 0 ? (
          <p style={{ color: colors.darkBlue }}>No appointments found.</p>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className="bg-white p-4 mb-4 rounded shadow flex justify-between"
              style={{ borderLeft: `4px solid ${colors.mediumBlue}` }}
            >
              <div>
                <p
                  className="font-semibold"
                  style={{ color: colors.darkestBlue }}
                >
                  {a.patientName}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="inline mr-1" />{" "}
                  {new Date(a.appointmentDate).toLocaleDateString()}
                </p>

                {/* Past Reports */}
                <div className="mt-3">
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: colors.darkBlue }}
                  >
                    <FileText className="inline mr-1" /> Past Reports (
                    {a.pastReports.length})
                  </p>
                  {a.pastReports.length > 0 ? (
                    <ul className="text-xs space-y-1 max-h-24 overflow-y-auto pr-2">
                      {a.pastReports.map((r, i) => (
                        <li key={i} className="pl-2 border-l border-gray-200">
                          <span className="font-medium">{r.diagnosis}</span>{" "}
                          <span className="text-gray-500">
                            ({new Date(r.date).toLocaleDateString()} –{" "}
                            {r.doctor})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500">No previous reports</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => openReport(a)}
                className="flex items-center space-x-1 px-3 py-1 rounded"
                style={{
                  backgroundColor: colors.darkBlue,
                  color: "white",
                }}
              >
                <Plus size={16} /> <span>Add Report</span>
              </button>
            </div>
          ))
        )}

        {/* Modal Report Form */}
        {reportFor && (
          <ReportForm
            appointment={reportFor}
            onCancel={closeReport}
            onSave={saveReport}
          />
        )}
      </div>
    </div>
  );
}
