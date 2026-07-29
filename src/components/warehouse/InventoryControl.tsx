import React, { useState, useEffect } from 'react';
import { getInventory, subscribeStorage } from '../../lib/storage';
import { InventoryItem, InventoryCategory } from '../../types';
import { Package, AlertTriangle, Lock, CheckCircle2, Search, Warehouse } from 'lucide-react';

export const InventoryControl: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(getInventory());
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todas');

  useEffect(() => {
    const load = () => {
      setInventory(getInventory());
    };
    load();
    return subscribeStorage(load);
  }, []);

  const filteredItems = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'todas' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const lowStockCount = inventory.filter((i) => i.available <= i.minThreshold).length;
  const totalReservedCount = inventory.reduce((acc, i) => acc + i.reserved, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40] font-mono">
            🪵 Rol 3: Encargado de Almacén
          </span>
          <h1 className="text-2xl font-bold text-[#2a2a22] mt-1">Control de Stock e Inventario Físico</h1>
          <p className="text-sm text-[#707060] mt-1">
            Gestión por unidades de medida (rollos, tramos, kg), reservas automáticas por obras aprobadas y alertas de mínimos.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-2 bg-[#f5e2e2] border border-[#e6c3c3] text-[#702b2b] rounded-xl text-xs font-bold flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-700" />
            <span>{lowStockCount} Insumos Bajo Mínimo</span>
          </div>

          <div className="px-3.5 py-2 bg-[#f5f5f0] border border-[#e6e6df] text-[#2a2a22] rounded-xl text-xs font-bold flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#5a5a40]" />
            <span>{totalReservedCount} Reservados para Obras</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e6e6df] shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#a1a194]" />
          <input
            type="text"
            placeholder="Buscar por código, poste, tubo, malla..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#e6e6df] rounded-xl text-xs focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {['todas', 'mallas', 'tubos', 'alambres', 'accesorios', 'cemento', 'electrificacion'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-[#5a5a40] text-white font-bold'
                  : 'bg-[#f5f5f0] text-[#707060] hover:bg-[#eaeaE0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#2a2a22] flex items-center space-x-2">
          <Warehouse className="w-5 h-5 text-[#5a5a40]" />
          <span>Existencias en Bodega Principal Cercassa</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f5f5f0] text-[#5a5a40] text-xs uppercase font-bold border-b border-[#e6e6df]">
              <tr>
                <th className="py-3 px-4">Código / Ubicación</th>
                <th className="py-3 px-4">Descripción del Insumo</th>
                <th className="py-3 px-4">Unidad</th>
                <th className="py-3 px-4 text-center">Stock Real</th>
                <th className="py-3 px-4 text-center">Reservado (Obras)</th>
                <th className="py-3 px-4 text-center">Disponible</th>
                <th className="py-3 px-4 text-center">Mínimo</th>
                <th className="py-3 px-4">Proveedor Habitual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0eb] font-medium">
              {filteredItems.map((item) => {
                const isLow = item.available <= item.minThreshold;
                return (
                  <tr key={item.id} className={`hover:bg-[#fbfbf9] ${isLow ? 'bg-[#f5e2e2]/20' : ''}`}>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#2a2a22] text-xs block">{item.code}</span>
                      <span className="text-[10px] text-[#a1a194]">{item.location}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#2a2a22] block">{item.name}</span>
                      <span className="text-[11px] text-[#5a5a40] font-mono capitalize">{item.category}</span>
                    </td>

                    <td className="py-3.5 px-4 text-xs uppercase font-bold text-[#707060]">{item.unit}</td>

                    <td className="py-3.5 px-4 text-center font-bold text-[#2a2a22] text-base">{item.stock}</td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f5f5f0] text-[#2a2a22]">
                        <Lock className="w-3 h-3 text-[#5a5a40]" />
                        <span>{item.reserved}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-sm font-black ${
                        isLow ? 'bg-[#f5e2e2] text-[#702b2b] animate-pulse' : 'bg-[#e2ebe0] text-[#2d4d31]'
                      }`}>
                        <span>{item.available}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center text-xs font-semibold text-[#707060]">{item.minThreshold}</td>

                    <td className="py-3.5 px-4 text-xs text-[#707060]">{item.supplier}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
