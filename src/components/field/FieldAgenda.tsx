import React, { useState, useEffect } from 'react';
import { getWorkProjects, subscribeStorage } from '../../lib/storage';
import { WorkProject } from '../../types';
import { Calendar, MapPin, Navigation, Clock, Phone, Smartphone, ChevronRight } from 'lucide-react';

interface FieldAgendaProps {
  onSelectProject: (p: WorkProject) => void;
  selectedProjectId?: string;
}

export const FieldAgenda: React.FC<FieldAgendaProps> = ({ onSelectProject, selectedProjectId }) => {
  const [projects, setProjects] = useState<WorkProject[]>(getWorkProjects());

  useEffect(() => {
    const load = () => {
      setProjects(getWorkProjects());
    };
    load();
    return subscribeStorage(load);
  }, []);

  const getStatusBadge = (status: WorkProject['status']) => {
    switch (status) {
      case 'programada':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f0eb] text-[#707060]">PROGRAMADA</span>;
      case 'en_sitio':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e5ebf2] text-[#2b4c6f]">EN SITIO</span>;
      case 'en_proceso':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f5ebd7] text-[#704d19] animate-pulse">EN PROCESO</span>;
      case 'incidencia':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f5e2e2] text-[#702b2b]">INCIDENCIA</span>;
      case 'completada':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e2ebe0] text-[#2d4d31]">COMPLETADA</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Top Header */}
      <div className="bg-[#5a5a40] text-white p-5 rounded-2xl shadow-sm border border-[#4a4a34]">
        <div className="flex items-center space-x-2 text-[#d8d8ce] text-xs font-mono font-bold uppercase">
          <Smartphone className="w-4 h-4" />
          <span>INTERFAZ MÓVIL DE CAMPO</span>
        </div>
        <h1 className="text-xl font-bold mt-1 text-white">Agenda de Obras & Rutas de Instalación</h1>
        <p className="text-xs text-[#d8d8ce] mt-1">
          Calendario de obras asignadas a la Cuadrilla. Navegación directa con Google Maps / Waze.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-3">
        {projects.map((p) => {
          const isSelected = selectedProjectId === p.id;
          const mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`;

          return (
            <div
              key={p.id}
              className={`p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-white border-[#5a5a40] shadow-sm ring-2 ring-[#5a5a40]/30'
                  : 'bg-white border-[#e6e6df] hover:border-[#d8d8ce] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-[#5a5a40] block">{p.id}</span>
                  <h3 className="font-bold text-[#2a2a22] text-base">{p.clientName}</h3>
                </div>
                {getStatusBadge(p.status)}
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-[#707060]">
                <p className="flex items-center space-x-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#a1a194]" />
                  <span>{p.scheduledDate} a las {p.scheduledTime}</span>
                </p>

                <p className="flex items-start space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#a1a194] shrink-0 mt-0.5" />
                  <span>{p.address}</span>
                </p>

                <p className="text-[#2a2a22] font-semibold pt-1">
                  Metros: {p.totalMeters}m | Cuadrilla: {p.crewLeaderName}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-[#f0f0eb]">
                <a
                  href={mapSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#f5f5f0] hover:bg-[#eaeaE0] text-[#2a2a22] rounded-xl text-xs font-bold flex items-center space-x-1 border border-[#e6e6df]"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#5a5a40]" />
                  <span>Abrir Ruta GPS</span>
                </a>

                <button
                  onClick={() => onSelectProject(p)}
                  className="px-4 py-1.5 bg-[#5a5a40] hover:bg-[#484833] text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm"
                >
                  <span>Iniciar Trabajo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
