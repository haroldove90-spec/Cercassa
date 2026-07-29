import React from 'react';
import { UserRole } from '../types';
import { 
  BarChart3, 
  Settings, 
  Users, 
  Calculator, 
  Contact, 
  Send, 
  Warehouse, 
  FileCheck, 
  PackagePlus, 
  Calendar, 
  CheckSquare, 
  Camera, 
  PenTool, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Building2, 
  ShoppingBag, 
  Truck, 
  Smartphone 
} from 'lucide-react';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  hasSelectedProject?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  onLogout,
  isCollapsed,
  onToggleCollapse,
  hasSelectedProject = false,
}) => {
  if (!currentRole) return null;

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'admin':
        return { label: 'Dirección General', icon: Building2 };
      case 'sales':
        return { label: 'Ventas & CRM', icon: ShoppingBag };
      case 'warehouse':
        return { label: 'Almacén & Stock', icon: Truck };
      case 'field':
        return { label: 'Instaladores Campo', icon: Smartphone };
      default:
        return { label: '', icon: Shield };
    }
  };

  const getMenuItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard & Analítica', icon: BarChart3 },
          { id: 'pricing', label: 'Motor de Cotización', icon: Settings },
          { id: 'users', label: 'Usuarios & Permisos', icon: Users },
        ];
      case 'sales':
        return [
          { id: 'calculator', label: 'Calculadora (BOM)', icon: Calculator },
          { id: 'crm', label: 'CRM & Prospectos', icon: Contact },
          { id: 'proposals', label: 'Envío & Anticipos', icon: Send },
        ];
      case 'warehouse':
        return [
          { id: 'stock', label: 'Control de Stock', icon: Warehouse },
          { id: 'dispatch', label: 'Hojas de Salida', icon: FileCheck },
          { id: 'receipts', label: 'Recepción Proveedores', icon: PackagePlus },
        ];
      case 'field':
        const fieldItems = [
          { id: 'agenda', label: 'Agenda de Obras', icon: Calendar },
        ];
        if (hasSelectedProject) {
          fieldItems.push(
            { id: 'checkin', label: 'Check-in & Insumos', icon: CheckSquare },
            { id: 'evidence', label: 'Fotos & Incidencias', icon: Camera },
            { id: 'closure', label: 'Cierre & Firma', icon: PenTool }
          );
        }
        return fieldItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#2a2a22] text-[#fbfbf9] border-r border-[#3d3d2e] transition-all duration-300 relative z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#3d3d2e] flex items-center justify-between min-h-[72px]">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-[#5a5a40] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="truncate">
              <span className="font-mono font-bold text-sm tracking-tight text-white block">CERCASSA</span>
              <span className="text-[10px] text-[#a1a194] font-semibold block">ERP / CRM</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-9 h-9 rounded-xl bg-[#5a5a40] text-white flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          className="p-1.5 rounded-lg bg-[#3d3d2e] text-[#a1a194] hover:text-white hover:bg-[#484833] transition-colors shrink-0 ml-auto"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Indicator */}
      <div className="p-3 border-b border-[#3d3d2e] bg-[#22221b]">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#3d3d2e] text-xs font-bold text-[#d8d8ce]">
            <RoleIcon className="w-4 h-4 text-[#a1a194] shrink-0" />
            <span className="truncate">{roleBadge.label}</span>
          </div>
        ) : (
          <div className="flex justify-center p-1 text-[#d8d8ce]" title={roleBadge.label}>
            <RoleIcon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Modules List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#5a5a40] text-white font-bold shadow-sm'
                  : 'text-[#a1a194] hover:bg-[#3d3d2e] hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#a1a194]'}`} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout / Switch Role Action */}
      <div className="p-3 border-t border-[#3d3d2e] bg-[#22221b]">
        <button
          onClick={onLogout}
          title="Cerrar Sesión (Volver al Home)"
          className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-rose-950/40 text-rose-300 border border-rose-900/40 hover:bg-rose-900/60 hover:text-white transition-all ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
