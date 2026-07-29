import React, { useRef, useState, useEffect } from 'react';
import { completeProject, getWorkProjects } from '../../lib/storage';
import { WorkProject } from '../../types';
import { CheckCircle2, DollarSign, PenTool, Printer, ShieldCheck, Eraser } from 'lucide-react';

interface ProjectClosureProps {
  project: WorkProject;
  onUpdateProject: (p: WorkProject) => void;
  onOpenReceiptModal: (p: WorkProject) => void;
}

export const ProjectClosure: React.FC<ProjectClosureProps> = ({ project, onUpdateProject, onOpenReceiptModal }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const [customerSignedName, setCustomerSignedName] = useState(project.customerNameSigned || project.clientName);
  const [collectedAmount, setCollectedAmount] = useState<number>(project.finalCollectedAmount || 0);
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('transferencia');

  const isCompleted = project.status === 'completada';

  useEffect(() => {
    // Setup Canvas context
    const canvas = canvasRef.current;
    if (canvas && !isCompleted) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#2a2a22';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
      }
    }
  }, [isCompleted]);

  // Touch and Mouse Drawing handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasSigned(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasSigned(false);
    }
  };

  const handleFinalizeProject = (e: React.FormEvent) => {
    e.preventDefault();
    let signatureData = project.signatureDataUrl;

    if (canvasRef.current && hasSigned) {
      signatureData = canvasRef.current.toDataURL();
    }

    completeProject(project.id, {
      collectedAmount,
      customerSignedName,
      paymentMethod,
      signatureDataUrl: signatureData,
    });

    const all = getWorkProjects();
    const curr = all.find((p) => p.id === project.id);
    if (curr) onUpdateProject(curr);
  };

  return (
    <div className="space-y-6">
      {/* Complete Banner */}
      {isCompleted ? (
        <div className="bg-[#e2ebe0] border border-[#c3d4c0] p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-[#2d4d31]">
            <CheckCircle2 className="w-8 h-8 text-[#3d6e43] shrink-0" />
            <div>
              <h2 className="text-xl font-extrabold">Obra Finalizada & Acta Digital Recibida</h2>
              <p className="text-xs mt-0.5 text-[#2d4d31]">
                Firma de conformidad capturada y liquidación financiera ingresada al sistema.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onOpenReceiptModal(project)}
              className="px-5 py-2.5 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Ver Comprobante / Recibo Digital de Finiquito</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFinalizeProject} className="space-y-6">
          {/* Liquidation Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#f0f0eb] pb-3 text-[#2a2a22]">
              <DollarSign className="w-5 h-5 text-[#5a5a40]" />
              <h2 className="text-base font-bold">Finiquito & Cobro en Sitio (50% Restante)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#434338] mb-1">Monto Recibido del Cliente ($ MXN):</label>
                <input
                  type="number"
                  required
                  value={collectedAmount}
                  onChange={(e) => setCollectedAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-lg font-bold text-[#2a2a22] focus:ring-2 focus:ring-[#5a5a40] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#434338] mb-1">Forma de Cobro Finiquito:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'efectivo' | 'transferencia' | 'tarjeta')}
                  className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-xs font-semibold bg-white focus:outline-none"
                >
                  <option value="transferencia">Transferencia SPEI en Sitio</option>
                  <option value="efectivo">Efectivo a Jefe de Cuadrilla</option>
                  <option value="tarjeta">Terminal Punto de Venta Móvil</option>
                </select>
              </div>
            </div>
          </div>

          {/* Digital Signature Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0f0eb] pb-3">
              <div className="flex items-center space-x-2 text-[#2a2a22]">
                <PenTool className="w-5 h-5 text-[#5a5a40]" />
                <h2 className="text-base font-bold">Firma Digital de Conformidad del Cliente</h2>
              </div>

              <button
                type="button"
                onClick={clearCanvas}
                className="px-2.5 py-1 text-xs font-semibold text-[#707060] hover:bg-[#f5f5f0] border border-[#e6e6df] rounded-lg flex items-center space-x-1"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Limpiar Firma</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#434338] mb-1">Nombre Completo del Receptor en Obra:</label>
              <input
                type="text"
                required
                value={customerSignedName}
                onChange={(e) => setCustomerSignedName(e.target.value)}
                className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-xs font-semibold text-[#2a2a22] focus:ring-2 focus:ring-[#5a5a40] focus:outline-none mb-3"
              />
            </div>

            {/* Signature Canvas Pad */}
            <div className="border-2 border-dashed border-[#e6e6df] rounded-2xl p-2 bg-[#fbfbf9]">
              <canvas
                ref={canvasRef}
                width={500}
                height={160}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="w-full h-40 bg-white rounded-xl touch-none cursor-crosshair border border-[#f0f0eb]"
              />
              <span className="block text-[10px] text-[#a1a194] text-center mt-1">
                Firme con el dedo o puntero táctil dentro del recuadro
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl shadow-sm transition-colors text-xs flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Concluir Obra & Generar Acta con Firma Digital</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
