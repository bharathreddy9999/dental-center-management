import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import CalendarView from '../components/calendar/CalendarView';

const Calendar = () => {
    const { incidents } = useContext(DataContext);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Calendar</h1>
            <CalendarView incidents={incidents} />
        </div>
    );
};

export default Calendar;