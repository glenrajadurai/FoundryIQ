import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SandTestEntryPage } from './pages/sand-tests/SandTestEntryPage';
import { HourlyMonitoringPage } from './pages/sand-tests/HourlyMonitoringPage';
import { ChemicalTestsPage } from './pages/sand-tests/ChemicalTestsPage';
import { SandBatchPage } from './pages/sand-tests/SandBatchPage';
import { SpecificationsPage } from './pages/specifications/SpecificationsPage';
import { SPCAnalyticsPage } from './pages/spc/SPCAnalyticsPage';
import { ProcessCapabilityPage } from './pages/spc/ProcessCapabilityPage';
import { RejectionAnalyticsPage } from './pages/rejections/RejectionAnalyticsPage';
import { DefectParetoPage } from './pages/rejections/DefectParetoPage';
import { CorrelationPage } from './pages/correlations/CorrelationPage';
import { RootCausePage } from './pages/root-cause/RootCausePage';
import { ComplaintsPage } from './pages/complaints/ComplaintsPage';
import { AlertsPage } from './pages/alerts/AlertsPage';
import { ReportsPage } from './pages/reports/ReportsPage';
import { AuditTrailPage } from './pages/audit/AuditTrailPage';
import { UserManagementPage } from './pages/users/UserManagementPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
          {/* Main Industrial Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header />

            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                {/* 1. Dashboard */}
                <Route path="/" element={<DashboardPage />} />

                {/* 2. Sand Quality Lab */}
                <Route path="/sand-tests/entry" element={<SandTestEntryPage />} />
                <Route path="/sand-tests/hourly" element={<HourlyMonitoringPage />} />
                <Route path="/sand-tests/chemical" element={<ChemicalTestsPage />} />
                <Route path="/sand-tests/batches" element={<SandBatchPage />} />
                <Route path="/specifications" element={<SpecificationsPage />} />

                {/* 3. Statistical Process Control (SPC) */}
                <Route path="/spc/charts" element={<SPCAnalyticsPage />} />
                <Route path="/spc/capability" element={<ProcessCapabilityPage />} />

                {/* 4. Casting Rejections & Pareto */}
                <Route path="/rejections" element={<RejectionAnalyticsPage />} />
                <Route path="/rejections/pareto" element={<DefectParetoPage />} />
                <Route path="/correlations" element={<CorrelationPage />} />
                <Route path="/root-cause" element={<RootCausePage />} />

                {/* 5. Customer Complaints & 8D CAPA */}
                <Route path="/complaints" element={<ComplaintsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/audit-trail" element={<AuditTrailPage />} />
                <Route path="/users" element={<UserManagementPage />} />

                {/* Catch all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
