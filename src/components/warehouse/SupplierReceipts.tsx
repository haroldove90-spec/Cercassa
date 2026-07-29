import React, { useState, useEffect } from 'react';
import { getInventory, addInventoryStock, subscribeStorage } from '../../lib/storage';
import { InventoryItem } from '../../types';
import { Truck, Plus, CheckCircle, PackageCheck, FileSpreadsheet } from 'lucide-react';

export const SupplierReceipts: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(getInventory());
  const [selectedItemId, setSelectedItemId] = useState<string>(inventory[0]?.id || '');
  const [addQty, setAddQty] = useState<number>(10);
  const [invoiceNote, setInvoiceNote] = useState<string>('Factura F-4820 - Deacero / Tubos Monterrey');
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const load = () => {
      setInventory(getInventory());
    };
    load();
    return subscribeStorage(load);
  }, []);

  const handleRegisterReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || addQty <= 0) return;

    addInventoryStock(selectedItemId, addQty, invoiceNote);
    setInventory(getInventory());
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const selectedItem = inventory.find((i) => i.id === selectedItemId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40] font-mono">
            📥 Rol 3: Encargado de Almacén
          </span>
          <h1 className="text-2xl font-bold text-[#2a2a22] mt-1">Recepción de Mercancía & Facturas Proveedor</h1>
          <p className="text-sm text-[#707060] mt-1">
            Registro de entradas de remisiones de acero, postes, mallas y cemento para incremento de stock real.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entry Form */}
        <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#2a2a22] flex items-center space-x-2">
            <PackageCheck className="w-5 h-5 text-[#5a5a40]" />
            <span>Registro Directo de Entrada de Material</span>
          </h2>

          <form onSubmit={handleRegisterReceipt} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
                Insumo / Producto Recibido:
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e6e6df] rounded-xl text-sm font-semibold bg-white focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    [{item.code}] {item.name} (Stock Actual: {item.stock} {item.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
                  Cantidad a Ingresar:
                </label>
                <input
                  type="number"
                  min="1"
                  value={addQty}
                  onChange={(e) => setAddQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-base font-bold text-[#2a2a22] focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
                  Unidad de Medida:
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedItem?.unit.toUpperCase() || 'UNIDADES'}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-xs font-bold text-[#707060] bg-[#f5f5f0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
                Folio de Factura / Remisión / Referencia Proveedor:
              </label>
              <input
                type="text"
                required
                value={invoiceNote}
                onChange={(e) => setInvoiceNote(e.target.value)}
                className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-xs text-[#2a2a22] focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-2 text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Ingresar Almacén & Actualizar Disponibilidad</span>
            </button>

            {successMessage && (
              <div className="p-3 bg-[#e2ebe0] border border-[#c3d4c0] text-[#2d4d31] rounded-xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#3d6e43]" />
                <span>¡Stock actualizado exitosamente en el sistema Cercassa!</span>
              </div>
            )}
          </form>
        </div>

        {/* Selected Item Stock Preview */}
        <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#2a2a22]">Ficha Trazable del Producto Seleccionado</h2>

          {selectedItem && (
            <div className="space-y-4">
              <div className="bg-[#f5f5f0] p-5 rounded-2xl border border-[#e6e6df]">
                <span className="font-mono font-bold text-xs text-[#5a5a40]">{selectedItem.code}</span>
                <h3 className="text-lg font-bold text-[#2a2a22] mt-0.5">{selectedItem.name}</h3>
                <span className="text-xs text-[#707060] block mt-1">Proveedor: {selectedItem.supplier}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e6e6df]">
                  <span className="text-[10px] text-[#707060] block font-bold uppercase">Stock Real</span>
                  <span className="text-xl font-bold text-[#2a2a22]">{selectedItem.stock}</span>
                </div>

                <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e6e6df]">
                  <span className="text-[10px] text-[#707060] block font-bold uppercase">Reservado</span>
                  <span className="text-xl font-bold text-[#5a5a40]">{selectedItem.reserved}</span>
                </div>

                <div className="p-3 bg-[#e2ebe0] rounded-xl border border-[#c3d4c0]">
                  <span className="text-[10px] text-[#2d4d31] block font-bold uppercase">Disponible</span>
                  <span className="text-xl font-black text-[#2d4d31]">{selectedItem.available}</span>
                </div>
              </div>

              <div className="text-xs text-[#707060] bg-[#fbfbf9] p-3 rounded-xl border border-[#e6e6df]">
                <span>Ubicación física en Almacén: </span>
                <strong className="text-[#2a2a22]">{selectedItem.location}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
