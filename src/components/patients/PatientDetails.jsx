import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const PatientDetails = () => {
    const { patientId } = useParams();
    const { patients, incidents } = useData();
    const patient = patients.find(p => p.id === patientId);
    const patientIncidents = incidents.filter(i => i.patientId === patientId);

    if (!patient) {
        return <div>Patient not found</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Patient Details</h2>
            <div className="mb-4">
                <h3 className="text-xl">Personal Information</h3>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>DOB:</strong> {patient.dob}</p>
                <p><strong>Contact:</strong> {patient.contact}</p>
                <p><strong>Health Info:</strong> {patient.healthInfo}</p>
            </div>
            <div>
                <h3 className="text-xl">Incidents</h3>
                {patientIncidents.length > 0 ? (
                    <ul>
                        {patientIncidents.map(incident => (
                            <li key={incident.id} className="border-b py-2">
                                <h4 className="font-semibold">{incident.title}</h4>
                                <p>{incident.description}</p>
                                <p><strong>Status:</strong> {incident.status}</p>
                                <p><strong>Cost:</strong> ${incident.cost}</p>
                                <p><strong>Appointment Date:</strong> {new Date(incident.appointmentDate).toLocaleString()}</p>
                                {incident.files && incident.files.length > 0 && (
                                    <div>
                                        <strong>Files:</strong>
                                        <ul>
                                            {incident.files.map(file => (
                                                <li key={file.name}>
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No incidents found for this patient.</p>
                )}
            </div>
        </div>
    );
};

export default PatientDetails;