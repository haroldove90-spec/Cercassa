import React, { useState, useEffect } from 'react';
import { getDispatchSheets, signDispatchSheet, subscribeStorage } from '../../lib/storage';
import { DispatchSheet } from '../../types';
import { Truck, CheckCircle, FileText, UserCheck, Calendar, MapPin, Printer } from 'lucide-react';

export const MaterialDispatch: React.FC = () => {
  const [sheets, setSheets] = useState<DispatchSheet[]>(getDispatchSheets());
  const [selectedSheet, setSelectedSheet] = useState<DispatchSheet | null>(sheets[0] || null);

  useEffect(() => {
    const load = () => {
      const current = getDispatchSheets();
      setSheets(current);
      if (selectedSheet) {
        setSelectedSheet(current.find((s) => s.id === selectedSheet.id) || current[0] || null);
      } else {
        setSelectedSheet(current[0] || null);
      }
    };
    load();
    return subscribeStorage(load);
  }, []);

  const handleSignDispatch = (sheetId: string) => {
    signDispatchSheet(sheetId);
    setSheets(getDispatchSheets());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40] font-mono">
            🚚 Rol 3: Encargado de Almacén
          </span>
          <h1 className="text-2xl font-bold text-[#2a2a22] mt-1">Hojas de Salida de Material para Obras</h1>
          <p className="text-sm text-[#707060] mt-1">
            Validación del desglose exacto de insumos para la cuadrilla y firma de entrega en bodega.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Dispatch Sheets List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-xs font-bold text-[#707060] uppercase tracking-wider">
            Hojas de Salida Pendientes & Entregadas
          </h2>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {sheets.map((s) => {
              const isSelected = selectedSheet?.id === s.id;
              const isDelivered = s.status === 'entregado';
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSheet(s)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#5a5a40] text-white border-[#4a4a34] shadow-sm ring-2 ring-[#5a5a40]/30'
                      : 'bg-white text-[#2a2a22] border-[#e6e6df] hover:border-[#d8d8ce] shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#d8d8ce]">{s.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isDelivered ? 'bg-[#e2ebe0] text-[#2d4d31]' : 'bg-[#f5ebd7] text-[#704d19]'
                    }`}>
                      {s.status.toUpperCase()}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm mt-2">{s.clientName}</h3>
                  <p className={`text-xs mt-0.5 ${isSelected ? 'text-[#d8d8ce]' : 'text-[#707060]'}`}>{s.address}</p>

                  <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[11px] ${
                    isSelected ? 'border-white/20 text-[#d8d8ce]' : 'border-[#f0f0eb] text-[#707060]'
                  }`}>
                    <span>Cuadrilla: {s.crewLeaderName}</span>
                    <span>{s.scheduledDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Sheet View & Signature Action */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
          {selectedSheet ? (
            <div className="space-y-6">
              {/* Sheet Header */}
              <div className="bg-[#f5f5f0] p-5 rounded-2xl border border-[#e6e6df] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-[#5a5a40]">{selectedSheet.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedSheet.status === 'entregado' ? 'bg-[#e2ebe0] text-[#2d4d31]' : 'bg-[#f5ebd7] text-[#704d19]'
                    }`}>
                      {selectedSheet.status.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#2a2a22] mt-1">{selectedSheet.clientName}</h2>
                  <p className="text-xs text-[#707060]">{selectedSheet.address}</p>
                </div>

                {selectedSheet.status === 'pendiente' && (
                  <button
                    onClick={() => handleSignDispatch(selectedSheet.id)}
                    className="px-5 py-2.5 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Firmar & Despachar de Bodega</span>
                  </button>
                )}
              </div>

              {/* Responsible Info */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#fbfbf9] p-4 rounded-xl border border-[#e6e6df]">
                <div>
                  <span className="text-[#707060] block font-bold uppercase text-[10px]">Cuadrilla / Jefe de Instaladores:</span>
                  <span className="font-bold text-[#2a2a22] text-sm">{selectedSheet.crewLeaderName}</span>
                </div>
                <div>
                  <span className="text-[#707060] block font-bold uppercase text-[10px]">Fecha de Programación:</span>
                  <span className="font-bold text-[#2a2a22] text-sm">{selectedSheet.scheduledDate}</span>
                </div>
              </div>

              {/* Materials Breakdown Table */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#2a2a22] flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#5a5a40]" />
                  <span>Desglose de Insumos Entregados</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f5f5f0] text-[#5a5a40] uppercase font-bold border-b border-[#e6e6df]">
                      <tr>
                        <th className="py-2.5 px-3">Código</th>
                        <th className="py-2.5 px-3">Descripción de Insumo</th>
                        <th className="py-2.5 px-3 text-center">Cantidad Solicitada</th>
                        <th className="py-2.5 px-3">Unidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f0eb] font-medium">
                      {selectedSheet.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-[#fbfbf9]">
                          <td className="py-2.5 px-3 font-mono font-bold text-[#5a5a40] text-[11px]">{item.code}</td>
                          <td className="py-2.5 px-3 text-[#2a2a22]">{item.description}</td>
                          <td className="py-2.5 px-3 text-center font-black text-sm text-[#2a2a22] bg-[#f5f5f0] rounded-md">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-[#707060] uppercase text-[10px]">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Signature Banner */}
              {selectedSheet.status === 'entregado' && (
                <div className="bg-[#e2ebe0] border border-[#c3d4c0] rounded-xl p-4 flex items-center space-x-3 text-[#2d4d31]">
                  <CheckCircle className="w-6 h-6 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold block text-sm">Despacho Validado & Firmado</span>
                    <p className="mt-0.5">
                      Entregado por Encargado de Bodega a {selectedSheet.crewLeaderName}. El inventario real ha sido descontado automáticamente.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-[#707060]">
              <Truck className="w-12 h-12 text-[#a1a194] mb-2" />
              <p className="text-sm font-medium">Seleccione una hoja de salida para ver su detalle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
