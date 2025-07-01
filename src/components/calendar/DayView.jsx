import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const DayView = () => {
    const { date } = useParams();
    const { incidents } = useData();

    const filteredIncidents = incidents.filter(incident => {
        const appointmentDate = new Date(incident.appointmentDate);
        return appointmentDate.toDateString() === new Date(date).toDateString();
    });

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Appointments for {new Date(date).toLocaleDateString()}</h2>
            {filteredIncidents.length === 0 ? (
                <p>No appointments scheduled for this day.</p>
            ) : (
                <ul>
                    {filteredIncidents.map(incident => (
                        <li key={incident.id} className="border p-4 mb-2 rounded">
                            <h3 className="font-semibold">{incident.title}</h3>
                            <p>{incident.description}</p>
                            <p><strong>Comments:</strong> {incident.comments}</p>
                            <p><strong>Cost:</strong> ${incident.cost}</p>
                            <p><strong>Status:</strong> {incident.status}</p>
                            <p><strong>Next Appointment:</strong> {incident.nextDate ? new Date(incident.nextDate).toLocaleDateString() : 'N/A'}</p>
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
            )}
        </div>
    );
};

export default DayView;