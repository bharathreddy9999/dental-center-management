import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  Heart,
  FileText,
  DollarSign,
  Download,
  CheckCircle,
  AlertCircle,
  Hourglass,
  CalendarClock
} from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Scheduled': return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
    case 'Completed': return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
    case 'Cancelled': return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
    case 'Rescheduled': return 'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800';
    default: return 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Scheduled': return <Calendar className="w-4 h-4" />;
    case 'In Progress': return <Hourglass className="w-4 h-4" />;
    case 'Completed': return <CheckCircle className="w-4 h-4" />;
    case 'Cancelled': return <AlertCircle className="w-4 h-4" />;
    case 'Rescheduled': return <CalendarClock className="w-4 h-4" />;
    default: return <Calendar className="w-4 h-4" />;
  }
};

function FileViewer({ file }) {
  const { isDarkMode } = useTheme();
  
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  return (
    <div className={`border rounded-lg p-3 transition-colors ${
      isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-center justify-between">
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
              {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'File'}
            </p>
          </div>
        </div>
        <button
          onClick={downloadFile}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'hover:bg-slate-600 text-slate-400 hover:text-slate-200' 
              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
          }`}
          title="Download file"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function PatientView({ patientId }) {
  const { patients, incidents } = useAppData();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  // Determine the actual patient ID to use
  const actualPatientId = useMemo(() => {
    // If user is a patient, use their patientId regardless of the prop
    if (user.role === 'Patient') {
      return user.patientId;
    }
    // If user is admin, use the provided patientId
    return patientId;
  }, [user, patientId]);

  // Find the patient data
  const patient = useMemo(() => {
    return patients.find(p => p.id === actualPatientId);
  }, [patients, actualPatientId]);

  // Get patient's appointments
  const patientAppointments = useMemo(() => {
    return incidents
      .filter(incident => incident.patientId === actualPatientId)
      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  }, [incidents, actualPatientId]);

  // Filter appointments based on selected filter
  const filteredAppointments = useMemo(() => {
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return patientAppointments.filter(apt => 
          new Date(apt.appointmentDate) > now && 
          (apt.status === 'Scheduled' || apt.status === 'In Progress')
        );
      case 'completed':
        return patientAppointments.filter(apt => apt.status === 'Completed');
      case 'cancelled':
        return patientAppointments.filter(apt => apt.status === 'Cancelled');
      default:
        return patientAppointments;
    }
  }, [patientAppointments, filter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = patientAppointments.filter(apt => 
      new Date(apt.appointmentDate) > now && 
      (apt.status === 'Scheduled' || apt.status === 'In Progress')
    ).length;
    
    const completed = patientAppointments.filter(apt => apt.status === 'Completed').length;
    const totalCost = patientAppointments
      .filter(apt => apt.status === 'Completed')
      .reduce((sum, apt) => sum + (parseFloat(apt.cost) || 0), 0);

    return { upcoming, completed, totalCost, total: patientAppointments.length };
  }, [patientAppointments]);

  // Verify access - patients can only view their own data
  if (user.role === 'Patient' && user.patientId !== actualPatientId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className={`text-xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Access Denied</h2>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            You can only view your own patient data.
          </p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className={`text-xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Patient Not Found</h2>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            The requested patient data could not be found.
          </p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 shadow-lg ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
              isDarkMode ? 'bg-amber-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              {patient.name.charAt(0)}
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{patient.name}</h1>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Patient Portal</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`text-center p-3 rounded-lg ${
              isDarkMode ? 'bg-slate-700' : 'bg-blue-50'
            }`}>
              <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
              <p className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Upcoming</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${
              isDarkMode ? 'bg-slate-700' : 'bg-green-50'
            }`}>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Completed</p>
            </div>
            <div className={`text-center p-3 rounded-lg ${
              isDarkMode ? 'bg-slate-700' : 'bg-amber-50'
            }`}>
              <p className="text-2xl font-bold text-amber-600">₹{stats.totalCost.toLocaleString()}</p>
              <p className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Total Paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Information */}
      <div className={`rounded-2xl p-6 shadow-lg ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <h2 className={`text-lg font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <User className={`w-5 h-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`} />
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Age</p>
              <p className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{getAge(patient.dob)} years</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Heart className={`w-5 h-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`} />
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Gender</p>
              <p className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{patient.gender}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className={`w-5 h-5 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`} />
            <div>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Phone</p>
              <p className={`font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{patient.contact}</p>
            </div>
          </div>

          {patient.email && (
            <div className="flex items-center space-x-3">
              <Mail className={`w-5 h-5 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`} />
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>Email</p>
                <p className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{patient.email}</p>
              </div>
            </div>
          )}

          {patient.address && (
            <div className="flex items-center space-x-3">
              <MapPin className={`w-5 h-5 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`} />
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>Address</p>
                <p className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{patient.address}</p>
              </div>
            </div>
          )}

          {patient.emergencyContact && (
            <div className="flex items-center space-x-3">
              <Phone className={`w-5 h-5 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`} />
              <div>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-600'
                }`}>Emergency Contact</p>
                <p className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{patient.emergencyContact}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Appointments Section */}
      <div className={`rounded-2xl p-6 shadow-lg ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className={`text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Appointments & Treatment History</h2>
          
          <div className={`flex rounded-lg p-1 ${
            isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
          }`}>
            {[
              { key: 'all', label: 'All' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-amber-500 text-white'
                    : (isDarkMode ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`} />
            <h3 className={`text-lg font-medium mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>No appointments found</h3>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
              {filter === 'all' 
                ? 'You don\'t have any appointments yet.' 
                : `No ${filter} appointments found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              
              return (
                <div key={appointment.id} className={`border rounded-xl p-6 transition-colors ${
                  isDarkMode ? 'border-slate-600 hover:border-slate-500' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-lg font-semibold ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>{appointment.title}</h3>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                          {getStatusIcon(appointment.status)}
                          <span>{appointment.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className={`w-4 h-4 ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm ${
                            isDarkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>
                            {appointmentDate.toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className={`w-4 h-4 ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm ${
                            isDarkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>
                            {appointmentDate.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      {appointment.description && (
                        <p className={`text-sm mb-4 ${
                          isDarkMode ? 'text-slate-300' : 'text-gray-700'
                        }`}>{appointment.description}</p>
                      )}

                      {appointment.treatment && (
                        <div className="flex items-center space-x-2 mb-4">
                          <FileText className={`w-4 h-4 ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            isDarkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>Treatment: {appointment.treatment}</span>
                        </div>
                      )}

                      {appointment.cost && (
                        <div className="flex items-center space-x-2 mb-4">
                          <DollarSign className={`w-4 h-4 ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            isDarkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>Cost: ₹{parseFloat(appointment.cost).toLocaleString()}</span>
                        </div>
                      )}

                      {appointment.notes && (
                        <div className={`mt-4 p-3 rounded-lg ${
                          isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                        }`}>
                          <h4 className={`text-sm font-medium mb-2 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>Doctor's Notes:</h4>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-slate-300' : 'text-gray-700'
                          }`}>{appointment.notes}</p>
                        </div>
                      )}

                      {appointment.files && appointment.files.length > 0 && (
                        <div className="mt-4">
                          <h4 className={`text-sm font-medium mb-3 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>Attachments:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {appointment.files.map((file, index) => (
                              <FileViewer key={index} file={file} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
