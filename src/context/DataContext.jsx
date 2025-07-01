import React, { createContext, useState, useEffect } from 'react';
import { getPatients, getIncidents } from '../services/patientService';
import { getAppointments } from '../services/appointmentService';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [patients, setPatients] = useState([]);
    const [incidents, setIncidents] = useState([]);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const storedPatients = getPatients();
        const storedIncidents = getIncidents();
        const storedAppointments = getAppointments();

        setPatients(storedPatients);
        setIncidents(storedIncidents);
        setAppointments(storedAppointments);
    }, []);

    const addPatient = (patient) => {
        setPatients((prev) => [...prev, patient]);
    };

    const updatePatient = (updatedPatient) => {
        setPatients((prev) =>
            prev.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient))
        );
    };

    const deletePatient = (id) => {
        setPatients((prev) => prev.filter((patient) => patient.id !== id));
    };

    const addIncident = (incident) => {
        setIncidents((prev) => [...prev, incident]);
    };

    const updateIncident = (updatedIncident) => {
        setIncidents((prev) =>
            prev.map((incident) => (incident.id === updatedIncident.id ? updatedIncident : incident))
        );
    };

    const deleteIncident = (id) => {
        setIncidents((prev) => prev.filter((incident) => incident.id !== id));
    };

    const addAppointment = (appointment) => {
        setAppointments((prev) => [...prev, appointment]);
    };

    const updateAppointment = (updatedAppointment) => {
        setAppointments((prev) =>
            prev.map((appointment) => (appointment.id === updatedAppointment.id ? updatedAppointment : appointment))
        );
    };

    const deleteAppointment = (id) => {
        setAppointments((prev) => prev.filter((appointment) => appointment.id !== id));
    };

    return (
        <DataContext.Provider
            value={{
                patients,
                incidents,
                appointments,
                addPatient,
                updatePatient,
                deletePatient,
                addIncident,
                updateIncident,
                deleteIncident,
                addAppointment,
                updateAppointment,
                deleteAppointment,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};