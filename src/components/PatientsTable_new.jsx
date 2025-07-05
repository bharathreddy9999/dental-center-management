import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PatientForm from './PatientForm';
import { 
  Plus, Search, Edit2, Phone, Mail, User
} from 'lucide-react';

// Utility functions
const getAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default function PatientsTable() {
  const { patients, addPatient, updatePatient } = useAppData();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Simple search filter
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contact.includes(searchTerm)
    );
  }, [patients, searchTerm]);

  const handleSavePatient = (patientData) => {
    if (editingPatient) {
      updatePatient(editingPatient.id, patientData);
    } else {
      addPatient(patientData);
    }
    setShowForm(false);
    setEditingPatient(null);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPatient(null);
  };

  if (showForm) {
    return (
      <PatientForm
        patient={editingPatient}
        onSave={handleSavePatient}
        onCancel={handleCancelForm}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 shadow-lg ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Patient Management</h1>
            <p className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>Manage patient records and information</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Patient</span>
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
              placeholder="Search patients..."
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

      {/* Patients Table */}
      <div className={`rounded-2xl shadow-lg overflow-hidden ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {filteredPatients.length === 0 ? (
          <div className="text-center py-12">
            <User className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <h3 className={`text-lg font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>No patients found</h3>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first patient.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-500'
                  }`}>Patient</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-500'
                  }`}>Contact</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-500'
                  }`}>Age</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-500'
                  }`}>Gender</th>
                  <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-500'
                  }`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDarkMode ? 'divide-slate-700' : 'divide-gray-200'
              }`}>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className={`hover:${
                    isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                  } transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                          isDarkMode ? 'bg-amber-600 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {patient.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{patient.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className={`text-xs ${
                            isDarkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>{patient.contact}</span>
                        </div>
                        {patient.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className={`text-xs ${
                              isDarkMode ? 'text-slate-300' : 'text-gray-700'
                            }`}>{patient.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>{getAge(patient.dob)} years</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>{patient.gender}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-slate-600 text-slate-400 hover:text-slate-200' 
                            : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                        }`}
                        title="Edit patient"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
