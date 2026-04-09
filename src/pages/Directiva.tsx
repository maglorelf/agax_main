import React from 'react';

const MEMBROS = [
  { cargo: 'Presidente',    nome: 'Luis Rodríguez Díaz' },
  { cargo: 'Vicepresidente', nome: 'Francisco Javier García Veiras' },
  { cargo: 'Secretario',    nome: 'Manuel Andión Muinelo' },
  { cargo: 'Tesoureiro',    nome: 'Marcos Javier Martínez Ramos' },
  { cargo: 'Vocal',         nome: 'Daniel Codesido Sánchez' },
  { cargo: 'Vocal',         nome: 'Pablo Furelos Diéguez' },
];

export const Directiva: React.FC = () => {
  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">

        {/* Page header */}
        <div className="rounded-xl text-white text-center py-10 px-6 mb-8"
          style={{ background: 'linear-gradient(135deg, #006699 0%, #004466 100%)' }}>
          <h1 className="text-4xl font-extrabold">Xunta Directiva</h1>
        </div>

        {/* Intro text */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-gray-700 space-y-3">
          <p>
            <strong>
              Na Asemblea Extraordinaria de AGAX celebrada o trinta e un de agosto de 2025,
              adoptáronse os seguintes acordos por unanimidade dos presentes:
            </strong>
          </p>
          <p>
            <strong>
              Primeiro.– Renovación da XUNTA DIRECTIVA. Cesan os actuais e queda constituída así:
            </strong>
          </p>
        </div>

        {/* Members grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MEMBROS.map((m, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-blue-600 mb-1">{m.cargo}</p>
              <p className="text-xl font-bold text-gray-800">{m.nome}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
