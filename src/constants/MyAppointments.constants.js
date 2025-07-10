// src/constants/appointments.js

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled',
};

export const TABS = {
  APPOINTMENTS: 'appointments',
  DOCTORS: 'doctors',
};

export const APPOINTMENT_FILTERS = [
  { value: 'all', label: 'All Appointments' },
  { value: APPOINTMENT_STATUS.PENDING, label: 'Pending' },
  { value: APPOINTMENT_STATUS.CONFIRMED, label: 'Confirmed' },
  { value: APPOINTMENT_STATUS.COMPLETED, label: 'Completed' },
  { value: APPOINTMENT_STATUS.CANCELLED, label: 'Cancelled' },
];

export const DOCTOR_SPECIALIZATIONS = [
  'Cardiologist',
  'Neurologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic',
  'Gynecologist',
  'Psychiatrist',
  'General Physician',
  'ENT Specialist',
  'Ophthalmologist',
  'Endocrinologist',
  'Rheumatologist',
  'Oncologist',
  'Urologist',
  'Pulmonologist',
];

export const TIME_SLOTS = {
  MORNING: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
  AFTERNOON: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
  EVENING: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30'],
};

export const DEFAULT_TIME_SLOTS = [
  ...TIME_SLOTS.MORNING,
  ...TIME_SLOTS.AFTERNOON,
  ...TIME_SLOTS.EVENING,
];

export const APPOINTMENT_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  CANCEL: 'cancel',
  VIEW_REPORT: 'view_report',
};

export const MODAL_TYPES = {
  APPOINTMENT: 'appointment',
  REPORT: 'report',
  SUCCESS: 'success',
};

export const FORM_VALIDATION = {
  MIN_DATE: new Date().toISOString().split('T')[0], // Today
  MAX_DATE: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
  MIN_FEE: 0,
  MAX_FEE: 10000,
};

export const ERROR_MESSAGES = {
  LOAD_APPOINTMENTS: 'Failed to load appointments',
  LOAD_DOCTORS: 'Failed to load doctors',
  LOAD_AVAILABILITY: 'Failed to load doctor availability',
  CREATE_APPOINTMENT: 'Failed to create appointment',
  UPDATE_APPOINTMENT: 'Failed to update appointment',
  CANCEL_APPOINTMENT: 'Failed to cancel appointment',
  INVALID_FORM: 'Please fill in all required fields',
  PAST_DATE: 'Appointment date cannot be in the past',
  DOCTOR_REQUIRED: 'Please select a doctor',
  DATE_REQUIRED: 'Please select an appointment date',
  TIME_REQUIRED: 'Please select an appointment time',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

export const SUCCESS_MESSAGES = {
  APPOINTMENT_CREATED: 'Appointment booked successfully',
  APPOINTMENT_UPDATED: 'Appointment updated successfully',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
};

export const LOADING_MESSAGES = {
  APPOINTMENTS: 'Loading appointments...',
  DOCTORS: 'Loading doctors...',
  AVAILABILITY: 'Loading availability...',
  CREATING: 'Booking appointment...',
  UPDATING: 'Updating appointment...',
  CANCELLING: 'Cancelling appointment...',
};