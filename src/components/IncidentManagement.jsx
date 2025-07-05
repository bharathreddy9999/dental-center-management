import React, { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/ThemeContext';
import IncidentForm from './IncidentForm';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus,
  Search,
  Edit3
} from 'lucide-react';

export default function IncidentManagement({ patientId }) {
  const { patients, incidents, addIncident, updateIncident } = useAppData();
  const { isDarkMode } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingIncident, setEditingIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter incidents for specific patient if patientId is provided
  const filteredIncidents = incidents.filter(incident => {
    if (patientId && incident.patientId !== patientId) return false;
    if (searchTerm && !incident.treatment.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Sort incidents by date (newest first)
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    return new Date(b.appointmentDate) - new Date(a.appointmentDate);
  });

  // Get patient info if viewing single patient
  const currentPatient = patientId ? patients.find(p => p.id === patientId) : null;

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
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'Cancelled': return <AlertCircle className="w-4 h-4" />;
      case 'In Progress': return <Calendar className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const handleSaveIncident = (incidentData) => {
    if (editingIncident) {
      updateIncident(editingIncident.id, incidentData);
    } else {
      addIncident({ ...incidentData, patientId: patientId || incidentData.patientId });
    }
    setShowForm(false);
    setEditingIncident(null);
  };

  const handleEditIncident = (incident) => {
    setEditingIncident(incident);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 shadow-lg ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {currentPatient ? `${currentPatient.name}'s Appointments` : 'Appointment Management'}
            </h1>
            <p className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              {currentPatient 
                ? `Manage appointments for ${currentPatient.name}`
                : 'Manage all patient appointments and treatments'
              }
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
      </div>
      {/* Appointments List */}
      <div className={`rounded-2xl shadow-lg overflow-hidden ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {sortedIncidents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {!patientId && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Treatment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedIncidents.map((incident) => {
                  const patient = patients.find(p => p.id === incident.patientId);
                  return (
                    <tr key={incident.id} className="hover:bg-gray-50">
                      {!patientId && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {patient?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {patient?.name || 'Unknown Patient'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {patient?.email}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {incident.treatment}
                        </div>
                        {incident.description && (
                          <div className="text-sm text-gray-500 mt-1">
                            {incident.description.substring(0, 50)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(incident.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {incident.time || '10:00 AM'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                          {getStatusIcon(incident.status)}
                          <span className="ml-1">{incident.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{incident.cost || '0.00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleEditIncident(incident)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-slate-600 text-slate-400 hover:text-slate-200' 
                              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                          }`}
                          title="Edit appointment"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {patientId 
                ? "This patient doesn't have any appointments yet."
                : "Get started by creating a new appointment."
              }
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <IncidentForm
              incident={editingIncident}
              patientId={patientId}
              onSave={handleSaveIncident}
              onCancel={() => {
                setShowForm(false);
                setEditingIncident(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
