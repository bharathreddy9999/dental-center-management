import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAppData } from '../context/AppDataContext';
import { 
  LayoutDashboard, 
  Stethoscope, 
  CalendarClock, 
  CalendarDays, 
  LogOut, 
  ChevronRight,
  Shield,
  Activity,
  TrendingUp,
  Users,
  Clock,
  FileText
} from 'lucide-react';

const adminNavItems = [
  { 
    to: '/dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    description: 'Overview & Analytics',
    badge: null,
    category: 'main'
  },
  { 
    to: '/patients', 
    label: 'Patients', 
    icon: Stethoscope, 
    description: 'Patient Records',
    badge: 'Hot',
    category: 'main'
  },
  { 
    to: '/appointments', 
    label: 'Appointments', 
    icon: CalendarClock, 
    description: 'Manage Bookings',
    badge: null,
    category: 'main'
  },
  { 
    to: '/calendar', 
    label: 'Calendar', 
    icon: CalendarDays, 
    description: 'Schedule View',
    badge: null,
    category: 'main'
  },
];

const getPatientNavItems = (patientId) => [
  { 
    to: `/patients/${patientId}`, 
    label: 'My Dashboard', 
    icon: LayoutDashboard, 
    description: 'Personal Overview',
    badge: null,
    category: 'main'
  },
  { 
    to: `/patients/${patientId}#appointments`, 
    label: 'My Appointments', 
    icon: CalendarClock, 
    description: 'View & Track',
    badge: null,
    category: 'main'
  },
  { 
    to: `/patients/${patientId}#history`, 
    label: 'Treatment History', 
    icon: FileText, 
    description: 'Past Treatments',
    badge: null,
    category: 'main'
  },
];

const quickStats = [
  { label: 'Active Patients', value: '156', icon: Users, color: 'text-blue-500' },
  { label: 'Today\'s Appointments', value: '8', icon: Clock, color: 'text-green-500' },
  { label: 'This Month Revenue', value: '₹45K', icon: TrendingUp, color: 'text-purple-500' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const { patients } = useAppData();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Get patient data if user is a patient
  const patientData = user?.role === 'Patient' && user?.patientId 
    ? patients.find(p => p.id === user.patientId) 
    : null;

  // Get the display name
  const displayName = user?.role === 'Admin' 
    ? 'Administrator' 
    : (patientData?.name || 'Patient');

  // Get navigation items based on user role
  const navItems = user?.role === 'Admin' 
    ? adminNavItems 
    : getPatientNavItems(user?.patientId);

  return (
    <aside className={`flex flex-col transition-all duration-300 border-r shadow-2xl ${
      isCollapsed ? 'w-20' : 'w-80'
    } ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-slate-700' 
        : 'bg-gradient-to-br from-white via-gray-50 to-amber-50 border-gray-200'
    }`}>
      
      {/* Logo Section */}
      <div className={`px-6 py-6 border-b transition-colors duration-300 ${
        isDarkMode ? 'border-slate-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold transition-all duration-300 hover:scale-110 ${
              isDarkMode ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-600/25' : 'bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/25'
            }`}>
              🦷
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h1 className={`text-xl font-bold tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>DentalCare</h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>Professional Suite</p>
              </div>
            )}
          </div>
          
          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden lg:flex p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDarkMode 
                ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-700' 
                : 'text-gray-500 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
              isCollapsed ? 'rotate-0' : 'rotate-180'
            }`} />
          </button>
        </div>
      </div>

      {/* Quick Stats (when expanded and user is Admin) */}
      {!isCollapsed && user?.role === 'Admin' && (
        <div className="px-4 py-4 space-y-3 animate-fade-in">
          <div className={`text-xs font-semibold uppercase tracking-wider px-3 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            Quick Overview
          </div>
          {quickStats.map((stat, index) => (
            <div key={stat.label} 
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:scale-[1.02] animate-fade-in ${
                isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-white/50 hover:bg-white shadow-sm'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-3">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>{stat.label}</div>
                </div>
              </div>
              <div className={`text-sm font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {!isCollapsed && (
          <div className={`text-xs font-semibold uppercase tracking-wider mb-4 px-3 ${
            isDarkMode ? 'text-slate-400' : 'text-gray-500'
          }`}>
            Navigation
          </div>
        )}
        
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`group flex items-center justify-between rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02] animate-fade-in ${
                isCollapsed ? 'px-3 py-3' : 'px-3 py-3'
              } ${
                isActive
                  ? (isDarkMode 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-600/25 transform scale-105' 
                      : 'bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/25 transform scale-105')
                  : (isDarkMode 
                      ? 'text-slate-300 hover:bg-slate-700 hover:text-white' 
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700')
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 transition-all duration-200 ${
                  isActive ? 'text-white animate-pulse' : ''
                }`} />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                          isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-red-500 text-white animate-pulse'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-xs ${
                      isActive 
                        ? 'text-white/80' 
                        : (isDarkMode ? 'text-slate-400' : 'text-gray-500')
                    }`}>
                      {item.description}
                    </div>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
                  isActive 
                    ? 'text-white translate-x-1' 
                    : 'text-transparent group-hover:text-current group-hover:translate-x-1'
                }`} />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status (when expanded) */}
      {!isCollapsed && (
        <div className="px-4 py-4 animate-fade-in">
          <div className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className={`text-xs font-medium ${
                isDarkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                {user?.role === 'Admin' ? 'System Operational' : 'Account Active'}
              </div>
            </div>
            <div className={`text-xs mt-1 ${
              isDarkMode ? 'text-slate-400' : 'text-green-600'
            }`}>
              {user?.role === 'Admin' ? 'All services running smoothly' : 'Your account is in good standing'}
            </div>
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <div className={`p-4 border-t transition-colors duration-300 ${
        isDarkMode ? 'border-slate-700' : 'border-gray-200'
      }`}>
        {isCollapsed ? (
          /* Collapsed profile */
          <div className="flex justify-center">
            <button
              onClick={logout}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 hover:scale-110 ${
                isDarkMode ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
              title="Logout"
            >
              {displayName[0].toUpperCase()}
            </button>
          </div>
        ) : (
          /* Expanded profile */
          <div className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in ${
            isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50 hover:bg-white shadow-sm'
          }`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 hover:scale-110 ${
                isDarkMode ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white' : 'bg-gradient-to-r from-amber-500 to-amber-400 text-white'
              }`}>
                {displayName[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {displayName}
                </div>
                <div className={`text-xs truncate ${
                  isDarkMode ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  {user?.email || 'user@entnt.in'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border ${
                isDarkMode 
                  ? 'bg-green-900/20 text-green-400 border-green-800' 
                  : 'bg-green-50 text-green-700 border-green-200'
              }`}>
                <Shield className="w-3 h-3 mr-2" />
                {user?.role || 'Admin'}
              </div>
            </div>

            {/* Activity indicator */}
            <div className={`flex items-center justify-between mb-3 p-2 rounded-lg ${
              isDarkMode ? 'bg-slate-600/50' : 'bg-white/50'
            }`}>
              <div className="flex items-center space-x-2">
                <Activity className={`w-3 h-3 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-xs ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  Active Session
                </span>
              </div>
              <span className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                2h 45m
              </span>
            </div>
            
            <button
              onClick={logout}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-[1.02] ${
                isDarkMode 
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-800 hover:border-red-700' 
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300'
              }`}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
} 