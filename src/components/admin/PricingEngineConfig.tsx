import React, { useState, useEffect } from 'react';
import { getPricingConfig, savePricingConfig } from '../../lib/storage';
import { PricingConfig } from '../../types';
import { Settings, Save, CheckCircle, RefreshCcw } from 'lucide-react';

export const PricingEngineConfig: React.FC = () => {
  const [config, setConfig] = useState<PricingConfig>(getPricingConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setConfig(getPricingConfig());
  }, []);

  const handleBasePriceChange = (id: string, field: 'costPerUnit' | 'salePricePerUnit', value: number) => {
    setConfig((prev) => ({
      ...prev,
      basePrices: prev.basePrices.map((bp) =>
        bp.id === id ? { ...bp, [field]: value } : bp
      ),
    }));
  };

  const handleInputParamChange = (field: keyof PricingConfig['inputParams'], value: number) => {
    setConfig((prev) => ({
      ...prev,
      inputParams: { ...prev.inputParams, [field]: value },
    }));
  };

  const handleLaborRateChange = (field: keyof PricingConfig['laborRates'], value: number) => {
    setConfig((prev) => ({
      ...prev,
      laborRates: { ...prev.laborRates, [field]: value },
    }));
  };

  const handleFreightChange = (field: keyof PricingConfig['freightRates'], value: number) => {
    setConfig((prev) => ({
      ...prev,
      freightRates: { ...prev.freightRates, [field]: value },
    }));
  };

  const handleSave = () => {
    savePricingConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40] font-mono">
            ⚙️ Módulo Admin: Motor Paramétrico
          </span>
          <h1 className="text-2xl font-bold text-[#2a2a22] mt-1">Configuración del Motor de Cotización</h1>
          <p className="text-sm text-[#707060] mt-1">
            Ajuste los precios base por metro lineal, constantes de insumos, costos de mano de obra y zonas de flete.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-5 py-2.5 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          {savedSuccess ? <CheckCircle className="w-5 h-5 text-emerald-300" /> : <Save className="w-5 h-5" />}
          <span>{savedSuccess ? '¡Guardado!' : 'Guardar Cambios'}</span>
        </button>
      </div>

      {/* 1. Precios Base por Sistema */}
      <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#2a2a22] flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#5a5a40]" />
          <span>1. Gestión de Precios Base por Sistema / Insumo</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f5f5f0] text-[#5a5a40] text-xs uppercase font-bold border-b border-[#e6e6df]">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Descripción del Insumo / Sistema</th>
                <th className="py-3 px-4">Unidad</th>
                <th className="py-3 px-4">Costo Interno ($)</th>
                <th className="py-3 px-4">Precio Venta ($)</th>
                <th className="py-3 px-4">Especificaciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0eb] font-medium">
              {config.basePrices.map((bp) => (
                <tr key={bp.id} className="hover:bg-[#fbfbf9]">
                  <td className="py-3 px-4 font-mono text-xs text-[#5a5a40] font-bold">{bp.code}</td>
                  <td className="py-3 px-4 text-[#2a2a22] font-semibold">{bp.name}</td>
                  <td className="py-3 px-4 text-[#707060] uppercase text-xs">{bp.unit}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={bp.costPerUnit}
                      onChange={(e) => handleBasePriceChange(bp.id, 'costPerUnit', Number(e.target.value))}
                      className="w-24 px-2.5 py-1 text-sm border border-[#e6e6df] rounded-lg focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={bp.salePricePerUnit}
                      onChange={(e) => handleBasePriceChange(bp.id, 'salePricePerUnit', Number(e.target.value))}
                      className="w-24 px-2.5 py-1 text-sm border border-[#e6e6df] rounded-lg focus:ring-2 focus:ring-[#5a5a40] focus:outline-none font-bold text-[#2a2a22]"
                    />
                  </td>
                  <td className="py-3 px-4 text-xs text-[#707060]">{bp.specs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Parámetros de Insumos & Constantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#2a2a22]">2. Constantes Técnicas de Insumos (BOM)</h2>

          <div className="space-y-3 text-sm">
            <div>
              <label className="block text-xs font-semibold text-[#434338] mb-1">
                Distancia estándar entre postes de línea (m):
              </label>
              <input
                type="number"
                step="0.1"
                value={config.inputParams.postDistanceMeters}
                onChange={(e) => handleInputParamChange('postDistanceMeters', Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
              />
              <span className="text-[11px] text-[#707060]">Normalmente 2.5m a 3.0m en cerca ciclónica.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#434338] mb-1">
                Largo de tramo de tubo superior (m):
              </label>
              <input
                type="number"
                step="0.5"
                value={config.inputParams.topTubeLengthMeters}
                onChange={(e) => handleInputParamChange('topTubeLengthMeters', Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#434338] mb-1">
                Botes de concreto/mezcla por poste:
              </label>
              <input
                type="number"
                step="0.1"
                value={config.inputParams.concreteBucketsPerPost}
                onChange={(e) => handleInputParamChange('concreteBucketsPerPost', Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
              />
              <span className="text-[11px] text-[#707060]">Cantidad promedio requerida para anclaje firme.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#434338] mb-1">
                Alambre de amarre (Kg por 100m lineal):
              </label>
              <input
                type="number"
                step="0.5"
                value={config.inputParams.tieWireKgPer100m}
                onChange={(e) => handleInputParamChange('tieWireKgPer100m', Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Costos de Mano de Obra y Fletes */}
        <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#2a2a22]">3. Tarifas de Mano de Obra ($/m) y Fletes</h2>

          <div className="space-y-3 text-sm">
            <span className="text-xs font-bold text-[#5a5a40] uppercase tracking-wider block border-b border-[#f0f0eb] pb-1">
              Instalación por Metro Lineal ($/m):
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#707060] mb-1">Malla Ciclónica:</label>
                <input
                  type="number"
                  value={config.laborRates.malla_ciclonica}
                  onChange={(e) => handleLaborRateChange('malla_ciclonica', Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-[#e6e6df] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-[#707060] mb-1">Cerca Electrificada:</label>
                <input
                  type="number"
                  value={config.laborRates.cerca_electrificada}
                  onChange={(e) => handleLaborRateChange('cerca_electrificada', Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-[#e6e6df] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-[#707060] mb-1">Concertina:</label>
                <input
                  type="number"
                  value={config.laborRates.concertina}
                  onChange={(e) => handleLaborRateChange('concertina', Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-[#e6e6df] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-[#707060] mb-1">Reja de Acero:</label>
                <input
                  type="number"
                  value={config.laborRates.reja_acero}
                  onChange={(e) => handleLaborRateChange('reja_acero', Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-[#e6e6df] rounded-lg text-sm"
                />
              </div>
            </div>

            <span className="text-xs font-bold text-[#5a5a40] uppercase tracking-wider block border-b border-[#f0f0eb] pb-1 pt-2">
              Tarifas de Flete y Maniobra por Zona:
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-[#707060] mb-1">Zona A (Local 0-15km):</label>
                <input
                  type="number"
                  value={config.freightRates.zoneAFlat}
                  onChange={(e) => handleFreightChange('zoneAFlat', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#e6e6df] rounded-lg text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#707060] mb-1">Zona B (15-40km):</label>
                <input
                  type="number"
                  value={config.freightRates.zoneBFlat}
                  onChange={(e) => handleFreightChange('zoneBFlat', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#e6e6df] rounded-lg text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#707060] mb-1">Zona C (40km+):</label>
                <input
                  type="number"
                  value={config.freightRates.zoneCFlat}
                  onChange={(e) => handleFreightChange('zoneCFlat', Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-[#e6e6df] rounded-lg text-sm font-semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
