import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import PatientForm from './PatientForm';
import { 
  Plus, Search, Filter, Edit2, Trash2, Eye, Phone, Mail, 
  Calendar, User, Heart, MapPin, MoreVertical 
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
  const { patients, incidents, addPatient, updatePatient, deletePatient } = useAppData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterBy, setFilterBy] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showActions, setShowActions] = useState(null);

  // Filter and sort patients
  const filteredAndSortedPatients = useMemo(() => {
    let filtered = patients.filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.contact.includes(searchTerm);
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'recent') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return matchesSearch && new Date(patient.createdAt) > weekAgo;
      }
      if (filterBy === 'upcoming') {
        return matchesSearch && getUpcomingAppointments(patient.id, incidents) > 0;
      }
      return matchesSearch;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'age':
          aVal = getAge(a.dob);
          bVal = getAge(b.dob);
          break;
        case 'visits':
          aVal = getVisitCount(a.id, incidents);
          bVal = getVisitCount(b.id, incidents);
          break;
        case 'lastVisit':
          aVal = getLastVisit(a.id, incidents) || new Date(0);
          bVal = getLastVisit(b.id, incidents) || new Date(0);
          break;
        default:
          aVal = a[sortBy];
          bVal = b[sortBy];
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [patients, incidents, searchTerm, sortBy, sortOrder, filterBy]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

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

  const isAdmin = user?.role === 'Admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Patient Management</h1>
            <p className="text-gray-600">Manage patient information and records</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Patients</option>
              <option value="recent">Recent (7 days)</option>
              <option value="upcoming">With Upcoming Appointments</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Sort by Name</option>
              <option value="age">Sort by Age</option>
              <option value="visits">Sort by Visits</option>
              <option value="lastVisit">Sort by Last Visit</option>
            </select>
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
              {filteredAndSortedPatients.map((patient) => {
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
                              onClick={() => window.location.href = `/patients/${patient.id}`}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
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

        {filteredAndSortedPatients.length === 0 && (
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
