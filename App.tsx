import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Facilities from './pages/Facilities';
import FacilityDetail from './pages/FacilityDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Memberships from './pages/Memberships';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminEventRsvps from './pages/admin/AdminEventRsvps';
import AdminContacts from './pages/admin/AdminContacts';
import AdminLayout from './pages/admin/AdminLayout';
import ScrollToTop from './components/ScrollToTop';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/facilities/:slug" element={<FacilityDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/memberships" element={<Memberships />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="events" element={<AdminEventRsvps />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
