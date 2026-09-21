import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminLayout } from './components/AdminLayout';

import { HomePage } from './pages/HomePage';
import { ApplicationPage } from './pages/ApplicationPage';
import { LoginPage } from './pages/LoginPage';
import { MemberDashboard } from './pages/MemberDashboard';
import { CabinetPage } from './pages/CabinetPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';

import { AdminLoginPage } from './pages/AdminLoginPage';
import { VerificationDeskPage } from './pages/VerificationDeskPage';
import { ApprovalDeskPage } from './pages/ApprovalDeskPage';
import { AdminMasterPage } from './pages/AdminMasterPage';
import { CmsManagerPage } from './pages/CmsManagerPage';
import { MemberDirectoryPage } from './pages/MemberDirectoryPage';

export function App() {
  const appMode = import.meta.env.VITE_APP_MODE || 'all'; // 'public' | 'admin' | 'all'

  // ================= 1. ADMIN PORTAL DEPLOYMENT =================
  if (appMode === 'admin') {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/verification"
            element={
              <AdminLayout>
                <VerificationDeskPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/approval"
            element={
              <AdminLayout>
                <ApprovalDeskPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/master"
            element={
              <AdminLayout>
                <AdminMasterPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/regional"
            element={
              <AdminLayout>
                <AdminMasterPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/cms"
            element={
              <AdminLayout>
                <CmsManagerPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/members"
            element={
              <AdminLayout>
                <MemberDirectoryPage />
              </AdminLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    );
  }

  // ================= 2. PUBLIC WEBSITE DEPLOYMENT =================
  if (appMode === 'public') {
    return (
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-[#060b13] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white transition-colors duration-300">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/signup" element={<ApplicationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/member/dashboard" element={<MemberDashboard />} />
              <Route path="/cabinets" element={<CabinetPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    );
  }

  // ================= 3. COMBINED / DEVELOPMENT MODE =================
  return (
    <Router>
      <Routes>
        {/* Standalone Admin Login */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected Admin Executive Desks (wrapped in AdminLayout) */}
        <Route
          path="/admin/verification"
          element={
            <AdminLayout>
              <VerificationDeskPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/approval"
          element={
            <AdminLayout>
              <ApprovalDeskPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/master"
          element={
            <AdminLayout>
              <AdminMasterPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/regional"
          element={
            <AdminLayout>
              <AdminMasterPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/cms"
          element={
            <AdminLayout>
              <CmsManagerPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/members"
          element={
            <AdminLayout>
              <MemberDirectoryPage />
            </AdminLayout>
          }
        />

        {/* Public Website & Member Routes */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-slate-50 dark:bg-[#060b13] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white transition-colors duration-300">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/signup" element={<ApplicationPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/member/dashboard" element={<MemberDashboard />} />
                  <Route path="/cabinets" element={<CabinetPage />} />
                  <Route path="/announcements" element={<AnnouncementsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

