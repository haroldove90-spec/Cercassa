import React from 'react';
import { UserRole } from '../types';
import { getCurrentRole, setCurrentRole, resetSystemData, getCurrentRoleLabel } from '../lib/storage';
import { Shield, RefreshCw, Smartphone, Building2, ShoppingBag, Truck } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange }) => {
  const handleRoleClick = (role: UserRole) => {
    setCurrentRole(role);
    onRoleChange(role);
  };

  const handleReset = () => {
    if (window.confirm('¿Desea restablecer todos los datos del demo de Cercassa a su estado inicial?')) {
      resetSystemData();
      window.location.reload();
    }
  };

  return (
    <header className="bg-[#5a5a40] text-white border-b border-[#4a4a34] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbfbf9] flex items-center justify-center text-[#5a5a40] font-black shadow-sm">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-xl font-bold tracking-tight text-white font-mono">CERCASSA</span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20 tracking-wider">
                  ERP / CRM
                </span>
              </div>
              <p className="text-[11px] text-[#d8d8ce] mt-0.5">Mallas, Alambrados y Cercas Electrificadas</p>
            </div>
          </div>

          {/* Role Switcher Pills */}
          <div className="hidden md:flex items-center bg-[#484833] p-1.5 rounded-2xl border border-[#3d3d2a]">
            <button
              id="role-btn-admin"
              onClick={() => handleRoleClick('admin')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-[#fbfbf9] text-[#2a2a22] shadow-sm font-bold'
                  : 'text-[#d8d8ce] hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Dirección General</span>
            </button>

            <button
              id="role-btn-sales"
              onClick={() => handleRoleClick('sales')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentRole === 'sales'
                  ? 'bg-[#fbfbf9] text-[#2a2a22] shadow-sm font-bold'
                  : 'text-[#d8d8ce] hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Ventas & CRM</span>
            </button>

            <button
              id="role-btn-warehouse"
              onClick={() => handleRoleClick('warehouse')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentRole === 'warehouse'
                  ? 'bg-[#fbfbf9] text-[#2a2a22] shadow-sm font-bold'
                  : 'text-[#d8d8ce] hover:text-white hover:bg-white/10'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Almacén & Stock</span>
            </button>

            <button
              id="role-btn-field"
              onClick={() => handleRoleClick('field')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                currentRole === 'field'
                  ? 'bg-[#fbfbf9] text-[#2a2a22] shadow-sm font-bold'
                  : 'text-[#d8d8ce] hover:text-white hover:bg-white/10'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Instaladores (Móvil)</span>
            </button>
          </div>

          {/* Right Action & Active User Info */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:block text-right text-xs">
              <span className="text-[#d8d8ce] block text-[10px]">Usuario Activo:</span>
              <span className="font-semibold text-white">{getCurrentRoleLabel()}</span>
            </div>

            <button
              id="reset-demo-data-btn"
              onClick={handleReset}
              title="Restablecer Datos de Demostración"
              className="p-2.5 rounded-xl bg-[#484833] text-[#fbfbf9] hover:bg-white/20 transition-colors border border-[#3d3d2a] flex items-center space-x-1.5 text-xs font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher */}
        <div className="md:hidden py-2.5 border-t border-[#4a4a34] flex items-center justify-between overflow-x-auto space-x-1.5">
          <button
            onClick={() => handleRoleClick('admin')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap ${
              currentRole === 'admin' ? 'bg-[#fbfbf9] text-[#2a2a22] font-bold' : 'text-[#d8d8ce] bg-[#484833]'
            }`}
          >
            Dirección
          </button>
          <button
            onClick={() => handleRoleClick('sales')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap ${
              currentRole === 'sales' ? 'bg-[#fbfbf9] text-[#2a2a22] font-bold' : 'text-[#d8d8ce] bg-[#484833]'
            }`}
          >
            Ventas
          </button>
          <button
            onClick={() => handleRoleClick('warehouse')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap ${
              currentRole === 'warehouse' ? 'bg-[#fbfbf9] text-[#2a2a22] font-bold' : 'text-[#d8d8ce] bg-[#484833]'
            }`}
          >
            Almacén
          </button>
          <button
            onClick={() => handleRoleClick('field')}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium whitespace-nowrap ${
              currentRole === 'field' ? 'bg-[#fbfbf9] text-[#2a2a22] font-bold' : 'text-[#d8d8ce] bg-[#484833]'
            }`}
          >
            Campo
          </button>
        </div>
      </div>
    </header>
  );
};
