import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { PrivacyPolicyContent } from '../components/PrivacyPolicyContent';

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

        <div className="bg-white rounded-2xl shadow-md p-8">
          <PrivacyPolicyContent />
        </div>
      </div>
    </div>
  );
};
