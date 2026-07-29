import React, { useState, useEffect } from 'react';
import { getQuotes, saveQuotes, approveQuoteAndReserveMaterial, subscribeStorage } from '../../lib/storage';
import { Quote } from '../../types';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, Upload, DollarSign, FileCheck, Eye } from 'lucide-react';

interface ProposalTrackingProps {
  onOpenProposalModal: (quote: Quote) => void;
}

export const ProposalTracking: React.FC<ProposalTrackingProps> = ({ onOpenProposalModal }) => {
  const [quotes, setQuotes] = useState<Quote[]>(getQuotes());
  const [selectedQuoteForAdvance, setSelectedQuoteForAdvance] = useState<Quote | null>(null);

  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Transferencia bancaria BBVA');
  const [receiptUrl, setReceiptUrl] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=300');

  useEffect(() => {
    const load = () => {
      setQuotes(getQuotes());
    };
    load();
    return subscribeStorage(load);
  }, []);

  const handleOpenAdvanceModal = (q: Quote) => {
    setSelectedQuoteForAdvance(q);
    setAdvanceAmount(q.advancePaid || Math.round(q.total * 0.5));
  };

  const handleConfirmAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuoteForAdvance) return;

    approveQuoteAndReserveMaterial(
      selectedQuoteForAdvance.id,
      advanceAmount,
      paymentMethod,
      receiptUrl
    );

    setQuotes(getQuotes());
    setSelectedQuoteForAdvance(null);
  };

  // Helper for WhatsApp click link
  const getWhatsappUrl = (q: Quote) => {
    const text = `Hola *${q.clientName}*, te compartimos la cotización formal *${q.id}* de *Cercassa Mallas y Alambrados*:\n\n` +
      `📐 *Metros Lineales:* ${q.totalMeters}m x ${q.height}m de altura\n` +
      `💰 *Inversión Total:* $${q.total.toLocaleString()} MXN\n` +
      `💳 *Anticipo del 50%: * $${Math.round(q.total * 0.5).toLocaleString()} MXN\n` +
      `⏳ *Vigencia:* ${q.validUntil} (Sujeta a variación del precio del acero)\n\n` +
      `¿Podemos coordinar la visita de verificación para iniciar la instalación?`;
    return `https://wa.me/${q.clientWhatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5a5a40] font-mono">
            📲 Rol 2: Envío, Alertas & Anticipos
          </span>
          <h1 className="text-2xl font-bold text-[#2a2a22] mt-1">Seguimiento de Propuestas Comerciales</h1>
          <p className="text-sm text-[#707060] mt-1">
            Control de vigencia por precio del acero, envío de PDF por WhatsApp y registro de anticipos para pase a producción.
          </p>
        </div>
      </div>

      {/* Alert Banner for Expiring Quotes */}
      <div className="bg-[#f5f5f0] border border-[#e6e6df] rounded-2xl p-4 flex items-start space-x-3 text-[#2a2a22] shadow-sm">
        <AlertTriangle className="w-5 h-5 text-[#8a5d25] shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold block text-sm text-[#2a2a22]">Control de Vigencia Activa (Mercado de Acero)</span>
          <p className="mt-0.5 text-[#707060]">
            Debido a fluctuaciones en el costo de la materia prima (alambre galvanizado y tubería estructural), las cotizaciones vencen automáticamente a los 15 días. Recomiende al cliente congelar precio con su 50% de anticipo.
          </p>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#2a2a22]">Catálogo de Cotizaciones Emitidas</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f5f5f0] text-[#5a5a40] text-xs uppercase font-bold border-b border-[#e6e6df]">
              <tr>
                <th className="py-3 px-4">Folio / Fecha</th>
                <th className="py-3 px-4">Cliente & Dirección</th>
                <th className="py-3 px-4">Metros & Sistemas</th>
                <th className="py-3 px-4">Monto Total</th>
                <th className="py-3 px-4">Vigencia</th>
                <th className="py-3 px-4">Estatus / Anticipo</th>
                <th className="py-3 px-4 text-right">Acciones Directas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f0eb] font-medium">
              {quotes.map((q) => {
                const isApproved = q.status === 'aprobada' || q.advancePaid > 0;
                return (
                  <tr key={q.id} className="hover:bg-[#fbfbf9]">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#2a2a22] block text-xs">{q.id}</span>
                      <span className="text-[11px] text-[#707060]">
                        {new Date(q.createdAt).toLocaleDateString('es-MX')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-[#2a2a22] block">{q.clientName}</span>
                      <span className="text-xs text-[#707060]">{q.address}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-[#2a2a22] block">{q.totalMeters} m ({q.height}m)</span>
                      <span className="text-[11px] text-[#707060] capitalize">
                        {q.systemTypes.map((s) => s.replace('_', ' ')).join(', ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#2a2a22]">
                      ${q.total.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-xs font-semibold text-[#707060]">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#5a5a40]" />
                        <span>{q.validUntil}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {isApproved ? (
                        <div>
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#e2ebe0] text-[#2d4d31]">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Aprobada / Anticipo</span>
                          </span>
                          <span className="text-[11px] text-[#2d4d31] font-bold block mt-1">
                            Pagado: ${q.advancePaid.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#f5f5f0] text-[#707060]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Pendiente de Pago</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* View PDF Proposal */}
                        <button
                          onClick={() => onOpenProposalModal(q)}
                          title="Ver Membrete PDF"
                          className="p-1.5 rounded-lg bg-[#f5f5f0] hover:bg-[#eaeaE0] text-[#2a2a22] border border-[#e6e6df]"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Send via WhatsApp */}
                        <a
                          href={getWhatsappUrl(q)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Enviar por WhatsApp"
                          className="p-1.5 rounded-lg bg-[#5a5a40] hover:bg-[#484833] text-white font-bold"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {/* Register Advance */}
                        {!isApproved && (
                          <button
                            onClick={() => handleOpenAdvanceModal(q)}
                            className="px-3 py-1 bg-[#5a5a40] hover:bg-[#484833] text-white text-xs font-bold rounded-lg shadow-sm"
                          >
                            Registrar 50% Anticipo
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Advance Payment Registration */}
      {selectedQuoteForAdvance && (
        <div className="fixed inset-0 z-50 bg-[#2a2a22]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#e6e6df] shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-[#2a2a22] border-b border-[#f0f0eb] pb-2 flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-[#5a5a40]" />
              <span>Registrar Anticipo & Reservar Materiales</span>
            </h3>

            <p className="text-xs text-[#707060]">
              Ingresa el comprobante de depósito/transferencia para cambiar el estatus a <strong className="text-[#2a2a22]">Aprobada</strong> y apartar stock de tubería y malla en Almacén.
            </p>

            <form onSubmit={handleConfirmAdvance} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Monto del Anticipo Recibido ($ MXN):</label>
                <input
                  type="number"
                  required
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-base font-bold text-[#2a2a22] focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Forma de Pago:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-xs font-medium bg-white focus:outline-none"
                >
                  <option value="Transferencia bancaria BBVA">Transferencia SPEI (BBVA)</option>
                  <option value="Efectivo en Oficina">Efectivo en Oficina</option>
                  <option value="Tarjeta de Débito/Crédito">Tarjeta de Débito / Crédito Terminal</option>
                  <option value="Cheque Nominativo">Cheque Nominativo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#434338] mb-1">Ficha / Comprobante de Pago (Simulado):</label>
                <input
                  type="text"
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-xs text-[#707060]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-[#f0f0eb]">
                <button
                  type="button"
                  onClick={() => setSelectedQuoteForAdvance(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#707060] hover:bg-[#f5f5f0] rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#5a5a40] hover:bg-[#484833] text-white rounded-xl shadow-sm"
                >
                  Confirmar Anticipo & Reservar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
