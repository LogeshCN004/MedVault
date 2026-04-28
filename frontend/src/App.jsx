import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';

// Shared Pages
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Appointments from './pages/Appointments';

// Patient Pages
import PatientDashboard from './pages/PatientDashboard';
import UploadFiles from './pages/patient/UploadFiles';
import MyUploads from './pages/patient/MyUploads';
import AccessManagement from './pages/patient/AccessManagement';
import FamilyManagement from './pages/patient/FamilyManagement';
import InviteHandler from './pages/patient/InviteHandler';

// Doctor Pages
import DoctorDashboard from './pages/DoctorDashboard';
import ViewConnections from './pages/doctor/ViewConnections';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/invite/:publicId" element={<InviteHandler />} />
            
            {/* Patient Routes */}
            <Route path="/patient-dashboard" element={<ProtectedRoute role="patient"><Layout><PatientDashboard /></Layout></ProtectedRoute>} />
            <Route path="/patient/upload" element={<ProtectedRoute role="patient"><Layout><UploadFiles /></Layout></ProtectedRoute>} />
            <Route path="/patient/records" element={<ProtectedRoute role="patient"><Layout><MyUploads /></Layout></ProtectedRoute>} />
            <Route path="/patient/access" element={<ProtectedRoute role="patient"><Layout><AccessManagement /></Layout></ProtectedRoute>} />
            <Route path="/patient/family" element={<ProtectedRoute role="patient"><Layout><FamilyManagement /></Layout></ProtectedRoute>} />
            
            {/* Doctor Routes */}
            <Route path="/doctor-dashboard" element={<ProtectedRoute role="doctor"><Layout><DoctorDashboard /></Layout></ProtectedRoute>} />
            <Route path="/doctor/connections" element={<ProtectedRoute role="doctor"><Layout><ViewConnections /></Layout></ProtectedRoute>} />
            
            {/* Shared Routes */}
            <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><Layout><Appointments /></Layout></ProtectedRoute>} />
            
            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
