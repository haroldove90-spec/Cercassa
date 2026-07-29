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
  LogOut 
} from 'lucide-react';

interface BottomNavProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (tab: any) => void;
  onLogout: () => void;
  hasSelectedProject?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  activeTab,
  onTabChange,
  onLogout,
  hasSelectedProject = false,
}) => {
  if (!currentRole) return null;

  const getMenuItems = () => {
    switch (currentRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'pricing', label: 'Precios', icon: Settings },
          { id: 'users', label: 'Usuarios', icon: Users },
        ];
      case 'sales':
        return [
          { id: 'calculator', label: 'Cotizador', icon: Calculator },
          { id: 'crm', label: 'CRM', icon: Contact },
          { id: 'proposals', label: 'Anticipos', icon: Send },
        ];
      case 'warehouse':
        return [
          { id: 'stock', label: 'Stock', icon: Warehouse },
          { id: 'dispatch', label: 'Salidas', icon: FileCheck },
          { id: 'receipts', label: 'Recepciones', icon: PackagePlus },
        ];
      case 'field':
        const fieldItems = [
          { id: 'agenda', label: 'Agenda', icon: Calendar },
        ];
        if (hasSelectedProject) {
          fieldItems.push(
            { id: 'checkin', label: 'Check-in', icon: CheckSquare },
            { id: 'evidence', label: 'Fotos', icon: Camera },
            { id: 'closure', label: 'Cierre', icon: PenTool }
          );
        }
        return fieldItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#2a2a22] text-[#a1a194] border-t border-[#3d3d2e] px-2 py-1.5 shadow-lg flex items-center justify-around">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-all min-w-[56px] ${
              isActive ? 'text-white bg-[#5a5a40] font-bold' : 'hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-white' : 'text-[#a1a194]'}`} />
            <span className="truncate max-w-[64px]">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onLogout}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold text-rose-400 hover:text-rose-300 transition-all min-w-[50px]"
      >
        <LogOut className="w-5 h-5 mb-0.5 text-rose-400" />
        <span className="truncate">Salir</span>
      </button>
    </nav>
  );
};
