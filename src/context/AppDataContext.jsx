import React, { createContext, useContext, useState, useEffect } from 'react';

const SAMPLE_PATIENTS = [
  {
    id: 'p1',
    name: 'John Doe',
    dob: '1990-05-10',
    contact: '1234567890',
    healthInfo: 'No allergies'
  }
];

const SAMPLE_INCIDENTS = [
  {
    id: 'i1',
    patientId: 'p1',
    title: 'Toothache',
    description: 'Upper molar pain',
    comments: 'Sensitive to cold',
    appointmentDate: '2025-07-01T10:00:00',
    cost: 80,
    status: 'Completed',
    files: [
      { 
        name: 'invoice.pdf', 
        url: 'data:application/pdf;base64,JVBERi0xLjQKJcfs...', // base64string-or-blob-url
        type: 'application/pdf',
        size: 25600
      },
      { 
        name: 'xray.png', 
        url: 'data:image/png;base64,iVBORw0KGgoA...', // base64string-or-blob-url
        type: 'image/png',
        size: 204800
      }
    ]
  }
];

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [patients, setPatients] = useState(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : SAMPLE_PATIENTS;
  });
  const [incidents, setIncidents] = useState(() => {
    const stored = localStorage.getItem('incidents');
    return stored ? JSON.parse(stored) : SAMPLE_INCIDENTS;
  });

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);
  useEffect(() => {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }, [incidents]);

  // Patient CRUD
  const addPatient = (patient) => {
    setPatients(prev => [...prev, { ...patient, id: 'p' + Date.now() }]);
  };
  const updatePatient = (id, updates) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setIncidents(prev => prev.filter(i => i.patientId !== id)); // Remove related incidents
  };

  // Incident CRUD
  const addIncident = (incident) => {
    setIncidents(prev => [...prev, { ...incident, id: 'i' + Date.now() }]);
  };
  const updateIncident = (id, updates) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };
  const deleteIncident = (id) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  // File handling
  const handleFileUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = {
          name: file.name,
          url: reader.result,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };
        resolve(fileData);
      };
      reader.readAsDataURL(file);
    });
  };

  // Analytics functions
  const getAnalytics = () => {
    const totalRevenue = incidents
      .filter(i => i.status === 'Completed')
      .reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);
    
    const pendingAppointments = incidents.filter(i => 
      i.status === 'Scheduled' || i.status === 'In Progress'
    ).length;
    
    const completedTreatments = incidents.filter(i => i.status === 'Completed').length;
    
    const patientsWithUpcomingAppointments = patients.filter(p => 
      incidents.some(i => 
        i.patientId === p.id && 
        new Date(i.appointmentDate) > new Date() &&
        (i.status === 'Scheduled' || i.status === 'In Progress')
      )
    ).length;

    return {
      totalRevenue,
      pendingAppointments,
      completedTreatments,
      totalPatients: patients.length,
      patientsWithUpcomingAppointments
    };
  };

  // Reset data to sample data
  const resetData = () => {
    localStorage.removeItem('patients');
    localStorage.removeItem('incidents');
    localStorage.removeItem('authUser');
    setPatients(SAMPLE_PATIENTS);
    setIncidents(SAMPLE_INCIDENTS);
    window.location.reload();
  };

  return (
    <AppDataContext.Provider value={{
      patients, addPatient, updatePatient, deletePatient,
      incidents, addIncident, updateIncident, deleteIncident,
      handleFileUpload, getAnalytics, resetData
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
} 