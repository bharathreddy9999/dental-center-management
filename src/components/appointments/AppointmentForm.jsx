import React, { useState, useContext } from 'react';
import { DataContext } from '../../context/DataContext';
import { useHistory } from 'react-router-dom';

const AppointmentForm = ({ existingAppointment }) => {
    const { addAppointment, updateAppointment } = useContext(DataContext);
    const history = useHistory();
    
    const [title, setTitle] = useState(existingAppointment ? existingAppointment.title : '');
    const [description, setDescription] = useState(existingAppointment ? existingAppointment.description : '');
    const [comments, setComments] = useState(existingAppointment ? existingAppointment.comments : '');
    const [appointmentDate, setAppointmentDate] = useState(existingAppointment ? existingAppointment.appointmentDate : '');
    const [cost, setCost] = useState(existingAppointment ? existingAppointment.cost : '');
    const [status, setStatus] = useState(existingAppointment ? existingAppointment.status : 'Pending');
    const [files, setFiles] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).map(file => ({
            name: file.name,
            url: URL.createObjectURL(file)
        }));
        setFiles(selectedFiles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const appointmentData = {
            title,
            description,
            comments,
            appointmentDate,
            cost,
            status,
            files
        };

        if (existingAppointment) {
            updateAppointment(existingAppointment.id, appointmentData);
        } else {
            addAppointment(appointmentData);
        }
        history.push('/appointments');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Comments</label>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Appointment Date</label>
                <input
                    type="datetime-local"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Cost</label>
                <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    required
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded p-2 w-full"
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Upload Files</label>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="border rounded p-2 w-full"
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white rounded p-2">Submit</button>
        </form>
    );
};

export default AppointmentForm;