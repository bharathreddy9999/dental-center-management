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
