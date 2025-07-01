import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import PatientCard from './PatientCard';

const PatientList = () => {
    const { patients } = useContext(DataContext);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Patient List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.length > 0 ? (
                    patients.map(patient => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))
                ) : (
                    <p>No patients found.</p>
                )}
            </div>
        </div>
    );
};

export default PatientList;