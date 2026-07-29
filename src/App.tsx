import React, { useState, useEffect } from 'react';
import { UserRole, Quote, WorkProject } from './types';
import { getCurrentRole, setCurrentRole, subscribeStorage, getWorkProjects } from './lib/storage';

// Navigation & Views
import { HomeScreen } from './components/HomeScreen';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PricingEngineConfig } from './components/admin/PricingEngineConfig';
import { UserManagement } from './components/admin/UserManagement';

// Sales Components
import { CrmModule } from './components/sales/CrmModule';
import { QuoteCalculator } from './components/sales/QuoteCalculator';
import { ProposalTracking } from './components/sales/ProposalTracking';

// Warehouse Components
import { InventoryControl } from './components/warehouse/InventoryControl';
import { MaterialDispatch } from './components/warehouse/MaterialDispatch';
import { SupplierReceipts } from './components/warehouse/SupplierReceipts';

// Field Components
import { FieldAgenda } from './components/field/FieldAgenda';
import { SiteCheckin } from './components/field/SiteCheckin';
import { TechnicalReport } from './components/field/TechnicalReport';
import { ProjectClosure } from './components/field/ProjectClosure';

// Modals
import { ProposalModal } from './components/ProposalModal';
import { ReceiptModal } from './components/ReceiptModal';

export default function App() {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(getCurrentRole());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Active module tab per role
  const [adminTab, setAdminTab] = useState<'dashboard' | 'pricing' | 'users'>('dashboard');
  const [salesTab, setSalesTab] = useState<'calculator' | 'crm' | 'proposals'>('calculator');
  const [warehouseTab, setWarehouseTab] = useState<'stock' | 'dispatch' | 'receipts'>('stock');
  const [fieldTab, setFieldTab] = useState<'agenda' | 'checkin' | 'evidence' | 'closure'>('agenda');

  // Active field project selection
  const [activeWorkProjects, setActiveWorkProjects] = useState<WorkProject[]>(getWorkProjects());
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(activeWorkProjects[0] || null);

  // Modal states
  const [activeProposalQuote, setActiveProposalQuote] = useState<Quote | null>(null);
  const [activeReceiptProject, setActiveReceiptProject] = useState<WorkProject | null>(null);

  useEffect(() => {
    const load = () => {
      setCurrentRoleState(getCurrentRole());
      const projects = getWorkProjects();
      setActiveWorkProjects(projects);
      if (!selectedProject && projects.length > 0) {
        setSelectedProject(projects[0]);
      } else if (selectedProject) {
        setSelectedProject(projects.find((p) => p.id === selectedProject.id) || projects[0] || null);
      }
    };
    load();
    return subscribeStorage(load);
  }, [selectedProject?.id]);

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentRoleState(role);
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setCurrentRoleState(null);
  };

  const handleSelectFieldProject = (p: WorkProject) => {
    setSelectedProject(p);
    setFieldTab('checkin');
  };

  // 1. HOME SCREEN (When no role selected or user logged out)
  if (!currentRole) {
    return <HomeScreen onSelectRole={handleSelectRole} />;
  }

  // Active tab helper based on role
  const getActiveTabForRole = () => {
    switch (currentRole) {
      case 'admin':
        return adminTab;
      case 'sales':
        return salesTab;
      case 'warehouse':
        return warehouseTab;
      case 'field':
        return fieldTab;
      default:
        return '';
    }
  };

  const handleTabChangeForRole = (tab: any) => {
    switch (currentRole) {
      case 'admin':
        setAdminTab(tab);
        break;
      case 'sales':
        setSalesTab(tab);
        break;
      case 'warehouse':
        setWarehouseTab(tab);
        break;
      case 'field':
        setFieldTab(tab);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#434338] font-sans flex flex-col antialiased selection:bg-[#5a5a40] selection:text-white">
      {/* Top Header */}
      <Header currentRole={currentRole} onLogout={handleLogout} />

      {/* Main Layout Area: Collapsible Sidebar + Content */}
      <div className="flex-1 flex w-full relative">
        {/* Collapsible Desktop Sidebar Navigation */}
        <Sidebar
          currentRole={currentRole}
          activeTab={getActiveTabForRole()}
          onTabChange={handleTabChangeForRole}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          hasSelectedProject={!!selectedProject}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8 max-w-7xl mx-auto">
          {/* ROL 1: ADMINISTRADOR */}
          {currentRole === 'admin' && (
            <>
              {adminTab === 'dashboard' && <AdminDashboard />}
              {adminTab === 'pricing' && <PricingEngineConfig />}
              {adminTab === 'users' && <UserManagement />}
            </>
          )}

          {/* ROL 2: VENTAS */}
          {currentRole === 'sales' && (
            <>
              {salesTab === 'crm' && <CrmModule />}
              {salesTab === 'calculator' && (
                <QuoteCalculator onOpenProposalModal={(q) => setActiveProposalQuote(q)} />
              )}
              {salesTab === 'proposals' && (
                <ProposalTracking onOpenProposalModal={(q) => setActiveProposalQuote(q)} />
              )}
            </>
          )}

          {/* ROL 3: ALMACÉN */}
          {currentRole === 'warehouse' && (
            <>
              {warehouseTab === 'stock' && <InventoryControl />}
              {warehouseTab === 'dispatch' && <MaterialDispatch />}
              {warehouseTab === 'receipts' && <SupplierReceipts />}
            </>
          )}

          {/* ROL 4: CAMPO / INSTALADORES */}
          {currentRole === 'field' && (
            <div className="max-w-2xl mx-auto">
              {fieldTab === 'agenda' && (
                <FieldAgenda
                  onSelectProject={handleSelectFieldProject}
                  selectedProjectId={selectedProject?.id}
                />
              )}

              {selectedProject && (
                <>
                  {fieldTab === 'checkin' && (
                    <SiteCheckin
                      project={selectedProject}
                      onUpdateProject={(p) => setSelectedProject(p)}
                    />
                  )}
                  {fieldTab === 'evidence' && (
                    <TechnicalReport
                      project={selectedProject}
                      onUpdateProject={(p) => setSelectedProject(p)}
                    />
                  )}
                  {fieldTab === 'closure' && (
                    <ProjectClosure
                      project={selectedProject}
                      onUpdateProject={(p) => setSelectedProject(p)}
                      onOpenReceiptModal={(p) => setActiveReceiptProject(p)}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* App-like Bottom Navigation for Mobile & Tablet */}
      <BottomNav
        currentRole={currentRole}
        activeTab={getActiveTabForRole()}
        onTabChange={handleTabChangeForRole}
        onLogout={handleLogout}
        hasSelectedProject={!!selectedProject}
      />

      {/* Printable Modals */}
      {activeProposalQuote && (
        <ProposalModal
          quote={activeProposalQuote}
          onClose={() => setActiveProposalQuote(null)}
        />
      )}

      {activeReceiptProject && (
        <ReceiptModal
          project={activeReceiptProject}
          onClose={() => setActiveReceiptProject(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-[#2a2a22] text-[#a1a194] text-xs border-t border-[#3d3d2e] py-6 mt-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#fbfbf9] font-mono tracking-wider">CERCASSA ERP/CRM</span>
            <span>— Sistema Integral de Gestión para Mallas y Alambrados</span>
          </div>
          <p>© 2026 Cercassa Mallas y Cercas Electrificadas. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
