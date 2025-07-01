import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import DashboardStats from './DashboardStats';
import PatientList from '../patients/PatientList';
import AppointmentList from '../appointments/AppointmentList';

const AdminDashboard = () => {
    const { patients, incidents } = useContext(DataContext);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <DashboardStats patients={patients} incidents={incidents} />
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Patient List</h2>
                <PatientList patients={patients} />
            </div>
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Appointment List</h2>
                <AppointmentList incidents={incidents} />
            </div>
        </div>
    );
};

export default AdminDashboard;