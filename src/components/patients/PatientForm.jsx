import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { useParams, useHistory } from 'react-router-dom';

const PatientForm = () => {
    const { patients, addPatient, editPatient } = useContext(DataContext);
    const { id } = useParams();
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        contact: '',
        healthInfo: ''
    });

    useEffect(() => {
        if (id) {
            const patient = patients.find(p => p.id === id);
            if (patient) {
                setFormData(patient);
            }
        }
    }, [id, patients]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            editPatient(formData);
        } else {
            addPatient(formData);
        }
        history.push('/patients');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-xl mb-4">{id ? 'Edit Patient' : 'Add Patient'}</h2>
            <div className="mb-4">
                <label className="block mb-1">Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Date of Birth</label>
                <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Contact Info</label>
                <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1">Health Info</label>
                <textarea
                    name="healthInfo"
                    value={formData.healthInfo}
                    onChange={handleChange}
                    className="border p-2 w-full"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2">
                {id ? 'Update Patient' : 'Add Patient'}
            </button>
        </form>
    );
};

export default PatientForm;