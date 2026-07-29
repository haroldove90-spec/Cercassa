import React from 'react';
import { WorkProject } from '../types';
import { Shield, Printer, X, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  project: WorkProject;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ project, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2a2a22]/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-auto overflow-hidden border border-[#e6e6df] flex flex-col max-h-[92vh]">
        {/* Action Header */}
        <div className="bg-[#5a5a40] text-white p-4 flex items-center justify-between border-b border-[#484833] print:hidden">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-[#d8d8ce]" />
            <span className="font-bold text-sm">Recibo Digital de Finiquito y Conformidad</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#f5f5f0] hover:bg-[#eaeaE0] text-[#2a2a22] font-bold rounded-xl text-xs flex items-center space-x-1 shadow-sm border border-[#e6e6df]"
            >
              <Printer className="w-3.5 h-3.5 text-[#5a5a40]" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#d8d8ce] hover:text-white hover:bg-[#484833]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content */}
        <div className="p-8 space-y-6 text-[#2a2a22] print:p-0">
          <div className="text-center border-b border-[#f0f0eb] pb-4">
            <div className="w-12 h-12 bg-[#5a5a40] text-white rounded-xl flex items-center justify-center mx-auto mb-2 shadow-sm">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black font-mono text-[#2a2a22]">CERCASSA</h1>
            <p className="text-xs text-[#707060]">RECIBO DE FINIQUITO DE OBRA Y CONFORMIDAD</p>
            <span className="text-xs font-mono font-bold text-[#5a5a40] mt-1 block">
              FOLIO: REC-{project.id}
            </span>
          </div>

          <div className="bg-[#f5f5f0] p-4 rounded-xl border border-[#e6e6df] text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-[#707060]">Cliente:</span>
              <span className="font-bold text-[#2a2a22]">{project.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707060]">Ubicación de la Obra:</span>
              <span className="font-semibold text-[#2a2a22]">{project.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707060]">Metros Instalados:</span>
              <span className="font-bold text-[#2a2a22]">{project.totalMeters}m lineales</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#707060]">Fecha de Conclusión:</span>
              <span className="font-semibold text-[#2a2a22]">
                {new Date(project.completedAt || Date.now()).toLocaleString('es-MX')}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#e2ebe0] border border-[#c3d4c0] rounded-xl text-center space-y-1">
            <span className="text-xs text-[#2d4d31] font-bold block">SALDO FINAL COBRADO Y LIQUIDADO:</span>
            <span className="text-3xl font-black text-[#2d4d31]">
              ${project.finalCollectedAmount.toLocaleString()} MXN
            </span>
            <span className="text-[11px] text-[#2d4d31] block">
              Método de Pago: <strong className="capitalize">{project.paymentMethod}</strong>
            </span>
          </div>

          {/* Signature Rendering */}
          <div className="border-t border-[#f0f0eb] pt-4 text-center space-y-2">
            <span className="text-xs text-[#707060] block font-semibold">Firma de Conformidad del Cliente:</span>
            {project.signatureDataUrl ? (
              <img src={project.signatureDataUrl} alt="Firma Cliente" className="h-20 mx-auto border border-[#e6e6df] rounded-lg p-1 bg-[#fbfbf9]" />
            ) : (
              <div className="h-16 flex items-center justify-center text-xs text-[#a1a194] italic">
                (Firma digital registrada)
              </div>
            )}
            <span className="text-xs font-bold text-[#2a2a22] block">{project.customerNameSigned || project.clientName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
