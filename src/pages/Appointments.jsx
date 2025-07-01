import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import AppointmentList from '../components/appointments/AppointmentList';
import { useAuth } from '../hooks/useAuth';

const Appointments = () => {
    const { appointments } = useContext(DataContext);
    const { user } = useAuth();

    if (user.role !== 'Admin') {
        return <div>You do not have access to this page.</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Appointments Management</h1>
            <AppointmentList appointments={appointments} />
        </div>
    );
};

export default Appointments;