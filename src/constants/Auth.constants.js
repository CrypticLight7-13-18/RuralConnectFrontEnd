// src/constants/auth.js
export const USER_ROLES = {
  PATIENT: "patient",
  DOCTOR: "doctor",
};

export const AUTH_MODES = {
  LOGIN: "login",
  SIGNUP: "signup",
};

export const ROUTE_PATHS = {
  PATIENT_DASHBOARD: "/chat",
  DOCTOR_DASHBOARD: "/appointment",
};

export const FORM_DEFAULTS = {
  LOGIN: {
    email: "",
    password: "",
    role: USER_ROLES.PATIENT,
  },
  SIGNUP: {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
  },
};

export const ANIMATION_CONFIG = {
  SPRING: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
  SMOOTH: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
};