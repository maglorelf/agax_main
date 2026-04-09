import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Política de privacidade</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6 text-gray-700">

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Responsable do tratamento</h2>
            <p>
              <strong>Asociación Galega de Xadrecistas (AGAX)</strong>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Correo de contacto: <a href="mailto:info@agax.org" className="text-blue-600 hover:underline">info@agax.org</a>
            </p>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Finalidade</h2>
            <p>
              Os datos facilitados a través deste formulario serán utilizados exclusivamente para <strong>xestionar a participación no equipo AGAX en Lichess</strong> e para <strong>validar a identidade</strong> da persoa inscrita. Non serán cedidos a terceiros nin empregados para fins distintos aos indicados.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Inscrición de menores de 14 anos</h2>
            <p>
              A inscrición de persoas <strong>menores de 14 anos require a supervisión e o consentimento dun titor ou titora legal</strong>, que será responsable de facilitar os datos en nome do menor.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Dereitos de imaxe e publicación</h2>
            <p>
              O <strong>nick de Lichess e os resultados deportivos</strong> da persoa inscrita poderán aparecer nas <strong>crónicas e publicacións de agax.org</strong> e nos medios de difusión da asociación, no marco das actividades deportivas.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Cancelación e dereitos</h2>
            <p>
              Podes solicitar a <strong>eliminación dos teus datos</strong> ou exercer os teus dereitos de acceso, rectificación e oposición escribindo ao correo oficial:
            </p>
            <p className="mt-2">
              <a href="mailto:info@agax.org" className="text-blue-600 hover:underline font-medium">info@agax.org</a>
            </p>
          </section>

          <hr className="border-gray-100" />

          <p className="text-xs text-gray-400">
            Esta política está amparada polo Regulamento Xeral de Protección de Datos (RXPD / RGPD) da Unión Europea.
          </p>
        </div>

        <div className="mt-6 text-center">
          <a href="/registro-lichess" className="text-blue-600 hover:underline text-sm">
            ← Volver ao formulario de inscrición
          </a>
        </div>
      </div>
    </div>
  );
};
