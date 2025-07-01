import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const AppointmentDetails = () => {
    const { appointmentId } = useParams();
    const { incidents } = useData();
    const appointment = incidents.find(incident => incident.id === appointmentId);

    if (!appointment) {
        return <div>Appointment not found.</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
            <div className="mb-2">
                <strong>Title:</strong> {appointment.title}
            </div>
            <div className="mb-2">
                <strong>Description:</strong> {appointment.description}
            </div>
            <div className="mb-2">
                <strong>Comments:</strong> {appointment.comments}
            </div>
            <div className="mb-2">
                <strong>Appointment Date:</strong> {new Date(appointment.appointmentDate).toLocaleString()}
            </div>
            <div className="mb-2">
                <strong>Cost:</strong> ${appointment.cost}
            </div>
            <div className="mb-2">
                <strong>Status:</strong> {appointment.status}
            </div>
            <div className="mb-2">
                <strong>Files:</strong>
                <ul>
                    {appointment.files.map(file => (
                        <li key={file.name}>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AppointmentDetails;