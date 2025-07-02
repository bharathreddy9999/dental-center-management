import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Moon, 
  Sun, 
  Search,
  ChevronRight,
  Clock,
  LogOut
} from 'lucide-react';

export default function PatientLayout({ children }) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  // Get current page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/patients/')) return 'My Health Dashboard';
    switch (path) {
      case '/dashboard': return 'My Dashboard';
      case '/appointments': return 'My Appointments';
      case '/calendar': return 'My Calendar';
      default: return 'My Health Dashboard';
    }
  };

  // Get breadcrumb based on route
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('/patients/')) return ['Patient Portal'];
    const segments = path.split('/').filter(Boolean);
    return segments.map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1)
    );
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      {/* Enhanced Professional Header */}
      <header className={`sticky top-0 z-40 border-b transition-all duration-300 backdrop-blur-lg ${
        isDarkMode 
          ? 'bg-slate-800/95 border-slate-700 shadow-xl shadow-slate-900/25' 
          : 'bg-white/95 border-gray-200 shadow-lg shadow-gray-900/5'
      }`}>
        {/* Top bar with notifications and quick info */}
        <div className={`border-b px-6 py-2 text-xs ${
          isDarkMode ? 'border-slate-700 bg-slate-900/50' : 'border-gray-100 bg-gray-50/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                <Clock className="w-3 h-3" />
                <span>Last updated: {currentTime}</span>
              </div>
              <div className={`hidden sm:flex items-center space-x-2 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
            <div className={`flex items-center space-x-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              <span className="hidden sm:inline">Welcome, {user?.name || 'Patient'}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
              }`}>
                Patient Portal
              </span>
            </div>
          </div>
        </div>

        {/* Main header content */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo, breadcrumb and search */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Logo/Brand */}
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-amber-600 to-amber-500' 
                    : 'bg-gradient-to-br from-amber-500 to-amber-400'
                }`}>
                  <span className="text-white text-xl">🦷</span>
                </div>
                <div>
                  <h1 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getPageTitle()}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={isDarkMode ? 'text-amber-400' : 'text-amber-600'}>
                      DentalCare Pro
                    </span>
                    {getBreadcrumb().map((segment, index) => (
                      <React.Fragment key={index}>
                        <ChevronRight className={`w-3 h-3 ${
                          isDarkMode ? 'text-slate-500' : 'text-gray-400'
                        }`} />
                        <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>
                          {segment}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search bar */}
              <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search appointments, treatments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-all duration-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-105 hover:rotate-12 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-600/25' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-lg shadow-amber-500/25'
                }`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 animate-pulse" />
                ) : (
                  <Moon className="w-5 h-5 animate-pulse" />
                )}
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  isDarkMode 
                    ? 'text-slate-400 hover:text-red-400 hover:bg-red-900/20' 
                    : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content with better spacing and structure */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl">
          {/* Content wrapper with animations */}
          <div className="animate-fade-in space-y-6">
            {children}
          </div>
        </div>
      </main>

      {/* Enhanced Professional Footer */}
      <footer className={`border-t mt-auto transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700' 
          : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm space-y-2 sm:space-y-0">
            <div className={`flex flex-col sm:flex-row sm:items-center sm:space-x-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              <div className="flex items-center space-x-2">
                <span>© 2025 DentalCare Pro</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Patient Portal</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <span className={`px-2 py-1 rounded ${
                  isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  Secure & Private
                </span>
              </div>
            </div>
            <div className={`flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              <span>Your health data is protected</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center space-x-1">
                <span>Need help?</span>
                <button className={`underline hover:no-underline ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-600'
                }`}>
                  Contact Support
                </button>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 
