import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import RevenueChart from './RevenueChart';
import TopPatientsCard from './TopPatientsCard';
import { 
  Users, 
  Calendar, 
  Clock,
  UserPlus,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Dashboard() {
  const { patients, incidents } = useAppData();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  // Calculate dashboard metrics
  const totalPatients = patients.length;
  const totalAppointments = incidents.length;
  const pendingAppointments = incidents.filter(i => i.status === 'Pending').length;
  const completedAppointments = incidents.filter(i => i.status === 'Completed').length;
  const cancelledAppointments = incidents.filter(i => i.status === 'Cancelled').length;
  const totalRevenue = incidents
    .filter(i => i.status === 'Completed')
    .reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);

  // Calculate growth percentages (mock data)
  const patientsGrowth = 12;
  const appointmentsGrowth = 8;
  const revenueGrowth = 15;

  // Recent appointments (last 5)
  const recentAppointments = incidents
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Revenue chart data (mock monthly data with more realistic structure)
  const revenueData = [
    { month: 'Jan', revenue: 25000, patients: 45, appointments: 78 },
    { month: 'Feb', revenue: 32000, patients: 52, appointments: 89 },
    { month: 'Mar', revenue: 28000, patients: 58, appointments: 92 },
    { month: 'Apr', revenue: 35000, patients: 48, appointments: 85 },
    { month: 'May', revenue: 42000, patients: 65, appointments: 105 },
    { month: 'Jun', revenue: Math.max(totalRevenue, 38000), patients: totalPatients, appointments: totalAppointments },
  ];

  const StatCard = ({ title, value, icon: Icon, color, change, trend, description, delay = 0 }) => (
    <div className={`group relative rounded-2xl shadow-sm p-6 border hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in ${
      isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-gray-100 hover:border-gray-200'
    }`} style={{ animationDelay: `${delay}ms` }}>
      {/* Gradient overlay */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
        color.includes('amber') ? 'bg-gradient-to-br from-amber-500/10 to-amber-600/10' :
        color.includes('green') ? 'bg-gradient-to-br from-green-500/10 to-green-600/10' :
        color.includes('orange') ? 'bg-gradient-to-br from-orange-500/10 to-orange-600/10' :
        'bg-gradient-to-br from-blue-500/10 to-blue-600/10'
      }`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className={`text-sm font-medium mb-1 transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>{title}</p>
            <p className={`text-3xl font-bold transition-all duration-500 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{value}</p>
          </div>
          <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          {change && (
            <div className={`flex items-center space-x-1 ${
              trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
            }`}>
              {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : trend === 'down' ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : null}
              <span className="text-sm font-medium">{change}%</span>
            </div>
          )}
          {description && (
            <p className={`text-xs ${
              isDarkMode ? 'text-slate-500' : 'text-gray-400'
            }`}>{description}</p>
          )}
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
    <div className="space-y-8">
      {/* Enhanced Welcome Header */}
      <div className={`relative overflow-hidden rounded-2xl p-8 text-white shadow-2xl animate-fade-in ${
        isDarkMode ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-700' : 'bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600'
      }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
        </div>
        
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 animate-slide-in">
                Welcome back, {user?.name || 'Admin'}! 👋
              </h1>
              <p className="text-amber-100 text-lg animate-fade-in animate-delay-300">
                Here's what's happening at your dental practice today.
              </p>
              <div className="flex items-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-amber-100">All systems operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-amber-100">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-0">
              {/* Remove non-functional buttons */}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={totalPatients.toLocaleString()}
          icon={Users}
          color="bg-gradient-to-r from-amber-500 to-amber-600"
          change={patientsGrowth}
          trend="up"
          description="vs last month"
          delay={100}
        />
        <StatCard
          title="Total Appointments"
          value={totalAppointments.toLocaleString()}
          icon={Calendar}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          change={appointmentsGrowth}
          trend="up"
          description="vs last month"
          delay={200}
        />
        <StatCard
          title="Pending Appointments"
          value={pendingAppointments.toLocaleString()}
          icon={Clock}
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          description="need attention"
          delay={300}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-gradient-to-r from-green-500 to-green-600"
          change={revenueGrowth}
          trend="up"
          description="vs last month"
          delay={400}
        />
      </div>

      {/* Status Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in animate-delay-500">
        <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
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
