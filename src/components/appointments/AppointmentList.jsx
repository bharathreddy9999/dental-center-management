import React, { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import AppointmentCard from './AppointmentCard';

const AppointmentList = () => {
    const { appointments } = useContext(DataContext);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Appointments</h2>
            {appointments.length === 0 ? (
                <p>No appointments scheduled.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {appointments.map(appointment => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppointmentList;