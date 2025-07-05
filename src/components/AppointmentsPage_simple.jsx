import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/ThemeContext';
import { CalendarClock, Hourglass, CheckCircle2 } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
    case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Pending': return <Hourglass className="w-6 h-6 stroke-2 text-yellow-600" />;
    case 'Completed': return <CheckCircle2 className="w-6 h-6 stroke-2 text-green-600" />;
    case 'Cancelled': return <CalendarClock className="w-6 h-6 stroke-2 text-red-600" />;
    case 'In Progress': return <CalendarClock className="w-6 h-6 stroke-2 text-blue-600" />;
    default: return <CalendarClock className="w-6 h-6 stroke-2 text-slate-400" />;
  }
};

const SERVICES = [
  { label: 'Dental Cleaning', price: 1500 },
  { label: 'Tooth Extraction', price: 3000 },
  { label: 'Cavity Filling', price: 2000 },
  { label: 'Root Canal', price: 5000 },
  { label: 'Teeth Whitening', price: 3500 },
  { label: 'Braces Consultation', price: 2500 },
  { label: 'X-ray', price: 800 },
  { label: 'Scaling & Polishing', price: 2000 },
  { label: 'Pain Relief', price: 500 },
  { label: 'Checkup', price: 1000 },
  { label: 'Crowns & Bridges', price: 8000 },
  { label: 'Veneers', price: 12000 },
  { label: 'Implants', price: 25000 },
  { label: 'Other', price: 0 },
];

export default function AppointmentsPage({ initial, onSave, onCancel }) {
  const { patients } = useAppData();
  const { isDarkMode } = useTheme();
  
  const [form, setForm] = useState({
    patientId: '',
    title: '',
    appointmentDate: '',
    appointmentTime: '',
    description: '',
    status: 'Scheduled',
    cost: '',
    notes: '',
    ...initial
  });

  const handleServiceChange = (e) => {
    const selected = SERVICES.find(s => s.label === e.target.value);
    setForm(f => ({
      ...f,
      title: e.target.value,
      cost: selected ? selected.price : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className={`rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto ${
      isDarkMode ? 'bg-slate-800' : 'bg-white'
    }`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {initial ? 'Edit Appointment' : 'New Appointment'}
        </h3>
        <p className={`text-sm ${
          isDarkMode ? 'text-slate-400' : 'text-gray-600'
        }`}>
          {initial ? 'Update appointment details' : 'Schedule a new appointment'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>Patient *</label>
            <select
              className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={form.patientId}
              onChange={e => setForm(f => ({ ...f, patientId: e.target.value }))}
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>Treatment *</label>
            <select
              className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={form.title}
              onChange={handleServiceChange}
              required
            >
              <option value="">Select Treatment</option>
              {SERVICES.map(service => (
                <option key={service.label} value={service.label}>{service.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>Date *</label>
            <input
              type="date"
              className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={form.appointmentDate}
              onChange={e => setForm(f => ({ ...f, appointmentDate: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>Time *</label>
            <input
              type="time"
              className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={form.appointmentTime}
              onChange={e => setForm(f => ({ ...f, appointmentTime: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>Status</label>
            <select
              className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-semibold mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>Cost (₹)</label>
            <input
              type="number"
              className={`w-full px-4 py-3 border rounded-xl transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              value={form.cost}
              onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
              placeholder="Enter cost"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>Description</label>
          <textarea
            className={`w-full px-4 py-3 border rounded-xl transition-colors ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows="3"
            placeholder="Additional details about the appointment..."
          />
        </div>

        <div>
          <label className={`block text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>Notes</label>
          <textarea
            className={`w-full px-4 py-3 border rounded-xl transition-colors ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            rows="3"
            placeholder="Doctor's notes..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              isDarkMode 
                ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
          >
            {initial ? 'Update' : 'Save'} Appointment
          </button>
        </div>
      </form>
    </div>
  );
}
