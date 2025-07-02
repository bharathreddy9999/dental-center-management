import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import MainLayout from './components/MainLayout';
import PatientLayout from './components/PatientLayout';
import PatientsTable from './components/PatientsTable';
import IncidentManagement from './components/IncidentManagement';
import PatientView from './components/PatientView';
import AppointmentsPage from './components/AppointmentsPage';
import CalendarPage from './components/CalendarPage';
import Dashboard from './components/Dashboard';

function LoginPage() {
  const { login, user } = useAuth();
  const { isDarkMode } = useTheme();
  const { resetData } = useAppData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [welcomeFadeOut, setWelcomeFadeOut] = useState(false);

  // Hide welcome screen after 5 seconds with fade out effect
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setWelcomeFadeOut(true);
    }, 4500); // Start fading 0.5s before hiding

    const hideTimer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      if (res.user.role === 'Admin') navigate('/dashboard');
      else navigate('/patients/' + res.user.patientId);
    } else {
      setError('Invalid email or password');
    }
  };

  if (user) {
    // Already logged in, redirect
    if (user.role === 'Admin') return <Navigate to="/dashboard" />;
    else return <Navigate to={`/patients/${user.patientId}`} />;
  }

  // Welcome screen for ENTNT team
  if (showWelcome) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${
        welcomeFadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      } ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
          : 'bg-gradient-to-br from-amber-50 via-white to-yellow-50'
      }`}>
        <div className="text-center animate-fade-in">
          <div className="text-8xl mb-8 animate-bounce-gentle">🦷</div>
          <h1 className={`text-6xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent animate-gradient`}>
            Welcome ENTNT Team
          </h1>
          <p className={`text-2xl font-medium ${
            isDarkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            Dental Center Management System
          </p>
          <div className={`mt-8 w-64 h-1 mx-auto rounded-full bg-gradient-to-r from-amber-600 to-yellow-600 animate-pulse`}></div>
        </div>
      </div>
    );
  }

  // Main login form - Landscape layout
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800' 
        : 'bg-gradient-to-br from-amber-50 via-white to-yellow-50'
    }`}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className={`rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              
              {/* Left Side - Branding */}
              <div className={`p-12 flex flex-col justify-center relative ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-amber-600 to-yellow-600' 
                  : 'bg-gradient-to-br from-amber-500 to-yellow-500'
              }`}>
                <div className="text-center text-white">
                  <div className="text-8xl mb-8">🦷</div>
                  <h1 className="text-5xl font-bold mb-4">DentalCare</h1>
                  <p className="text-xl opacity-90 mb-8">
                    Professional Dental Management System
                  </p>
                  <div className="space-y-4 text-lg opacity-80">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Patient Management</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Appointment Scheduling</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Treatment History</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Financial Management</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full"></div>
                <div className="absolute top-1/2 left-8 w-4 h-4 bg-white/20 rounded-full"></div>
              </div>

              {/* Right Side - Login Form */}
              <div className="p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full">
                  <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold mb-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>Welcome Back</h2>
                    <p className={`${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}>Sign in to access your account</p>
                  </div>
                  
                  {error && (
                    <div className={`mb-6 p-4 rounded-xl text-sm ${
                      isDarkMode 
                        ? 'bg-red-900/20 border border-red-800 text-red-300' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-slate-200' : 'text-gray-700'
                      }`}>Email Address</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-white focus:ring-amber-500 focus:border-amber-500 placeholder-slate-400' 
                            : 'border-gray-300 bg-white text-gray-900 focus:ring-amber-500 focus:border-amber-500'
                        }`}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${
                        isDarkMode ? 'text-slate-200' : 'text-gray-700'
                      }`}>Password</label>
                      <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-white focus:ring-amber-500 focus:border-amber-500 placeholder-slate-400' 
                            : 'border-gray-300 bg-white text-gray-900 focus:ring-amber-500 focus:border-amber-500'
                        }`}
                        placeholder="Enter your password"
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-semibold hover:from-amber-700 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      Sign In
                    </button>
                    
                    <button 
                      type="button"
                      onClick={resetData}
                      className="w-full py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-200 text-sm"
                    >
                      Reset Data (For Testing)
                    </button>
                  </form>
                  
                  <div className={`mt-8 pt-6 border-t ${
                    isDarkMode ? 'border-slate-700' : 'border-gray-100'
                  }`}>
                    <div className="text-center text-sm">
                      <p className={`mb-3 font-medium ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>Demo Credentials:</p>
                      <div className={`space-y-2 text-xs ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                        <div className={`p-2 rounded-lg ${
                          isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                        }`}>
                          <p><strong>Admin:</strong> admin@entnt.in / admin123</p>
                        </div>
                        <div className={`p-2 rounded-lg ${
                          isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                        }`}>
                          <p><strong>Patient:</strong> john@entnt.in / patient123</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientsPage() {
  return <PatientsTable />;
}
function PatientPage() {
  const { id } = useParams();
  const { user } = useAuth();
  
  // If admin, show incident management with MainLayout, if patient, show patient view with PatientLayout
  if (user.role === 'Admin') {
    return <IncidentManagement patientId={id} />;
  } else {
    return <PatientView patientId={id} />;
  }
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

function PatientRouteWrapper({ children }) {
  const { user } = useAuth();
  
  if (user?.role === 'Admin') {
    return <MainLayout>{children}</MainLayout>;
  } else {
    return <PatientLayout>{children}</PatientLayout>;
  }
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><MainLayout><PatientsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/patients/:id" element={
        <ProtectedRoute>
          <PatientRouteWrapper>
            <PatientPage />
          </PatientRouteWrapper>
        </ProtectedRoute>
      } />
      <Route path="/appointments" element={<ProtectedRoute><MainLayout><AppointmentsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><MainLayout><CalendarPage /></MainLayout></ProtectedRoute>} />
      <Route path="/" element={
        user ? (
          user.role === 'Admin' ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to={`/patients/${user.patientId}`} replace />
          )
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="*" element={
        user ? (
          user.role === 'Admin' ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to={`/patients/${user.patientId}`} replace />
          )
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}

function App() {
  // Get the base path for GitHub Pages deployment
  const basename = process.env.NODE_ENV === 'production' ? '/dental-center-management' : '';
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <Router basename={basename}>
            <AppRoutes />
          </Router>
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
