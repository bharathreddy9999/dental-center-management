import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import PatientDashboard from '../components/dashboard/PatientDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="p-4">
            {user.role === 'Admin' ? <AdminDashboard /> : <PatientDashboard />}
        </div>
    );
};

export default Dashboard;