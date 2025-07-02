import React, { useState, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import IncidentForm from './IncidentForm';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar, Clock, User, 
  Phone, DollarSign, FileText, X
} from 'lucide-react';

// Helper functions for calendar
const getMonthMatrix = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  
  // Fill initial empty days
  const startDay = firstDay.getDay();
  for (let i = 0; i < startDay; i++) {
    const prevDate = new Date(year, month, 1 - (startDay - i));
    week.push(prevDate);
  }
  
  // Fill the days of the month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  
  // Fill remaining empty days
  if (week.length) {
    let nextDay = 1;
    while (week.length < 7) {
      week.push(new Date(year, month + 1, nextDay));
      nextDay++;
    }
    matrix.push(week);
  }
  
  return matrix;
};

const getWeekDates = (date) => {
  const week = [];
  const dayIdx = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - dayIdx);
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(d);
  }
  return week;
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Scheduled': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'Completed': return 'bg-green-100 text-green-800 border border-green-200';
    case 'Cancelled': return 'bg-red-100 text-red-800 border border-red-200';
    case 'Rescheduled': return 'bg-purple-100 text-purple-800 border border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

function AppointmentModal({ date, appointments, onClose, onNewAppointment }) {
  const { patients } = useAppData();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Appointments for {date.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No appointments scheduled for this day</p>
              <button
                onClick={() => onNewAppointment(date)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule Appointment</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">{appointments.length} appointment(s)</p>
                <button
                  onClick={() => onNewAppointment(date)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
              
              {appointments.map((appointment) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                const appointmentTime = new Date(appointment.appointmentDate);
                
                return (
                  <div key={appointment.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{appointment.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4" />
                          <span>{appointmentTime.toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                        {patient && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <User className="w-4 h-4" />
                            <span>{patient.name}</span>
                            <Phone className="w-4 h-4 ml-2" />
                            <span>{patient.contact}</span>
                          </div>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{appointment.description}</p>
                    
                    {appointment.treatment && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <FileText className="w-4 h-4" />
                        <span>{appointment.treatment}</span>
                      </div>
                    )}
                    
                    {appointment.cost > 0 && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>₹{appointment.cost}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const { incidents, patients } = useAppData();
  const { user } = useAuth();
  const [view, setView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState(null);

  const isAdmin = user?.role === 'Admin';

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthMatrix = getMonthMatrix(year, month);
  const weekDates = getWeekDates(currentDate);

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    const dateStr = date.toDateString();
    return incidents.filter(incident => {
      const incidentDate = new Date(incident.appointmentDate);
      return incidentDate.toDateString() === dateStr;
    });
  };

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    const appointments = getAppointmentsForDate(date);
    setSelectedDate({ date, appointments });
  };

  const handleNewAppointment = (date) => {
    if (isAdmin) {
      setNewAppointmentDate(date);
      setSelectedDate(null);
      setShowForm(true);
    }
  };

  const handleSaveAppointment = (appointmentData) => {
    // This would be handled by the IncidentForm component
    setShowForm(false);
    setNewAppointmentDate(null);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    
    const monthAppointments = incidents.filter(incident => {
      const incidentDate = new Date(incident.appointmentDate);
      return incidentDate >= startOfMonth && incidentDate <= endOfMonth;
    });

    const todayAppointments = getAppointmentsForDate(today);
    const upcomingCount = incidents.filter(incident => {
      const incidentDate = new Date(incident.appointmentDate);
      return incidentDate > today && (incident.status === 'Scheduled' || incident.status === 'In Progress');
    }).length;

    return {
      monthTotal: monthAppointments.length,
      todayTotal: todayAppointments.length,
      upcomingTotal: upcomingCount,
      completedThisMonth: monthAppointments.filter(i => i.status === 'Completed').length
    };
  }, [incidents, year, month]);

  const renderMonthView = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Body */}
      <div className="p-6">
        {monthMatrix.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1 mb-1">
            {week.map((date, dayIdx) => {
              const isCurrentMonth = date.getMonth() === month;
              const isToday = date.toDateString() === new Date().toDateString();
              const appointments = getAppointmentsForDate(date);
              const hasAppointments = appointments.length > 0;

              return (
                <div
                  key={dayIdx}
                  className={`min-h-[120px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                  } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {appointments.slice(0, 3).map((appointment, idx) => {
                      const patient = patients.find(p => p.id === appointment.patientId);
                      const time = new Date(appointment.appointmentDate).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      });
                      
                      return (
                        <div
                          key={idx}
                          className={`text-xs px-2 py-1 rounded truncate ${getStatusColor(appointment.status)}`}
                          title={`${time} - ${appointment.title} (${patient?.name})`}
                        >
                          <div className="font-medium">{time}</div>
                          <div className="truncate">{appointment.title}</div>
                        </div>
                      );
                    })}
                    
                    {appointments.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{appointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const renderWeekView = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Week Header */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="grid grid-cols-8 gap-4">
          <div className="text-sm font-semibold text-gray-600">Time</div>
          {weekDates.map((date, idx) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div key={idx} className={`text-center ${isToday ? 'text-blue-600' : ''}`}>
                <div className="text-sm font-semibold">{WEEKDAYS[idx]}</div>
                <div className={`text-lg font-bold ${isToday ? 'bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Week Body */}
      <div className="p-6">
        <div className="grid grid-cols-8 gap-4 min-h-[600px]">
          {/* Time column */}
          <div className="space-y-12">
            {Array.from({ length: 12 }, (_, i) => {
              const hour = i + 8; // Start from 8 AM
              return (
                <div key={i} className="text-xs text-gray-500 h-12 flex items-start">
                  {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                </div>
              );
            })}
          </div>

          {/* Day columns */}
          {weekDates.map((date, dayIdx) => {
            const appointments = getAppointmentsForDate(date);
            return (
              <div
                key={dayIdx}
                className="border-l border-gray-200 pl-2 cursor-pointer hover:bg-gray-50 min-h-full"
                onClick={() => handleDateClick(date)}
              >
                {appointments.map((appointment, idx) => {
                  const appointmentTime = new Date(appointment.appointmentDate);
                  const hour = appointmentTime.getHours();
                  const topPosition = Math.max(0, (hour - 8) * 48); // 48px per hour
                  const patient = patients.find(p => p.id === appointment.patientId);
                  
                  return (
                    <div
                      key={idx}
                      className={`absolute w-[calc(100%-8px)] p-2 rounded text-xs ${getStatusColor(appointment.status)}`}
                      style={{ top: `${topPosition}px`, zIndex: 1 }}
                    >
                      <div className="font-medium">{appointment.title}</div>
                      <div className="truncate">{patient?.name}</div>
                      <div>{appointmentTime.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Calendar</h1>
            <p className="text-gray-600">View and manage appointments</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg p-1 shadow">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'month' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'week' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-blue-600">{stats.todayTotal}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-green-600">{stats.monthTotal}</p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-purple-600">{stats.upcomingTotal}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-orange-600">{stats.completedThisMonth}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={view === 'month' ? prevMonth : prevWeek}
            className="p-2 hover:bg-white rounded-lg transition-colors shadow"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={view === 'month' ? nextMonth : nextWeek}
            className="p-2 hover:bg-white rounded-lg transition-colors shadow"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <h2 className="text-xl font-bold text-gray-800">
          {view === 'month' 
            ? `${MONTHS[month]} ${year}`
            : `Week of ${weekDates[0].toLocaleDateString()}`
          }
        </h2>
        
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar View */}
      {view === 'month' ? renderMonthView() : renderWeekView()}

      {/* Appointment Modal */}
      {selectedDate && (
        <AppointmentModal
          date={selectedDate.date}
          appointments={selectedDate.appointments}
          onClose={() => setSelectedDate(null)}
          onNewAppointment={handleNewAppointment}
        />
      )}

      {/* New Appointment Form */}
      {showForm && (
        <IncidentForm
          incident={null}
          patientId={null}
          onSave={handleSaveAppointment}
          onCancel={() => setShowForm(false)}
          defaultDate={newAppointmentDate}
        />
      )}
    </div>
  );
}
