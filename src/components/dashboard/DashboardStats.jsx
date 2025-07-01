import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import Card from '../ui/Card';

const DashboardStats = () => {
    const { patients, incidents } = useContext(DataContext);

    const totalPatients = patients.length;
    const totalIncidents = incidents.length;
    const completedTreatments = incidents.filter(incident => incident.status === 'Completed').length;
    const pendingTreatments = incidents.filter(incident => incident.status === 'Pending').length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card title="Total Patients" value={totalPatients} />
            <Card title="Total Incidents" value={totalIncidents} />
            <Card title="Completed Treatments" value={completedTreatments} />
            <Card title="Pending Treatments" value={pendingTreatments} />
        </div>
    );
};

export default DashboardStats;