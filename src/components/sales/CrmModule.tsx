import React, { useState, useEffect } from 'react';
import { getClients, addClient, saveClients, subscribeStorage } from '../../lib/storage';
import { Client, PropertyType, ClientStatus } from '../../types';
import { Contact, Plus, MessageSquare, Phone, Building, Send, Filter, Clock } from 'lucide-react';

export const CrmModule: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(getClients());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [newNoteText, setNewNoteText] = useState('');

  const [newClient, setNewClient] = useState({
    name: '',
    whatsapp: '',
    email: '',
    address: '',
    propertyType: 'residencial' as PropertyType,
    status: 'prospecto' as ClientStatus,
  });

  useEffect(() => {
    const load = () => {
      setClients(getClients());
    };
    load();
    return subscribeStorage(load);
  }, []);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.whatsapp) return;

    const created = addClient(newClient);
    setClients(getClients());
    setShowAddModal(false);
    setSelectedClient(created);
    setNewClient({
      name: '',
      whatsapp: '',
      email: '',
      address: '',
      propertyType: 'residencial',
      status: 'prospecto',
    });
  };

  const handleAddNote = (clientId: string) => {
    if (!newNoteText.trim()) return;

    const updated = clients.map((c) => {
      if (c.id === clientId) {
        const newNotes = [
          {
            id: `note-${Date.now()}`,
            text: newNoteText.trim(),
            createdAt: new Date().toISOString(),
            authorName: 'Lic. Sofía Ramírez',
          },
          ...c.notes,
        ];
        return { ...c, notes: newNotes };
      }
      return c;
    });

    saveClients(updated);
    setClients(updated);
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(updated.find((c) => c.id === clientId) || null);
    }
    setNewNoteText('');
  };

  const handleStatusChange = (clientId: string, newStatus: ClientStatus) => {
    const updated = clients.map((c) => {
      if (c.id === clientId) {
        return { ...c, status: newStatus };
      }
      return c;
    });
    saveClients(updated);
    setClients(updated);
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(updated.find((c) => c.id === clientId) || null);
    }
  };

  const filteredClients = clients.filter((c) => {
    if (filterStatus === 'todos') return true;
    return c.status === filterStatus;
  });

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case 'prospecto':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f0f0eb] text-[#707060] border border-[#e6e6df]">Prospecto</span>;
      case 'cotizado':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e5ebf2] text-[#2b4c6f] border border-[#c3d1e0]">Cotizado</span>;
      case 'en_negociacion':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f5ebd7] text-[#704d19] border border-[#e6d3b3]">En Negociación</span>;
      case 'cerrado':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e2ebe0] text-[#2d4d31] border border-[#c3d4c0]">Cerrado / Ganado</span>;
      case 'perdido':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fbeae8] text-[#8c2d2d] border border-[#f5c6c6]">Perdido</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f0f0eb] text-[#707060]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40] font-mono">
            👥 Rol 2: Ventas & Atención Comercial
          </span>
          <h1 className="text-2xl font-bold text-[#2a2a22] mt-1">CRM & Gestión de Prospectos</h1>
          <p className="text-sm text-[#707060] mt-1">
            Registro de clientes, seguimiento a llamadas, tipo de inmueble y canalización inmediata a WhatsApp.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Registrar Nuevo Cliente</span>
        </button>
      </div>

      {/* Main CRM Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Clients */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#f0f0eb] pb-3">
            <h2 className="text-sm font-bold text-[#2a2a22] flex items-center space-x-2">
              <Contact className="w-4 h-4 text-[#5a5a40]" />
              <span>Directorio de Clientes ({filteredClients.length})</span>
            </h2>

            {/* Filter Dropdown */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-medium border border-[#e6e6df] rounded-lg px-2.5 py-1.5 bg-[#fbfbf9] focus:outline-none"
            >
              <option value="todos">Todos los estatus</option>
              <option value="prospecto">Prospectos</option>
              <option value="cotizado">Cotizados</option>
              <option value="anticipo_pagado">Anticipo Registrado</option>
              <option value="obra_en_proceso">Obra en Proceso</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#f5f5f0] border-[#5a5a40] shadow-sm'
                      : 'bg-[#fbfbf9] border-[#f0f0eb] hover:border-[#d8d8ce]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-[#2a2a22] text-sm">{client.name}</h3>
                      <span className="text-xs text-[#707060] block">{client.address}</span>
                    </div>
                    {getStatusBadge(client.status)}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-[#707060] border-t border-[#e6e6df]/60 pt-2">
                    <span className="capitalize font-medium">Inmueble: {client.propertyType}</span>
                    <a
                      href={`https://wa.me/${client.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#2d4d31] font-bold flex items-center space-x-1 hover:underline"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{client.whatsapp}</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
          {selectedClient ? (
            <div className="space-y-6">
              {/* Client Header Info */}
              <div className="bg-[#f5f5f0] p-5 rounded-2xl border border-[#e6e6df] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-[#2a2a22]">{selectedClient.name}</h2>
                    {getStatusBadge(selectedClient.status)}
                  </div>
                  <p className="text-xs text-[#707060] mt-1">{selectedClient.address}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`https://wa.me/${selectedClient.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              {/* Status Update Selector */}
              <div className="bg-[#fbfbf9] p-4 rounded-xl border border-[#e6e6df] flex items-center justify-between">
                <span className="text-xs font-bold text-[#434338] uppercase">Cambiar Estatus del Pipeline:</span>
                <select
                  value={selectedClient.status}
                  onChange={(e) => handleStatusChange(selectedClient.id, e.target.value as ClientStatus)}
                  className="px-3 py-1.5 border border-[#e6e6df] rounded-lg text-xs font-bold text-[#2a2a22] bg-white focus:outline-none focus:ring-2 focus:ring-[#5a5a40]"
                >
                  <option value="prospecto">Prospecto Inicial</option>
                  <option value="cotizado">Cotización Enviada</option>
                  <option value="anticipo_pagado">Anticipo Recibido</option>
                  <option value="obra_en_proceso">Obra en Ejecución</option>
                  <option value="completado">Proyecto Concluido</option>
                </select>
              </div>

              {/* Interaction Notes */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#2a2a22] flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#5a5a40]" />
                  <span>Bitácora de Notas & Seguimiento Comercial</span>
                </h3>

                {/* Add Note Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escriba una nota de llamada, reunión o requerimiento..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(selectedClient.id)}
                    className="flex-1 px-3.5 py-2 border border-[#e6e6df] rounded-xl text-xs focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddNote(selectedClient.id)}
                    className="px-4 py-2 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl text-xs flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Añadir</span>
                  </button>
                </div>

                {/* Notes List */}
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {selectedClient.notes.map((note) => (
                    <div key={note.id} className="p-3.5 rounded-xl bg-[#f5f5f0] border border-[#e6e6df] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#707060]">
                        <span className="font-bold text-[#5a5a40]">{note.authorName}</span>
                        <span>{new Date(note.createdAt).toLocaleString('es-MX')}</span>
                      </div>
                      <p className="text-[#2a2a22] font-medium">{note.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-[#707060]">
              <Contact className="w-12 h-12 text-[#a1a194] mb-2" />
              <p className="text-sm font-medium">Seleccione un cliente para ver sus detalles y bitácora.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#2a2a22]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e6e6df] shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-[#2a2a22] border-b border-[#f0f0eb] pb-2">
              Registrar Nuevo Cliente / Prospecto
            </h3>

            <form onSubmit={handleAddClient} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Nombre Completo / Razón Social:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Arq. Fernando Gómez"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">WhatsApp / Teléfono:</label>
                <input
                  type="text"
                  required
                  placeholder="+52 55 9988 7766"
                  value={newClient.whatsapp}
                  onChange={(e) => setNewClient({ ...newClient, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Ubicación de la Obra:</label>
                <input
                  type="text"
                  placeholder="Av. Las Palmas #450, Cuernavaca"
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Tipo de Inmueble:</label>
                <select
                  value={newClient.propertyType}
                  onChange={(e) => setNewClient({ ...newClient, propertyType: e.target.value as PropertyType })}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none bg-white"
                >
                  <option value="residencial">Residencial / Casa Habitación</option>
                  <option value="industrial">Industrial / Bodega / Nave</option>
                  <option value="comercial">Comercial / Plaza / Negocio</option>
                  <option value="terreno">Terreno / Rancho / Perímetro Abierto</option>
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
                  Guardar Prospecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
