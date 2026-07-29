import React from 'react';
import { UserRole } from '../types';
import { setCurrentRole } from '../lib/storage';
import { Shield, Building2, ShoppingBag, Truck, Smartphone } from 'lucide-react';

interface HomeScreenProps {
  onSelectRole: (role: UserRole) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectRole }) => {
  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    onSelectRole(role);
  };

  const roles = [
    {
      id: 'admin' as UserRole,
      name: 'Dirección General',
      icon: Building2,
    },
    {
      id: 'sales' as UserRole,
      name: 'Ventas & CRM',
      icon: ShoppingBag,
    },
    {
      id: 'warehouse' as UserRole,
      name: 'Almacén & Stock',
      icon: Truck,
    },
    {
      id: 'field' as UserRole,
      name: 'Instaladores en Campo',
      icon: Smartphone,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbf9] flex flex-col items-center justify-center p-4 sm:p-8 selection:bg-[#5a5a40] selection:text-white">
      <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-10 my-auto py-8">
        {/* Brand Logo & System Name */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-[#5a5a40] text-white flex items-center justify-center shadow-lg border border-[#484833]">
            <Shield className="w-11 h-11 stroke-[2.5]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2a2a22] font-mono tracking-tight">
            CERCASSA ERP / CRM
          </h1>
        </div>

        {/* Separated Role Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-3xl">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="bg-white border-2 border-[#e6e6df] hover:border-[#5a5a40] hover:bg-[#f5f5f0] p-8 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-sm hover:shadow-md transition-all group cursor-pointer active:scale-95"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#f5f5f0] group-hover:bg-[#5a5a40] text-[#5a5a40] group-hover:text-white flex items-center justify-center transition-colors shadow-inner">
                  <IconComponent className="w-8 h-8 stroke-[2]" />
                </div>
                <span className="font-bold text-[#2a2a22] text-base group-hover:text-[#5a5a40]">
                  {role.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
