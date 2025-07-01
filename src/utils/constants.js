export const USER_ROLES = {
  ADMIN: 'Admin',
  PATIENT: 'Patient',
};

export const LOCAL_STORAGE_KEYS = {
  USERS: 'users',
  PATIENTS: 'patients',
  INCIDENTS: 'incidents',
  AUTH_TOKEN: 'authToken',
};

export const DEFAULT_PATIENT_HEALTH_INFO = 'No allergies'; 

export const APPOINTMENT_STATUSES = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}; 

export const DATE_FORMATS = {
  DISPLAY: 'YYYY-MM-DD HH:mm',
  API: 'YYYY-MM-DDTHH:mm:ss',
}; 

export const MAX_FILE_SIZE_MB = 5;  // Maximum file size for uploads in MB

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};