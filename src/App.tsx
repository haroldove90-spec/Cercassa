import React, { useState, useEffect } from 'react';
import { UserRole, Quote, WorkProject } from './types';
import { getCurrentRole, subscribeStorage, getWorkProjects } from './lib/storage';
import { Header } from './components/Header';

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

import { 
  Building2, 
  ShoppingBag, 
  Truck, 
  Smartphone, 
  BarChart3, 
  Settings, 
  Users, 
  Contact, 
  Calculator, 
  Send, 
  Warehouse, 
  FileCheck, 
  PackagePlus,
  Calendar,
  CheckSquare,
  Camera,
  PenTool
} from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRoleState] = useState<UserRole>(getCurrentRole());

  // Sub-tab navigation per role
  const [adminTab, setAdminTab] = useState<'dashboard' | 'pricing' | 'users'>('dashboard');
  const [salesTab, setSalesTab] = useState<'crm' | 'calculator' | 'proposals'>('calculator');
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

  const handleSelectFieldProject = (p: WorkProject) => {
    setSelectedProject(p);
    setFieldTab('checkin');
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#434338] font-sans flex flex-col antialiased selection:bg-[#5a5a40] selection:text-white">
      {/* App Header */}
      <Header currentRole={currentRole} onRoleChange={(role) => setCurrentRoleState(role)} />

      {/* Role Navigation Sub-Bar */}
      <div className="bg-[#f5f5f0] border-b border-[#e6e6df] sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Admin Role Tabs */}
          {currentRole === 'admin' && (
            <div className="flex space-x-2 py-3 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setAdminTab('dashboard')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  adminTab === 'dashboard'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard & Analítica</span>
              </button>

              <button
                onClick={() => setAdminTab('pricing')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  adminTab === 'pricing'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Motor de Cotización (Precios)</span>
              </button>

              <button
                onClick={() => setAdminTab('users')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  adminTab === 'users'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Usuarios & Permisos</span>
              </button>
            </div>
          )}

          {/* Sales Role Tabs */}
          {currentRole === 'sales' && (
            <div className="flex space-x-2 py-3 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setSalesTab('calculator')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  salesTab === 'calculator'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <Calculator className="w-4 h-4" />
                <span>Calculadora Paramétrica (BOM)</span>
              </button>

              <button
                onClick={() => setSalesTab('crm')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  salesTab === 'crm'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <Contact className="w-4 h-4" />
                <span>CRM & Prospectos</span>
              </button>

              <button
                onClick={() => setSalesTab('proposals')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  salesTab === 'proposals'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Envío, Vigencia & Anticipos</span>
              </button>
            </div>
          )}

          {/* Warehouse Role Tabs */}
          {currentRole === 'warehouse' && (
            <div className="flex space-x-2 py-3 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setWarehouseTab('stock')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  warehouseTab === 'stock'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <Warehouse className="w-4 h-4" />
                <span>Control de Stock e Inventario</span>
              </button>

              <button
                onClick={() => setWarehouseTab('dispatch')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  warehouseTab === 'dispatch'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>Hojas de Salida (Obras)</span>
              </button>

              <button
                onClick={() => setWarehouseTab('receipts')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  warehouseTab === 'receipts'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <PackagePlus className="w-4 h-4" />
                <span>Recepción Proveedores</span>
              </button>
            </div>
          )}

          {/* Field Role Tabs */}
          {currentRole === 'field' && (
            <div className="flex space-x-2 py-3 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setFieldTab('agenda')}
                className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                  fieldTab === 'agenda'
                    ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                    : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Agenda de Obras</span>
              </button>

              {selectedProject && (
                <>
                  <button
                    onClick={() => setFieldTab('checkin')}
                    className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                      fieldTab === 'checkin'
                        ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                        : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Check-in & Insumos</span>
                  </button>

                  <button
                    onClick={() => setFieldTab('evidence')}
                    className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                      fieldTab === 'evidence'
                        ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                        : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>Fotos & Incidencias</span>
                  </button>

                  <button
                    onClick={() => setFieldTab('closure')}
                    className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all ${
                      fieldTab === 'closure'
                        ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                        : 'text-[#707060] hover:bg-[#eaeaE0] hover:text-[#2a2a22]'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Cierre & Firma Digital</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <footer className="bg-[#2a2a22] text-[#a1a194] text-xs border-t border-[#3d3d2e] py-6 mt-auto">
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
