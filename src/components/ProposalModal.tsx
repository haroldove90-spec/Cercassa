import React from 'react';
import { Quote } from '../types';
import { Shield, Printer, X, MessageSquare, Download } from 'lucide-react';

interface ProposalModalProps {
  quote: Quote;
  onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({ quote, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const getWhatsappUrl = () => {
    const text = `Estimado(a) *${quote.clientName}*, le compartimos su Cotización Formal *${quote.id}* de Cercassa Mallas y Alambrados.\n\n` +
      `📏 Metros Lineales: ${quote.totalMeters}m x ${quote.height}m\n` +
      `💰 Total: $${quote.total.toLocaleString()} MXN (IVA Incluido)\n` +
      `💳 Anticipo 50%: $${Math.round(quote.total * 0.5).toLocaleString()} MXN\n` +
      `Vigencia: ${quote.validUntil}`;
    return `https://wa.me/${quote.clientWhatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2a2a22]/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Container */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-auto overflow-hidden border border-[#e6e6df] flex flex-col max-h-[92vh]">
        {/* Modal Action Bar (Not visible when printed) */}
        <div className="bg-[#5a5a40] text-white p-4 flex items-center justify-between border-b border-[#484833] print:hidden shrink-0">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-[#d8d8ce]" />
            <span className="font-bold text-sm">Vista Previa de Propuesta Comercial Cercassa (Membrete Oficial)</span>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#3d6e43] hover:bg-[#2d4d31] text-white font-bold rounded-xl text-xs flex items-center space-x-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#f5f5f0] hover:bg-[#eaeaE0] text-[#2a2a22] font-bold rounded-xl text-xs flex items-center space-x-1 shadow-sm border border-[#e6e6df]"
            >
              <Printer className="w-3.5 h-3.5 text-[#5a5a40]" />
              <span>Imprimir / Exportar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#d8d8ce] hover:text-white hover:bg-[#484833]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Proposal Letterhead Content */}
        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 text-[#2a2a22] print:p-0 print:overflow-visible">
          {/* Official Letterhead Header */}
          <div className="flex justify-between items-start border-b-2 border-[#5a5a40] pb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-[#5a5a40] rounded-2xl flex items-center justify-center text-white shadow-sm">
                <Shield className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#2a2a22] font-mono">CERCASSA</h1>
                <p className="text-xs font-bold text-[#5a5a40]">SISTEMAS PERIMETRALES Y SEGURIDAD INDUSTRIAL</p>
                <p className="text-[11px] text-[#707060]">
                  Mallas Ciclónicas, Concertina, Cercas Electrificadas y Reja de Acero
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#5a5a40] block">FOLIO: {quote.id}</span>
              <span className="text-xs text-[#707060] block">
                Fecha de Emisión: {new Date(quote.createdAt).toLocaleDateString('es-MX')}
              </span>
              <span className="text-xs font-bold text-[#8a5d25] block mt-1">
                Válida hasta: {quote.validUntil}
              </span>
            </div>
          </div>

          {/* Client & Address Info */}
          <div className="bg-[#f5f5f0] p-4 rounded-xl border border-[#e6e6df] grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-[#5a5a40] uppercase block">Atención A:</span>
              <span className="font-bold text-[#2a2a22] text-sm block">{quote.clientName}</span>
              <span className="text-[#707060]">Tel / WhatsApp: {quote.clientWhatsapp}</span>
            </div>
            <div>
              <span className="font-bold text-[#5a5a40] uppercase block">Ubicación del Inmueble / Obra:</span>
              <span className="font-semibold text-[#2a2a22] block">{quote.address}</span>
            </div>
          </div>

          {/* Systems Technical Specs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#5a5a40] tracking-wider border-b border-[#e6e6df] pb-1">
              Especificaciones Técnicas del Cerco:
            </h3>

            <div className="grid grid-cols-3 gap-3 text-xs bg-[#fbfbf9] p-3.5 rounded-xl border border-[#e6e6df] text-center">
              <div>
                <span className="text-[#707060] block font-semibold">Perímetro Total</span>
                <span className="font-bold text-[#2a2a22] text-sm">{quote.totalMeters} Metros Lineales</span>
              </div>
              <div>
                <span className="text-[#707060] block font-semibold">Altura del Sistema</span>
                <span className="font-bold text-[#2a2a22] text-sm">{quote.height} Metros</span>
              </div>
              <div>
                <span className="text-[#707060] block font-semibold">Configuración</span>
                <span className="font-bold text-[#2a2a22] text-sm capitalize">
                  {quote.systemTypes.map((s) => s.replace('_', ' ')).join(' + ')}
                </span>
              </div>
            </div>
          </div>

          {/* Materials Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#5a5a40] tracking-wider border-b border-[#e6e6df] pb-1">
              Presupuesto Detallado de Materiales e Instalación:
            </h3>

            <table className="w-full text-left text-xs">
              <thead className="bg-[#f5f5f0] text-[#5a5a40] font-bold uppercase border-b border-[#e6e6df]">
                <tr>
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Insumo / Concepto</th>
                  <th className="py-2.5 px-3 text-center">Cant.</th>
                  <th className="py-2.5 px-3 text-right">P. Unitario</th>
                  <th className="py-2.5 px-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0eb] font-medium">
                {quote.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-mono text-[#5a5a40] font-bold">{item.itemCode}</td>
                    <td className="py-2.5 px-3 text-[#2a2a22]">{item.description}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#2a2a22]">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right text-[#707060]">${item.unitCost.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#2a2a22]">${item.totalCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Payment Conditions */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t-2 border-[#5a5a40]">
            <div className="text-xs text-[#707060] space-y-1 max-w-md">
              <span className="font-bold text-[#2a2a22] block">Condiciones de Contratación:</span>
              <p>• 50% de anticipo para reserva de insumos y programación de cuadrilla.</p>
              <p>• 50% restante contra entrega y firma de conformidad de la obra.</p>
              <p>• Incluye mano de obra, colado de cimentación y nivelación de postes.</p>
            </div>

            <div className="bg-[#f5f5f0] p-4 rounded-xl border border-[#e6e6df] text-right space-y-1 w-full sm:w-64">
              <div className="flex justify-between text-xs text-[#707060]">
                <span>Subtotal:</span>
                <span>${Math.round(quote.total / 1.16).toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between text-xs text-[#707060]">
                <span>IVA (16%):</span>
                <span>${Math.round(quote.total - quote.total / 1.16).toLocaleString()} MXN</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#2a2a22] border-t border-[#e6e6df] pt-1 mt-1">
                <span>Inversión Total:</span>
                <span className="text-[#5a5a40]">${quote.total.toLocaleString()} MXN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
