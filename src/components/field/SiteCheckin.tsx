import React, { useState } from 'react';
import { checkinProject, saveWorkProjects, getWorkProjects } from '../../lib/storage';
import { WorkProject } from '../../types';
import { CheckSquare, MapPin, Clock, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface SiteCheckinProps {
  project: WorkProject;
  onUpdateProject: (p: WorkProject) => void;
}

export const SiteCheckin: React.FC<SiteCheckinProps> = ({ project, onUpdateProject }) => {
  const [checklist, setChecklist] = useState(project.materialChecklist);

  const handleToggleCheck = (index: number) => {
    const updated = [...checklist];
    updated[index].verified = !updated[index].verified;
    setChecklist(updated);

    const allProjects = getWorkProjects();
    const curr = allProjects.find((p) => p.id === project.id);
    if (curr) {
      curr.materialChecklist = updated;
      saveWorkProjects(allProjects);
      onUpdateProject(curr);
    }
  };

  const handlePerformCheckin = () => {
    checkinProject(project.id);
    const allProjects = getWorkProjects();
    const curr = allProjects.find((p) => p.id === project.id);
    if (curr) onUpdateProject(curr);
  };

  const isCheckedIn = !!project.checkinTime;
  const allVerified = checklist.length > 0 && checklist.every((c) => c.verified);

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#e6e6df] shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-[#f0f0eb] pb-3">
        <div>
          <span className="text-[11px] font-mono text-[#5a5a40] font-bold">MÓDULO DE VERIFICACIÓN EN CAMPO</span>
          <h2 className="text-lg font-bold text-[#2a2a22]">Check-in de Obra & Checklist de Insumos</h2>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-[#f5f5f0] text-[#5a5a40] border border-[#e6e6df] rounded-lg">
          {project.id}
        </span>
      </div>

      {/* Check-in Action Card */}
      <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
        isCheckedIn ? 'bg-[#e2ebe0] border-[#c3d4c0] text-[#2d4d31]' : 'bg-[#f5f5f0] border-[#e6e6df] text-[#2a2a22]'
      }`}>
        <div>
          <span className="text-xs font-bold block">
            {isCheckedIn ? '✓ Check-in de Llegada Confirmado' : 'Confirmación de Arribo al Terreno / Inmueble'}
          </span>
          <p className="text-[11px] text-[#707060] mt-0.5">
            {isCheckedIn
              ? `Timestamp: ${new Date(project.checkinTime || '').toLocaleString('es-MX')}`
              : 'Presione el botón al llegar a la ubicación para registrar hora de inicio.'}
          </p>
        </div>

        {!isCheckedIn && (
          <button
            onClick={handlePerformCheckin}
            className="px-4 py-2 bg-[#5a5a40] hover:bg-[#484833] text-white font-extrabold rounded-xl text-xs shadow-sm shrink-0"
          >
            Realizar Check-in
          </button>
        )}
      </div>

      {/* Material Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#434338] uppercase tracking-wider flex items-center space-x-1.5">
            <CheckSquare className="w-4 h-4 text-[#5a5a40]" />
            <span>Checklist Pre-Instalación de Carga & Herramienta:</span>
          </h3>
          <span className="text-[11px] text-[#707060] font-semibold">
            {checklist.filter((c) => c.verified).length} de {checklist.length} Verificados
          </span>
        </div>

        <div className="space-y-2">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleToggleCheck(idx)}
              className={`p-3 rounded-xl border text-xs font-medium cursor-pointer flex items-center justify-between transition-all ${
                item.verified
                  ? 'bg-[#e2ebe0] border-[#c3d4c0] text-[#2d4d31] font-bold'
                  : 'bg-[#fbfbf9] border-[#e6e6df] text-[#434338] hover:bg-[#f5f5f0]'
              }`}
            >
              <span>{item.item}</span>
              <span className={`w-5 h-5 rounded-md border flex items-center justify-center font-bold ${
                item.verified ? 'bg-[#3d6e43] border-[#2d4d31] text-white' : 'border-[#d8d8ce]'
              }`}>
                {item.verified ? '✓' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
