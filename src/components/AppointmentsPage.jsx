import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Upload, FileText, X, Receipt } from 'lucide-react';

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
  const { user } = useAuth();
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
    files: [],
    ...initial
  });

  const [uploadedFiles, setUploadedFiles] = useState(initial?.files || []);

  const isAdmin = user?.role === 'Admin';

  const handleServiceChange = (e) => {
    const selected = SERVICES.find(s => s.label === e.target.value);
    setForm(f => ({
      ...f,
      title: e.target.value,
      cost: selected ? selected.price : ''
    }));
  };

  // File upload functionality
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newFile = {
          name: file.name,
          url: reader.result,
          type: file.type,
          size: file.size,
          uploadDate: new Date().toISOString()
        };
        setUploadedFiles(prev => [...prev, newFile]);
        setForm(f => ({ ...f, files: [...(f.files || []), newFile] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setForm(f => ({ ...f, files: (f.files || []).filter((_, i) => i !== index) }));
  };

  // Generate invoice
  const generateInvoice = () => {
    const patient = patients.find(p => p.id === form.patientId);
    const appointmentDate = new Date(form.appointmentDate);
    
    const invoiceContent = `
DENTAL CARE CLINIC
INVOICE

Patient: ${patient?.name || 'N/A'}
Email: ${patient?.email || 'N/A'}
Phone: ${patient?.contact || 'N/A'}

Date: ${appointmentDate.toLocaleDateString()}
Time: ${form.appointmentTime}

Treatment: ${form.title}
Description: ${form.description || 'N/A'}

Cost: ₹${form.cost || '0'}
Status: ${form.status}

Doctor's Notes:
${form.notes || 'None'}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice_${patient?.name || 'patient'}_${appointmentDate.toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      ...form,
      files: uploadedFiles
    };
    onSave(formData);
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

        {/* File Upload Section - Admin Only */}
        {isAdmin && (
          <>
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Attach Files (X-rays, Reports, etc.)
              </label>
              <div className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
                isDarkMode 
                  ? 'border-slate-600 hover:border-slate-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <div className="text-center">
                  <Upload className={`mx-auto w-8 h-8 mb-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                  <label className={`cursor-pointer text-sm ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    <span className="text-amber-500 hover:text-amber-600">Click to upload</span> or drag and drop
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className={`text-xs mt-1 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    PDF, JPG, PNG, DOC up to 10MB each
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Uploaded Files ({uploadedFiles.length})
                </label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                      isDarkMode 
                        ? 'border-slate-600 bg-slate-700' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <FileText className={`w-5 h-5 ${
                          isDarkMode ? 'text-slate-400' : 'text-gray-500'
                        }`} />
                        <div>
                          <p className={`text-sm font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{file.name}</p>
                          <p className={`text-xs ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-500'
                          }`}>
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className={`p-1 rounded-full hover:bg-red-100 transition-colors ${
                          isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-between items-center pt-6">
          <div className="flex space-x-3">
            {/* Invoice Generation - Admin Only */}
            {isAdmin && form.patientId && form.title && (
              <button
                type="button"
                onClick={generateInvoice}
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
                  isDarkMode 
                    ? 'bg-slate-600 text-slate-200 hover:bg-slate-500' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Generate Invoice</span>
              </button>
            )}
          </div>
          
          <div className="flex space-x-4">
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
        </div>
      </form>
    </div>
  );
}
