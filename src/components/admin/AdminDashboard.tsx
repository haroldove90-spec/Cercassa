import React, { useState, useEffect } from 'react';
import { getQuotes, getWorkProjects, getInventory, subscribeStorage } from '../../lib/storage';
import { Quote, WorkProject } from '../../types';
import { TrendingUp, DollarSign, Ruler, Hammer, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<WorkProject[]>([]);

  useEffect(() => {
    const load = () => {
      setQuotes(getQuotes());
      setProjects(getWorkProjects());
    };
    load();
    return subscribeStorage(load);
  }, []);

  // Compute Metrics
  const approvedQuotes = quotes.filter((q) => q.status === 'aprobada' || q.advancePaid > 0);
  
  const totalMetersSold = approvedQuotes.reduce((acc, q) => acc + q.totalMeters, 0);
  
  const completedProjects = projects.filter((p) => p.status === 'completada');
  const totalMetersInstalled = completedProjects.reduce((acc, p) => acc + p.totalMeters, 0);

  const totalRevenue = approvedQuotes.reduce((acc, q) => acc + q.total, 0);
  const totalMaterialCost = approvedQuotes.reduce((acc, q) => acc + q.materialCost, 0);
  const totalLaborCost = approvedQuotes.reduce((acc, q) => acc + q.laborCost, 0);
  const totalFreightCost = approvedQuotes.reduce((acc, q) => acc + q.freightCost, 0);
  
  const totalNetProfit = totalRevenue - (totalMaterialCost + totalLaborCost + totalFreightCost);
  const netMarginPercent = totalRevenue > 0 ? Math.round((totalNetProfit / totalRevenue) * 100) : 0;

  const pendingCollection = approvedQuotes.reduce((acc, q) => acc + q.remainingBalance, 0);
  const activeWorksCount = projects.filter((p) => p.status === 'en_proceso' || p.status === 'en_sitio').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Title */}
      <div className="bg-[#5a5a40] border border-[#4a4a34] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#d8d8ce] font-mono">
            📊 Rol 1: Administrador / Dirección General
          </span>
          <h1 className="text-2xl font-bold mt-1 text-white">Dashboard & Analítica General</h1>
          <p className="text-sm text-[#d8d8ce] mt-1">
            Monitoreo en tiempo real de metros perimetrales, rentabilidad financiera y control de obras.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-right backdrop-blur-sm">
          <span className="text-[11px] text-[#d8d8ce] block font-mono">Margen Neto Promedio</span>
          <span className="text-xl font-extrabold text-white">{netMarginPercent}% Ut. Neta</span>
        </div>
      </div>

      {/* Global KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e6e6df] shadow-sm hover:border-[#a1a194] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a194]">Metros Vendidos</span>
            <div className="p-2.5 rounded-xl bg-[#f5f5f0] text-[#5a5a40]">
              <Ruler className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-light text-[#2a2a22]">{totalMetersSold.toLocaleString()} <span className="text-sm italic text-[#707060]">m</span></span>
            <p className="text-xs text-[#707060] mt-1 flex items-center space-x-1">
              <span className="text-emerald-700 font-medium">↑ Cotizaciones Aprobadas</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e6df] shadow-sm hover:border-[#a1a194] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a194]">Metros Instalados</span>
            <div className="p-2.5 rounded-xl bg-[#f5f5f0] text-[#5a5a40]">
              <Hammer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-light text-[#2a2a22]">{totalMetersInstalled.toLocaleString()} <span className="text-sm italic text-[#707060]">m</span></span>
            <p className="text-xs text-[#707060] mt-1">Obras concluidas en campo</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e6df] shadow-sm hover:border-[#a1a194] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a194]">Ingresos Acumulados</span>
            <div className="p-2.5 rounded-xl bg-[#f5f5f0] text-[#5a5a40]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-light text-[#2a2a22]">${totalRevenue.toLocaleString()}</span>
            <p className="text-xs text-[#707060] mt-1">Ventas totales brutas</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e6e6df] shadow-sm hover:border-[#a1a194] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#a1a194]">Pendiente de Cobro</span>
            <div className="p-2.5 rounded-xl bg-[#f5f5f0] text-[#8a5d25]">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-light text-[#8a5d25]">${pendingCollection.toLocaleString()}</span>
            <p className="text-xs text-[#707060] mt-1">Saldos pendientes al finalizar obra</p>
          </div>
        </div>
      </div>

      {/* Financial Balance Breakdown Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
        <h2 className="text-base font-bold text-[#2a2a22] mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-[#5a5a40]" />
          <span>Balance Financiero & Estructura de Costos</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#f5f5f0] border border-[#e6e6df]">
            <span className="text-xs font-bold text-[#707060] block uppercase">Ventas Totales</span>
            <span className="text-xl font-bold text-[#2a2a22]">${totalRevenue.toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#f5f5f0] border border-[#e6e6df]">
            <span className="text-xs font-bold text-[#707060] block uppercase">Insumos y Materiales</span>
            <span className="text-xl font-bold text-rose-700">-${totalMaterialCost.toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#f5f5f0] border border-[#e6e6df]">
            <span className="text-xs font-bold text-[#707060] block uppercase">Mano de Obra + Fletes</span>
            <span className="text-xl font-bold text-rose-700">-${(totalLaborCost + totalFreightCost).toLocaleString()}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#f2f5f0] border border-[#d2dcd0]">
            <span className="text-xs font-bold text-[#3a583e] block uppercase">Utilidad Neta Estimada</span>
            <span className="text-xl font-extrabold text-[#2d4d31]">${totalNetProfit.toLocaleString()}</span>
          </div>
        </div>

        {/* Profitability Bar */}
        <div>
          <div className="flex justify-between text-xs font-medium text-[#707060] mb-2">
            <span>Distribución del Ingreso: Materiales ({Math.round((totalMaterialCost/(totalRevenue||1))*100)}%) | Mano de Obra/Fletes ({Math.round(((totalLaborCost+totalFreightCost)/(totalRevenue||1))*100)}%) | Margen Neto ({netMarginPercent}%)</span>
            <span>100% Total</span>
          </div>
          <div className="w-full h-3 bg-[#f0f0eb] rounded-full overflow-hidden flex shadow-inner">
            <div 
              style={{ width: `${Math.min(100, Math.round((totalMaterialCost/(totalRevenue||1))*100))}%` }} 
              className="bg-rose-400 h-full" 
              title="Materiales"
            />
            <div 
              style={{ width: `${Math.min(100, Math.round(((totalLaborCost+totalFreightCost)/(totalRevenue||1))*100))}%` }} 
              className="bg-amber-400 h-full" 
              title="Mano de obra y fletes"
            />
            <div 
              style={{ width: `${Math.max(0, netMarginPercent)}%` }} 
              className="bg-[#5a5a40] h-full" 
              title="Utilidad Neta"
            />
          </div>
        </div>
      </div>

      {/* Monitor de Obras Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Quotes Monitor */}
        <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-[#f0f0eb] pb-3">
            <h2 className="text-sm font-bold text-[#5a5a40] uppercase">Monitor de Cotizaciones Recientes</h2>
            <span className="text-xs font-semibold text-[#a1a194]">Total: {quotes.length}</span>
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {quotes.map((q) => (
              <div key={q.id} className="p-3.5 rounded-xl border border-[#f0f0eb] hover:border-[#d8d8ce] bg-[#fbfbf9] flex items-center justify-between transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#2a2a22]">{q.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.status === 'aprobada' ? 'bg-[#e2ebe0] text-[#2d4d31]' :
                      q.status === 'enviada' ? 'bg-[#e5ebf2] text-[#2b4c6f]' :
                      'bg-[#f0f0eb] text-[#707060]'
                    }`}>
                      {q.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#2a2a22] mt-1 truncate max-w-xs">{q.clientName}</p>
                  <span className="text-[11px] text-[#707060]">{q.totalMeters}m lineales</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#2a2a22] block">${q.total.toLocaleString()}</span>
                  <span className="text-[11px] text-[#707060]">Anticipo: ${q.advancePaid.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Field Works Monitor */}
        <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-[#f0f0eb] pb-3">
            <h2 className="text-sm font-bold text-[#5a5a40] uppercase">Monitor de Obras en Proceso & Campo</h2>
            <span className="text-xs font-semibold text-[#a1a194]">{activeWorksCount} en ejecución</span>
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {projects.map((p) => (
              <div key={p.id} className="p-3.5 rounded-xl border border-[#f0f0eb] hover:border-[#d8d8ce] bg-[#fbfbf9] flex items-center justify-between transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#2a2a22]">{p.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'en_proceso' ? 'bg-[#f5ebd7] text-[#704d19] animate-pulse' :
                      p.status === 'en_sitio' ? 'bg-[#e5ebf2] text-[#2b4c6f]' :
                      p.status === 'completada' ? 'bg-[#e2ebe0] text-[#2d4d31]' :
                      p.status === 'incidencia' ? 'bg-[#f5e2e2] text-[#702b2b]' :
                      'bg-[#f0f0eb] text-[#707060]'
                    }`}>
                      {p.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#2a2a22] mt-1 truncate max-w-xs">{p.clientName}</p>
                  <span className="text-[11px] text-[#707060]">Cuadrilla: {p.crewLeaderName}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#2a2a22] block">{p.totalMeters} m</span>
                  <span className="text-[11px] text-[#707060]">{p.scheduledDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
