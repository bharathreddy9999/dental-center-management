import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import AppointmentList from '../appointments/AppointmentList';

const PatientDashboard = () => {
    const { patients, incidents } = useContext(DataContext);
    const { user } = useContext(AuthContext);

    const patientData = patients.find(patient => patient.id === user.patientId);
    const patientIncidents = incidents.filter(incident => incident.patientId === user.patientId);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Patient Dashboard</h1>
            {patientData ? (
                <div className="mb-6">
                    <h2 className="text-xl font-semibold">Patient Information</h2>
                    <p><strong>Name:</strong> {patientData.name}</p>
                    <p><strong>DOB:</strong> {patientData.dob}</p>
                    <p><strong>Contact:</strong> {patientData.contact}</p>
                    <p><strong>Health Info:</strong> {patientData.healthInfo}</p>
                </div>
            ) : (
                <p>No patient data found.</p>
            )}
            <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>
            <AppointmentList incidents={patientIncidents} />
        </div>
    );
};

export default PatientDashboard;