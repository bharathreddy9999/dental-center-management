import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-64 h-full p-5">
            <h2 className="text-2xl font-bold mb-5">Dental Center</h2>
            <ul>
                <li className="mb-3">
                    <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
                </li>
                <li className="mb-3">
                    <Link to="/patients" className="hover:text-gray-400">Patients</Link>
                </li>
                <li className="mb-3">
                    <Link to="/appointments" className="hover:text-gray-400">Appointments</Link>
                </li>
                <li className="mb-3">
                    <Link to="/calendar" className="hover:text-gray-400">Calendar</Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;