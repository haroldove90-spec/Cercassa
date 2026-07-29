import React from 'react';
import { UserRole } from '../types';
import { getCurrentRoleLabel, resetSystemData } from '../lib/storage';
import { Shield, RefreshCw, LogOut, Building2, ShoppingBag, Truck, Smartphone } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onLogout }) => {
  if (!currentRole) return null;

  const handleReset = () => {
    if (window.confirm('¿Desea restablecer todos los datos del demo de Cercassa a su estado inicial?')) {
      resetSystemData();
      window.location.reload();
    }
  };

  const getRoleInfo = () => {
    switch (currentRole) {
      case 'admin':
        return { label: 'Dirección General', icon: Building2 };
      case 'sales':
        return { label: 'Ventas & CRM', icon: ShoppingBag };
      case 'warehouse':
        return { label: 'Almacén & Stock', icon: Truck };
      case 'field':
        return { label: 'Instaladores en Campo', icon: Smartphone };
      default:
        return { label: '', icon: Shield };
    }
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <header className="bg-[#5a5a40] text-white border-b border-[#4a4a34] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#fbfbf9] flex items-center justify-center text-[#5a5a40] font-black shadow-sm shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-mono">CERCASSA</span>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20 tracking-wider">
                  ERP / CRM
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#d8d8ce] hidden xs:block">Mallas y Alambrados</p>
            </div>
          </div>

          {/* Current Role Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#484833] border border-[#3d3d2a] text-xs font-semibold text-[#fbfbf9]">
            <RoleIcon className="w-4 h-4 text-[#d8d8ce]" />
            <span className="hidden sm:inline">{roleInfo.label}</span>
          </div>

          {/* Actions: Reset & Logout */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handleReset}
              title="Restablecer Datos de Demostración"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#484833] text-[#fbfbf9] hover:bg-white/20 transition-colors border border-[#3d3d2a] flex items-center space-x-1.5 text-xs font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>

            <button
              onClick={onLogout}
              title="Cerrar Sesión (Volver al Inicio)"
              className="px-3 py-2 rounded-xl bg-rose-700/80 hover:bg-rose-600 text-white font-semibold transition-colors flex items-center space-x-1.5 text-xs shadow-sm border border-rose-600/50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
