// Test Version 

export const route = {
  public: {
    home: "/",
    login: "/login",
    register: "/doctor-registration",
    about: "/about-us",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    activationLink: "/get-activation-link",
  },

  doctor: {
    base: "/doctor",
    dashboard: "/doctor",
    profile: "/doctor/profile",
    settings: "/doctor/settings",
    consultations: "/doctor/consultations",

    patients: "/doctor/patients",

    patientDetails: (patientId: string) => `/doctor/patients/${patientId}`,

    visitDetails: (patientId: string, visitId: string) =>
      `/doctor/patients/${patientId}/visit/${visitId}`,

    visitReview: (patientId: string, visitId: string) =>
      `/doctor/patients/${patientId}/visit/${visitId}/review`,

    visitBilling: (patientId: string, visitId: string) =>
      `/doctor/patients/${patientId}/visit/${visitId}/billing`,

    visitComplete: (patientId: string, visitId: string) =>
      `/doctor/patients/${patientId}/visit/${visitId}/complete`,
  },
};
