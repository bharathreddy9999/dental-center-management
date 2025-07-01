const PATIENTS_KEY = 'patients';

export const getPatients = () => {
    const patients = localStorage.getItem(PATIENTS_KEY);
    return patients ? JSON.parse(patients) : [];
};

export const addPatient = (patient) => {
    const patients = getPatients();
    patients.push(patient);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

export const updatePatient = (updatedPatient) => {
    const patients = getPatients();
    const index = patients.findIndex(patient => patient.id === updatedPatient.id);
    if (index !== -1) {
        patients[index] = updatedPatient;
        localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
    }
};

export const deletePatient = (patientId) => {
    const patients = getPatients();
    const filteredPatients = patients.filter(patient => patient.id !== patientId);
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(filteredPatients));
};