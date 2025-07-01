import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import PatientList from '../components/patients/PatientList';
import PatientForm from '../components/patients/PatientForm';

const Patients = () => {
    const { patients } = useContext(DataContext);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
            <PatientForm />
            <h2 className="text-xl font-semibold mt-6">Patient List</h2>
            {patients.length > 0 ? (
                <PatientList patients={patients} />
            ) : (
                <p>No patients found.</p>
            )}
        </div>
    );
};

export default Patients;