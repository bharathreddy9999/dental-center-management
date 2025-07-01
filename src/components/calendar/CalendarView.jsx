import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { format } from 'date-fns';

const CalendarView = () => {
    const { incidents } = useContext(DataContext);
    const today = new Date();
    const upcomingAppointments = incidents.filter(incident => 
        new Date(incident.appointmentDate) >= today
    );

    const groupedByDate = upcomingAppointments.reduce((acc, incident) => {
        const date = format(new Date(incident.appointmentDate), 'yyyy-MM-dd');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(incident);
        return acc;
    }, {});

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Upcoming Appointments</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(groupedByDate).map(date => (
                    <div key={date} className="border rounded-lg p-4 shadow">
                        <h2 className="text-xl font-semibold">{format(new Date(date), 'MMMM dd, yyyy')}</h2>
                        <ul>
                            {groupedByDate[date].map(incident => (
                                <li key={incident.id} className="mt-2">
                                    <strong>{incident.title}</strong> - {incident.description}
                                    <p className="text-sm text-gray-600">{format(new Date(incident.appointmentDate), 'hh:mm a')}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarView;