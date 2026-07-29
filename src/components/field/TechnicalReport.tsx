import React, { useState } from 'react';
import { addProjectPhoto, addProjectIncident, getWorkProjects } from '../../lib/storage';
import { WorkProject } from '../../types';
import { Camera, AlertTriangle, Plus, Image as ImageIcon, CheckCircle, Clock } from 'lucide-react';

interface TechnicalReportProps {
  project: WorkProject;
  onUpdateProject: (p: WorkProject) => void;
}

export const TechnicalReport: React.FC<TechnicalReportProps> = ({ project, onUpdateProject }) => {
  const [photoStage, setPhotoStage] = useState<'antes' | 'durante' | 'despues'>('antes');
  const [photoCaption, setPhotoCaption] = useState('');
  const [samplePhotoUrl, setSamplePhotoUrl] = useState('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600');

  const [incidentText, setIncidentText] = useState('');
  const [showIncidentInput, setShowIncidentInput] = useState(false);

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    addProjectPhoto(project.id, {
      stage: photoStage,
      url: samplePhotoUrl,
      caption: photoCaption || `Foto de ${photoStage.toUpperCase()} - Obra ${project.id}`,
    });

    const all = getWorkProjects();
    const curr = all.find((p) => p.id === project.id);
    if (curr) onUpdateProject(curr);
    setPhotoCaption('');
  };

  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentText.trim()) return;

    addProjectIncident(project.id, incidentText.trim());
    const all = getWorkProjects();
    const curr = all.find((p) => p.id === project.id);
    if (curr) onUpdateProject(curr);
    setIncidentText('');
    setShowIncidentInput(false);
  };

  return (
    <div className="space-y-6">
      {/* Photo Capture Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0f0eb] pb-3">
          <h2 className="text-base font-bold text-[#2a2a22] flex items-center space-x-2">
            <Camera className="w-5 h-5 text-[#5a5a40]" />
            <span>Evidencias Fotográficas de la Obra</span>
          </h2>
          <span className="text-xs font-semibold text-[#707060]">{project.photos.length} Fotos Registradas</span>
        </div>

        {/* Photo Upload Form */}
        <form onSubmit={handleAddPhoto} className="bg-[#f5f5f0] p-4 rounded-xl border border-[#e6e6df] space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#434338] mb-1">Etapa del Trabajo:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'antes', label: '1. ANTES (Sin cercar)' },
                { id: 'durante', label: '2. DURANTE (Postes)' },
                { id: 'despues', label: '3. DESPUÉS (Terminada)' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setPhotoStage(st.id as 'antes' | 'durante' | 'despues')}
                  className={`py-2 px-2 text-center rounded-lg font-bold border transition-all ${
                    photoStage === st.id
                      ? 'bg-[#5a5a40] text-white border-[#484833] shadow-sm'
                      : 'bg-white text-[#434338] border-[#e6e6df]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#434338] mb-1">Descripción / Nota de la Foto:</label>
            <input
              type="text"
              placeholder="Ej. Anclaje de poste con concreto en esquina norte"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              className="w-full px-3 py-2 border border-[#e6e6df] rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#5a5a40]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#5a5a40] hover:bg-[#484833] text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Capturar Evidencia</span>
          </button>
        </form>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {project.photos.map((p) => (
            <div key={p.id} className="border border-[#e6e6df] rounded-xl overflow-hidden bg-[#fbfbf9]">
              <img src={p.url} alt={p.caption} className="w-full h-36 object-cover" />
              <div className="p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#5a5a40] uppercase font-mono text-[10px]">{p.stage}</span>
                  <span className="text-[10px] text-[#a1a194]">{new Date(p.timestamp).toLocaleTimeString('es-MX')}</span>
                </div>
                <p className="text-[#2a2a22] font-semibold">{p.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Reporting Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#e6e6df] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#f0f0eb] pb-3">
          <h2 className="text-base font-bold text-[#2a2a22] flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-[#8a5d25]" />
            <span>Reporte de Incidencias en Obra</span>
          </h2>

          <button
            onClick={() => setShowIncidentInput(!showIncidentInput)}
            className="px-3 py-1.5 bg-[#f5f5f0] hover:bg-[#eaeaE0] text-[#702b2b] border border-[#e6c3c3] font-bold rounded-xl text-xs flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Notificar Imprevisto</span>
          </button>
        </div>

        {showIncidentInput && (
          <form onSubmit={handleAddIncident} className="bg-[#f5e2e2]/30 p-4 rounded-xl border border-[#e6c3c3] space-y-3 text-xs">
            <label className="block font-bold text-[#702b2b]">Describa la Incidencia / Cambio en Sitio:</label>
            <textarea
              rows={2}
              required
              placeholder="Ej. Rocas duras requieren rotomartillo, terreno desnivelado +0.5m..."
              value={incidentText}
              onChange={(e) => setIncidentText(e.target.value)}
              className="w-full p-2.5 border border-[#e6e6df] rounded-xl text-xs bg-white text-[#2a2a22]"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowIncidentInput(false)}
                className="px-3 py-1.5 text-xs text-[#707060]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs shadow-sm"
              >
                Registrar Incidencia
              </button>
            </div>
          </form>
        )}

        {/* Incidents List */}
        <div className="space-y-2">
          {project.incidents.map((inc) => (
            <div key={inc.id} className="p-3.5 rounded-xl bg-[#f5e2e2]/20 border border-[#e6c3c3] text-xs space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#702b2b]">
                <span className="font-bold">Reportado en Campo</span>
                <span>{new Date(inc.timestamp).toLocaleString('es-MX')}</span>
              </div>
              <p className="text-[#2a2a22] font-semibold">{inc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
