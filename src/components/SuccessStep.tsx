import React from 'react';
import { LICHESS_TEAM_URL } from '../constants';
import { Button } from './Button';
import { UserFormData } from '../types';
import { Check, ExternalLink, Copy } from 'lucide-react';

interface SuccessStepProps {
  formData: UserFormData;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ formData }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`Ola, son ${formData.fullName} e rexistreime no formulario web.`);
    alert("Mensaxe copiada ao portapapeis");
  };

  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Rexistro recibido!</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-lg mx-auto">
        <h3 className="font-semibold text-blue-900 mb-2">Seguinte paso: Lichess</h3>
        <p className="text-blue-800 mb-4 text-sm">
          Os teus datos gardáronse correctamente. Agora debes unirte ao equipo en Lichess para finalizar o proceso.
        </p>
        
        <div className="flex flex-col gap-3">
           <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">O teu nome de usuario</div>
           <div className="bg-white p-2 rounded border font-mono text-gray-800">{formData.lichessUsername}</div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 mb-2">Fai clic abaixo para acceder á páxina do equipo:</p>
        
        <a 
          href={LICHESS_TEAM_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block"
        >
          <Button variant="primary" className="text-lg px-8 py-4">
            Ir a Lichess.org / AGAX Aberto
            <ExternalLink className="ml-2 w-5 h-5" />
          </Button>
        </a>

        <div className="mt-8 pt-8 border-t border-gray-200">
           <p className="text-sm text-gray-500 mb-4">
             Se che piden unha mensaxe de presentación, podes copiar esta:
           </p>
           <button 
             onClick={copyToClipboard}
             className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
           >
             <Copy className="mr-2 h-4 w-4 text-gray-500" />
             Copiar mensaxe de presentación
           </button>
        </div>
      </div>
    </div>
  );
};