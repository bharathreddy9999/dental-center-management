import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Users, 
  Calendar, 
  DollarSign,
  CheckCircle
} from 'lucide-react';

export default function Dashboard() {
  const { patients, incidents } = useAppData();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Calculate basic metrics
  const totalPatients = patients.length;
  const totalAppointments = incidents.length;
  const completedAppointments = incidents.filter(i => i.status === 'Completed').length;
  const totalRevenue = incidents
    .filter(i => i.status === 'Completed')
    .reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`rounded-2xl shadow-sm p-6 border transition-colors ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-1 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>{title}</p>
          <p className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return isDarkMode ? 'bg-yellow-900/20 text-yellow-400 border-yellow-800' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed': return isDarkMode ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return isDarkMode ? 'bg-red-900/20 text-red-400 border-red-800' : 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress': return isDarkMode ? 'bg-blue-900/20 text-blue-400 border-blue-800' : 'bg-blue-100 text-blue-800 border-blue-200';
      default: return isDarkMode ? 'bg-gray-900/20 text-gray-400 border-gray-800' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className={`rounded-2xl p-6 shadow-lg ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <h1 className={`text-2xl font-bold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Welcome back, {user?.name || 'Admin'}!
        </h1>
        <p className={`${
          isDarkMode ? 'text-slate-400' : 'text-gray-600'
        }`}>
          Here's your dental practice overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={totalPatients.toLocaleString()}
          icon={Users}
          color="bg-amber-500"
        />
        <StatCard
          title="Total Appointments"
          value={totalAppointments.toLocaleString()}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={completedAppointments.toLocaleString()}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-emerald-500"
        />
      </div>
    </div>
  );
}
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Completed</p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>{completedAppointments}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-4 bg-green-100 dark:bg-green-900/20 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(completedAppointments / totalAppointments) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Pending</p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
              }`}>{pendingAppointments}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(pendingAppointments / totalAppointments) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-gray-600'
              }`}>Cancelled</p>
              <p className={`text-2xl font-bold ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>{cancelledAppointments}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-4 bg-red-100 dark:bg-red-900/20 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(cancelledAppointments / totalAppointments) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in animate-delay-600">
        {/* Revenue Chart - Takes 2 columns */}
        <div className={`xl:col-span-2 rounded-2xl shadow-sm p-6 border transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold animate-slide-in ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Revenue Overview
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Monthly revenue and patient trends
              </p>
            </div>
            {/* Remove non-functional dropdown and button */}
          </div>
          <div className="animate-scale-in animate-delay-200">
            <RevenueChart data={revenueData} />
          </div>
        </div>

        {/* Top Patients - Takes 1 column */}
        <div className={`rounded-2xl shadow-sm p-6 border transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-xl font-bold animate-slide-in ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Recent Patients
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Latest registrations
              </p>
            </div>
            {/* Remove non-functional Eye button */}
          </div>
          <div className="animate-fade-in animate-delay-300">
            <TopPatientsCard 
              patients={patients.slice(0, 5)} 
              medalIcon={false}
            />
          </div>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className={`rounded-2xl shadow-sm border transition-all duration-500 hover:shadow-lg animate-fade-in animate-delay-700 ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
      }`}>
        <div className={`p-6 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-slate-700' : 'border-gray-100'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className={`text-xl font-bold animate-slide-in ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Recent Appointments
              </h3>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Latest appointment activities
              </p>
            </div>
            {/* Remove non-functional Filter and View All buttons */}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isDarkMode ? 'bg-slate-700/50' : 'bg-gray-50'}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-500'
                }`}>
                  Patient
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-500'
                }`}>
                  Treatment
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-500'
                }`}>
                  Date & Time
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-500'
                }`}>
                  Status
                </th>
                <th className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-500'
                }`}>
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-gray-200'
            }`}>
              {recentAppointments.map((appointment, index) => {
                const patient = patients.find(p => p.id === appointment.patientId);
                return (
                  <tr key={appointment.id} className={`transition-all duration-300 hover:scale-[1.01] animate-fade-in group ${
                    isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                  }`} style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center animate-slide-in" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                          isDarkMode ? 'bg-gradient-to-r from-amber-600 to-amber-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
                        }`}>
                          <span className="text-sm font-medium text-white">
                            {patient?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className={`text-sm font-medium transition-colors duration-300 ${
                            isDarkMode ? 'text-slate-200' : 'text-gray-900'
                          }`}>
                            {patient?.name || 'Unknown Patient'}
                          </div>
                          <div className={`text-xs ${
                            isDarkMode ? 'text-slate-400' : 'text-gray-500'
                          }`}>
                            {patient?.phone || 'No phone'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-slate-200' : 'text-gray-900'
                      }`}>{appointment.treatment}</div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        {appointment.notes ? appointment.notes.substring(0, 30) + '...' : 'No notes'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-slate-200' : 'text-gray-900'
                      }`}>
                        {new Date(appointment.date).toLocaleDateString()}
                      </div>
                      <div className={`text-xs ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-500'
                      }`}>
                        {appointment.time || '10:00 AM'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border transition-all duration-300 hover:scale-105 ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold transition-colors duration-300 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-900'
                    }`}>
                      ₹{(appointment.cost || 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in animate-delay-800">
        <div className={`group relative rounded-2xl shadow-sm p-6 border text-center transition-all duration-500 cursor-pointer hover:shadow-xl hover:-translate-y-2 ${
          isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-amber-500' : 'bg-white border-gray-100 hover:border-amber-300'
        }`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:animate-bounce ${
              isDarkMode ? 'bg-gradient-to-r from-amber-600 to-amber-500' : 'bg-gradient-to-r from-amber-500 to-amber-400'
            }`}>
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h4 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white group-hover:text-amber-300' : 'text-gray-900 group-hover:text-amber-600'
            }`}>Add New Patient</h4>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>Register a new patient in the system</p>
          </div>
        </div>
        
        <div className={`group relative rounded-2xl shadow-sm p-6 border text-center transition-all duration-500 cursor-pointer hover:shadow-xl hover:-translate-y-2 ${
          isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-green-500' : 'bg-white border-gray-100 hover:border-green-300'
        }`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:animate-bounce ${
              isDarkMode ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-green-500 to-green-400'
            }`}>
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h4 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white group-hover:text-green-300' : 'text-gray-900 group-hover:text-green-600'
            }`}>Schedule Appointment</h4>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>Book a new appointment quickly</p>
          </div>
        </div>
        
        <div className={`group relative rounded-2xl shadow-sm p-6 border text-center transition-all duration-500 cursor-pointer hover:shadow-xl hover:-translate-y-2 ${
          isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-purple-500' : 'bg-white border-gray-100 hover:border-purple-300'
        }`}>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:animate-bounce ${
              isDarkMode ? 'bg-gradient-to-r from-purple-600 to-purple-500' : 'bg-gradient-to-r from-purple-500 to-purple-400'
            }`}>
              <PieChart className="w-8 h-8 text-white" />
            </div>
            <h4 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white group-hover:text-purple-300' : 'text-gray-900 group-hover:text-purple-600'
            }`}>View Analytics</h4>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>Analyze practice performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
