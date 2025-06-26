import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

const colors = {
  lightestBlue: "#e0fbfc",
  lightBlue:    "#c2dfe3",
  mediumBlue:   "#9db4c0",
  darkBlue:     "#5c6b73",
  darkestBlue:  "#253237",
};

export default function ReportForm({ appointment = {}, onCancel, onSave }) {
  if (!appointment.patientName) return null;

  const [form, setForm] = useState({
    name:         appointment.patientName,
    age:          '',
    weight:       '',
    height:       '',
    comments:     '',
    diagnosis:    '',
    prescription: ''
  });
  const [submitType, setSubmitType] = useState('draft'); 
  // 'draft' or 'final'

  const handleChange = e => 
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTypeChange = e => setSubmitType(e.target.value);

  const handleSubmit = e => {
    e.preventDefault();
    // include submitType in report data
    onSave(appointment.id, { ...form, submitType });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Frosted backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-md"></div>

      <div 
        className="relative bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto p-6"
        style={{ borderTop: `4px solid ${colors.mediumBlue}` }}
      >
        <h3 className="text-xl font-semibold mb-4" style={{ color: colors.darkestBlue }}>
          Add Consultation Report
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                name="name"
                value={form.name}
                disabled
                className="mt-1 w-full border px-3 py-2 rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Age</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Weight (kg)</label>
              <input
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Height (cm)</label>
              <input
                name="height"
                type="number"
                value={form.height}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium">Comments</label>
            <textarea
              name="comments"
              value={form.comments}
              onChange={handleChange}
              rows="2"
              className="mt-1 w-full border px-3 py-2 rounded"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium">Diagnosis</label>
            <textarea
              name="diagnosis"
              value={form.diagnosis}
              onChange={handleChange}
              rows="2"
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Prescription */}
          <div>
            <label className="block text-sm font-medium">Prescription</label>
            <textarea
              name="prescription"
              value={form.prescription}
              onChange={handleChange}
              rows="2"
              className="mt-1 w-full border px-3 py-2 rounded"
              required
            />
          </div>

         <div className="flex justify-end space-x-3 pt-4 border-t">
  {/* Cancel Button */}
  <button
    type="button"
    onClick={onCancel}
    className="
      px-4 py-2 rounded-lg 
      bg-red-400 text-white 
      hover:bg-red-500 
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-red-300
    "
  >
    Cancel
  </button>

  {/* Submit Button */}
  <button
    type="submit"
    className="
      px-4 py-2 rounded-lg 
      bg-green-400 text-white 
      hover:bg-green-500 
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-green-300
    "
  >
    Submit
  </button>
</div>

        </form>
      </div>
    </div>
  );
}
