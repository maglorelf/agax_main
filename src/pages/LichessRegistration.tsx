import React from 'react';
import { FormWizard } from '../components/FormWizard';

export const LichessRegistration: React.FC = () => {
  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="text-center mb-10 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Inscripción al Equipo Online
        </h1>
        <p className="text-lg text-gray-600">
          Para mantener un entorno seguro y organizado, necesitamos verificar algunos datos antes de aceptar tu solicitud en Lichess.
        </p>
      </div>

      <FormWizard />

      <div className="mt-12 text-center text-sm text-gray-500">
          <p>¿Tienes problemas?</p>
          <a href="mailto:info@agax.org" className="text-blue-600 hover:underline">Contactar con soporte</a>
      </div>
    </div>
  );
};
