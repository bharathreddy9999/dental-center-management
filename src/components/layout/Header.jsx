import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const Header = () => {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/">
                    <img src={logo} alt="Dental Center Logo" className="h-10" />
                </Link>
                <nav className="space-x-4">
                    <Link to="/patients" className="text-gray-700 hover:text-blue-500">Patients</Link>
                    <Link to="/appointments" className="text-gray-700 hover:text-blue-500">Appointments</Link>
                    <Link to="/calendar" className="text-gray-700 hover:text-blue-500">Calendar</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;