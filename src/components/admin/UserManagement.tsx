import React, { useState, useEffect } from 'react';
import { getUsers, saveUsers, getAuditLogs, subscribeStorage, addAuditLog } from '../../lib/storage';
import { User, UserRole, AuditLog } from '../../types';
import { Users, UserPlus, Shield, Activity, Lock, Unlock, Phone, Mail } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(getUsers());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(getAuditLogs());
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'sales' as UserRole,
  });

  useEffect(() => {
    const load = () => {
      setUsers(getUsers());
      setAuditLogs(getAuditLogs());
    };
    load();
    return subscribeStorage(load);
  }, []);

  const handleToggleUserStatus = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const nextActive = !u.active;
        addAuditLog(
          nextActive ? 'Alta/Reactivación Usuario' : 'Baja Usuario',
          'Usuarios',
          `Se cambió estatus del usuario ${u.name} a ${nextActive ? 'Activo' : 'Inactivo'}`
        );
        return { ...u, active: nextActive };
      }
      return u;
    });
    setUsers(updated);
    saveUsers(updated);
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        addAuditLog('Cambio de Rol', 'Usuarios', `Se asignó el rol de ${newRole} a ${u.name}`);
        return { ...u, role: newRole };
      }
      return u;
    });
    setUsers(updated);
    saveUsers(updated);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    const userToAdd: User = {
      id: `u-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone || '+52 55 0000 0000',
      role: newUser.role,
      active: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    };

    const updated = [...users, userToAdd];
    setUsers(updated);
    saveUsers(updated);
    addAuditLog('Alta Nuevo Usuario', 'Usuarios', `Se creó el usuario ${userToAdd.name} con rol ${userToAdd.role}`);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', phone: '', role: 'sales' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40] font-mono">
            🔐 Módulo Admin: Seguridad & Control
          </span>
          <h1 className="text-2xl font-bold text-[#2a2a22] mt-1">Gestión de Usuarios, Permisos & Auditoría</h1>
          <p className="text-sm text-[#707060] mt-1">
            Alta, baja y asignación de roles operativos, así como el historial completo de auditoría del sistema Cercassa.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-5 h-5 text-white" />
          <span>Alta de Usuario</span>
        </button>
      </div>

      {/* Roster Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#2a2a22] flex items-center space-x-2">
          <Users className="w-5 h-5 text-[#5a5a40]" />
          <span>Personal & Asignación de Roles</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f5f5f0] text-[#5a5a40] text-xs uppercase font-bold border-b border-[#e6e6df]">
              <tr>
                <th className="py-3 px-4">Usuario / Colaborador</th>
                <th className="py-3 px-4">Contacto</th>
                <th className="py-3 px-4">Rol Asignado</th>
                <th className="py-3 px-4">Estatus</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0eb] font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#fbfbf9]">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-[#e6e6df] shadow-sm" />
                      <div>
                        <span className="font-bold text-[#2a2a22] block">{u.name}</span>
                        <span className="text-xs text-[#707060]">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-[#707060]">
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-[#a1a194]" />
                      <span>{u.phone}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="px-2.5 py-1 text-xs border border-[#e6e6df] rounded-lg font-medium bg-white focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                    >
                      <option value="admin">Administrador / Dirección</option>
                      <option value="sales">Ejecutivo de Ventas</option>
                      <option value="warehouse">Encargado de Almacén</option>
                      <option value="field">Jefe de Cuadrilla (Campo)</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    {u.active ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e2ebe0] text-[#2d4d31]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3d6e43]"></span>
                        <span>Activo</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f5e2e2] text-[#702b2b]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>Inactivo</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        u.active
                          ? 'bg-[#f5f5f0] hover:bg-[#f5e2e2] text-[#707060] hover:text-[#702b2b]'
                          : 'bg-[#e2ebe0] hover:bg-[#d0dfcd] text-[#2d4d31]'
                      }`}
                    >
                      {u.active ? 'Dar de Baja' : 'Reactivar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#2a2a22] flex items-center space-x-2">
          <Activity className="w-5 h-5 text-[#5a5a40]" />
          <span>Auditoría de Acciones Registradas en el Sistema</span>
        </h2>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f5f5f0] text-[#5a5a40] uppercase font-bold border-b border-[#e6e6df] sticky top-0">
              <tr>
                <th className="py-3 px-4">Fecha / Hora</th>
                <th className="py-3 px-4">Módulo</th>
                <th className="py-3 px-4">Acción Realizada</th>
                <th className="py-3 px-4">Ejecutado por</th>
                <th className="py-3 px-4">Detalle Trazable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0eb] font-medium">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#fbfbf9]">
                  <td className="py-2.5 px-4 font-mono text-[#a1a194]">
                    {new Date(log.timestamp).toLocaleString('es-MX')}
                  </td>
                  <td className="py-2.5 px-4 font-bold text-[#5a5a40]">{log.module}</td>
                  <td className="py-2.5 px-4 font-semibold text-[#2a2a22]">{log.action}</td>
                  <td className="py-2.5 px-4 text-[#707060]">{log.userName}</td>
                  <td className="py-2.5 px-4 text-[#707060] truncate max-w-sm">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#2a2a22]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e6e6df] shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-[#2a2a22] border-b border-[#f0f0eb] pb-2">
              Alta de Nuevo Usuario / Colaborador
            </h3>

            <form onSubmit={handleAddUser} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ing. Mateo Rivera"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Correo Electrónico:</label>
                <input
                  type="email"
                  required
                  placeholder="mrivera@cercassa.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Teléfono Móvil / WhatsApp:</label>
                <input
                  type="text"
                  placeholder="+52 55 1122 3344"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Rol Operativo:</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none bg-white"
                >
                  <option value="sales">Ejecutivo de Ventas</option>
                  <option value="warehouse">Encargado de Almacén</option>
                  <option value="field">Jefe de Cuadrilla (Campo)</option>
                  <option value="admin">Administrador General</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-[#f0f0eb]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#707060] hover:bg-[#f5f5f0] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#5a5a40] hover:bg-[#484833] text-white rounded-xl shadow-sm"
                >
                  Registrar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
