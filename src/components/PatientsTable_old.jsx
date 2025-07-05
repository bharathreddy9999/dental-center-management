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

const getVisitCount = (patientId, incidents) => {
  return incidents.filter(incident => incident.patientId === patientId).length;
};

const getLastVisit = (patientId, incidents) => {
  const patientIncidents = incidents.filter(incident => incident.patientId === patientId);
  if (patientIncidents.length === 0) return null;
  return new Date(Math.max(...patientIncidents.map(i => new Date(i.appointmentDate))));
};

const getUpcomingAppointments = (patientId, incidents) => {
  const now = new Date();
  return incidents.filter(incident => 
    incident.patientId === patientId && 
    new Date(incident.appointmentDate) > now &&
    (incident.status === 'Scheduled' || incident.status === 'In Progress')
  ).length;
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
    setShowActions(null);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient? This will also delete all their appointments.')) {
      deletePatient(patientId);
    }
    setShowActions(null);
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Age', 'Gender', 'Total Visits', 'Last Visit'];
    const csvData = filteredPatients.map(patient => [
      patient.name,
      patient.email || '',
      patient.contact,
      getAge(patient.dob),
      patient.gender,
      getVisitCount(patient.id, incidents),
      getLastVisit(patient.id, incidents)?.toLocaleDateString() || 'Never'
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patients-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section */}
      <div className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:shadow-lg ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-xl ${
                isDarkMode ? 'bg-amber-600' : 'bg-amber-500'
              }`}>
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Patient Management
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  Total: {patients.length} patients • Active: {filteredPatients.length}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                isDarkMode 
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export</span>
            </button>
            
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingPatient(null);
                  setShowForm(true);
                }}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Add Patient</span>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Search Bar */}
          <div className="lg:col-span-5">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search patients by name, phone, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="lg:col-span-3">
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-400'
              }`} />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className={`w-full pl-10 pr-8 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Patients</option>
                <option value="active">Active (Recent Visit)</option>
                <option value="inactive">Inactive (6+ months)</option>
                <option value="new">New (This Month)</option>
                <option value="upcoming">Has Upcoming</option>
              </select>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className={`w-full px-4 py-3 rounded-xl border text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="age-asc">Age (Low-High)</option>
              <option value="age-desc">Age (High-Low)</option>
              <option value="lastVisit-desc">Recent Visit</option>
              <option value="registrationDate-desc">Recently Added</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="lg:col-span-2">
            <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-600 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-600 text-amber-600 dark:text-amber-400 shadow-sm'
                    : 'text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
            isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {patients.length}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Total Patients
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
            isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredPatients.filter(p => {
                    const lastVisit = getLastVisit(p.id, incidents);
                    return lastVisit && (new Date() - lastVisit) / (1000 * 60 * 60 * 24) <= 30;
                  }).length}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Active (30 days)
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
            isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredPatients.filter(p => getUpcomingAppointments(p.id, incidents) > 0).length}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Has Upcoming
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
            isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {filteredPatients.filter(p => {
                    const regDate = new Date(p.registrationDate);
                    const monthAgo = new Date();
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return regDate >= monthAgo;
                  }).length}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  New (30 days)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
            </div>
            <User className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New This Month</p>
              <p className="text-2xl font-bold text-green-600">
                {patients.filter(p => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return new Date(p.createdAt) > monthAgo;
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">With Upcoming</p>
              <p className="text-2xl font-bold text-purple-600">
                {patients.filter(p => getUpcomingAppointments(p.id, incidents) > 0).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Age</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(patients.reduce((sum, p) => sum + getAge(p.dob), 0) / patients.length) || 0}
              </p>
            </div>
            <Heart className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Patient Name
                  {sortBy === 'name' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('age')}
                >
                  Age
                  {sortBy === 'age' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('visits')}
                >
                  Visits
                  {sortBy === 'visits' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastVisit')}
                >
                  Last Visit
                  {sortBy === 'lastVisit' && (
                    <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                {isAdmin && <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.map((patient) => {
                const lastVisit = getLastVisit(patient.id, incidents);
                const visitCount = getVisitCount(patient.id, incidents);
                const upcomingCount = getUpcomingAppointments(patient.id, incidents);
                
                return (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.bloodGroup}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{patient.contact}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{patient.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getAge(patient.dob)} years
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {visitCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lastVisit ? new Date(lastVisit).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      {upcomingCount > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {upcomingCount} upcoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          No upcoming
                        </span>
                      )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-center relative">
                        <button
                          onClick={() => setShowActions(showActions === patient.id ? null : patient.id)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {showActions === patient.id && (
                          <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                            <button
                              onClick={() => handleEditPatient(patient)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeletePatient(patient.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center space-x-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first patient'}
            </p>
          </div>
        )}
      </div>

      {/* Patient Form Modal */}
      {showForm && (
        <PatientForm
          patient={editingPatient}
          onSave={handleSavePatient}
          onCancel={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
        />
      )}
    </div>
  );
}
