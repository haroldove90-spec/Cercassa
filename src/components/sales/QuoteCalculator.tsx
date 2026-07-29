import React, { useState, useEffect } from 'react';
import { getClients, getPricingConfig, saveQuote, subscribeStorage } from '../../lib/storage';
import { calculateFenceBOM } from '../../lib/calculations';
import { Client, FenceSystemType, Quote, BOMItem } from '../../types';
import { Calculator, FileText, Send, CheckCircle2, Ruler, Shield, DollarSign, Printer, MessageSquare } from 'lucide-react';

interface QuoteCalculatorProps {
  onOpenProposalModal: (quote: Quote) => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ onOpenProposalModal }) => {
  const [clients, setClients] = useState<Client[]>(getClients());
  const [pricingConfig] = useState(getPricingConfig());

  // Input states
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [totalMeters, setTotalMeters] = useState<number>(100);
  const [height, setHeight] = useState<number>(2.0);
  const [selectedSystems, setSelectedSystems] = useState<FenceSystemType[]>(['malla_ciclonica', 'concertina']);
  const [freightZone, setFreightZone] = useState<'Zone A' | 'Zone B' | 'Zone C'>('Zone A');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('Propuesta comercial para delimitación perimetral con garantía de 3 años en galvanizado.');

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const load = () => {
      setClients(getClients());
    };
    load();
    return subscribeStorage(load);
  }, []);

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // Perform instant calculation
  const calcResult = calculateFenceBOM(
    totalMeters,
    height,
    selectedSystems,
    freightZone,
    pricingConfig
  );

  const finalTotal = Math.max(0, calcResult.totalPrice - discountAmount);
  const requiredAdvance = Math.round(finalTotal * 0.5); // 50% anticipo

  const toggleSystem = (sys: FenceSystemType) => {
    if (selectedSystems.includes(sys)) {
      if (selectedSystems.length > 1) {
        setSelectedSystems(selectedSystems.filter((s) => s !== sys));
      }
    } else {
      setSelectedSystems([...selectedSystems, sys]);
    }
  };

  const handleBuildQuoteObject = (): Quote => {
    const quoteId = `COT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const validUntil = new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]; // 15 days validity

    return {
      id: quoteId,
      clientId: selectedClient?.id || 'cli-generic',
      clientName: selectedClient?.name || 'Cliente Mostrador',
      clientWhatsapp: selectedClient?.whatsapp || '525500000000',
      address: selectedClient?.address || 'Obra Local',
      totalMeters,
      height,
      systemTypes: selectedSystems,
      notes,
      bom: calcResult.bom,
      materialCost: calcResult.materialCost,
      laborCost: calcResult.laborCost,
      freightCost: calcResult.freightCost,
      subtotal: calcResult.subtotal,
      discount: discountAmount,
      total: finalTotal,
      advancePaid: 0,
      remainingBalance: finalTotal,
      status: 'enviada',
      validUntil,
      createdAt: new Date().toISOString(),
      freightZone,
    };
  };

  const handleSaveQuote = () => {
    const q = handleBuildQuoteObject();
    saveQuote(q);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleOpenProposal = () => {
    const q = handleBuildQuoteObject();
    saveQuote(q);
    onOpenProposalModal(q);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40] font-mono">
            🧮 Rol 2: Calculadora Paramétrica Cercassa
          </span>
          <h1 className="text-2xl font-bold text-[#2a2a22] mt-1">Cotizador Automático de Cercas & BOM</h1>
          <p className="text-sm text-[#707060] mt-1">
            Generación instantánea del Desglose de Materiales (BOM), mano de obra, flete y propuesta comercial formal.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveQuote}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#f5f5f0] hover:bg-[#eaeaE0] text-[#2a2a22] border border-[#e6e6df] font-bold rounded-xl text-xs shadow-sm transition-colors"
          >
            {savedSuccess ? <CheckCircle2 className="w-4 h-4 text-[#3d6e43]" /> : <FileText className="w-4 h-4 text-[#5a5a40]" />}
            <span>{savedSuccess ? '¡Guardada!' : 'Guardar Cotización'}</span>
          </button>

          <button
            onClick={handleOpenProposal}
            className="flex items-center space-x-1.5 px-5 py-2 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Generar Propuesta PDF / Membrete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configurator Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-5">
          <h2 className="text-base font-bold text-[#2a2a22] border-b border-[#f0f0eb] pb-2 flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-[#5a5a40]" />
            <span>1. Parámetros Clave de la Obra</span>
          </h2>

          {/* Client Selector */}
          <div>
            <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
              Cliente / Prospecto:
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#e6e6df] rounded-xl text-sm font-semibold bg-white focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.address})
                </option>
              ))}
            </select>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
                Metros Lineales (m):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={totalMeters}
                  onChange={(e) => setTotalMeters(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2.5 border border-[#e6e6df] rounded-xl text-base font-bold text-[#2a2a22] focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-[#a1a194]">m</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
                Altura de Cerca:
              </label>
              <select
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2.5 border border-[#e6e6df] rounded-xl text-sm font-bold bg-white focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
              >
                <option value={1.5}>1.50 metros</option>
                <option value={2.0}>2.00 metros (Estándar)</option>
                <option value={2.5}>2.50 metros</option>
                <option value={3.0}>3.00 metros (Alta Seguridad)</option>
              </select>
            </div>
          </div>

          {/* Systems Selection */}
          <div>
            <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-2">
              Sistemas de Protección Incluidos:
            </label>
            <div className="space-y-2">
              {[
                { id: 'malla_ciclonica', label: 'Malla Ciclónica Galvanizada (Calibre 10.5)', icon: '⛓️' },
                { id: 'cerca_electrificada', label: 'Cerca Electrificada 6 Hilos + Energizador 12kV', icon: '⚡' },
                { id: 'concertina', label: 'Concertina Cruzada Bisturí 45cm', icon: '🌀' },
                { id: 'reja_acero', label: 'Reja de Acero Plastificada Euroreja', icon: '🛡️' },
                { id: 'cinta_privacidad', label: 'Cinta de Privacidad Plástica', icon: '🌿' },
              ].map((sys) => {
                const isChecked = selectedSystems.includes(sys.id as FenceSystemType);
                return (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => toggleSystem(sys.id as FenceSystemType)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                      isChecked
                        ? 'bg-[#f5f5f0] border-[#5a5a40] text-[#2a2a22] font-bold shadow-sm'
                        : 'bg-[#fbfbf9] border-[#e6e6df] text-[#707060] hover:bg-[#f5f5f0]'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{sys.icon}</span>
                      <span>{sys.label}</span>
                    </span>
                    <span className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-[#5a5a40] border-[#484833] text-white font-black' : 'border-[#d8d8ce]'}`}>
                      {isChecked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Freight Zone */}
          <div>
            <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
              Zona de Flete & Maniobra de Entrega:
            </label>
            <select
              value={freightZone}
              onChange={(e) => setFreightZone(e.target.value as 'Zone A' | 'Zone B' | 'Zone C')}
              className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-xs font-semibold bg-white"
            >
              <option value="Zone A">Zona A: Local / Cuernavaca ($650 MXN)</option>
              <option value="Zone B">Zona B: Regional / Valle de México ($1,200 MXN)</option>
              <option value="Zone C">Zona C: Distante / Industrial ($2,200 MXN)</option>
            </select>
          </div>

          {/* Discount Input */}
          <div>
            <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
              Descuento Comercial Aplicado ($ MXN):
            </label>
            <input
              type="number"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(Number(e.target.value))}
              className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-sm font-bold text-rose-700"
            />
          </div>

          {/* Proposal Notes */}
          <div>
            <label className="block text-xs font-bold text-[#434338] uppercase tracking-wider mb-1">
              Notas & Condiciones Comerciales:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 border border-[#e6e6df] rounded-xl text-xs text-[#434338]"
            />
          </div>
        </div>

        {/* Right Column: Real-time BOM & Commercial Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          {/* Commercial Financial Card Summary */}
          <div className="bg-[#5a5a40] text-white p-6 rounded-2xl shadow-sm border border-[#4a4a34] space-y-4">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div>
                <span className="text-xs font-mono text-[#d8d8ce] font-semibold block uppercase">RESUMEN COMERCIAL</span>
                <span className="text-lg font-extrabold text-white">{totalMeters} Metros Lineales x {height}m Altura</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-white">${finalTotal.toLocaleString()} MXN</span>
                <span className="text-[11px] text-[#d8d8ce] block">IVA Incluido</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/15">
                <span className="text-[10px] text-[#d8d8ce] block">Materiales (Sistemas)</span>
                <span className="font-bold text-white">${calcResult.materialSalePrice.toLocaleString()}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/15">
                <span className="text-[10px] text-[#d8d8ce] block">Mano de Obra</span>
                <span className="font-bold text-white">${calcResult.laborCost.toLocaleString()}</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/15">
                <span className="text-[10px] text-[#d8d8ce] block">Flete & Maniobra</span>
                <span className="font-bold text-white">${calcResult.freightCost.toLocaleString()}</span>
              </div>
              <div className="bg-white/20 p-2.5 rounded-xl border border-white/30 text-white">
                <span className="text-[10px] text-[#d8d8ce] block font-bold">50% Anticipo Req.</span>
                <span className="font-extrabold text-white">${requiredAdvance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Automatic BOM (Bill of Materials) Table */}
          <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2a2a22] flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#5a5a40]" />
                <span>Desglose Automático de Materiales (BOM Cercassa)</span>
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#f5f5f0] text-[#5a5a40] border border-[#e6e6df] rounded-lg">
                {calcResult.bom.length} Insumos Calculados
              </span>
            </div>

            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f5f5f0] text-[#5a5a40] uppercase font-bold border-b border-[#e6e6df] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Insumo Requerido</th>
                    <th className="py-2.5 px-3 text-center">Cant.</th>
                    <th className="py-2.5 px-3">Unidad</th>
                    <th className="py-2.5 px-3 text-right">P. Unitario</th>
                    <th className="py-2.5 px-3 text-right">Total ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0eb] font-medium">
                  {calcResult.bom.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#fbfbf9]">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#5a5a40] text-[11px]">{item.code}</td>
                      <td className="py-2.5 px-3 text-[#2a2a22]">{item.description}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-[#2a2a22] text-sm bg-[#f5f5f0] rounded-md">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-[#707060] uppercase text-[10px]">{item.unit}</td>
                      <td className="py-2.5 px-3 text-right text-[#707060]">${item.unitPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#2a2a22]">${item.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
