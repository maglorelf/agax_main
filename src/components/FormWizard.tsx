import React, { useState } from 'react';
import { UserFormData, FormErrors } from '../types';
import { INITIAL_FORM_DATA, STEPS } from '../constants';
import { Input } from './Input';
import { Button } from './Button';
import { submitToGoogleSheet } from '../services/sheetService';
import { SuccessStep } from './SuccessStep';
import { ChevronRight, ChevronLeft, User, ShieldCheck, FileText } from 'lucide-react';

export const FormWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'O nome é obrigatorio';
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo electrónico non válido';
      if (!formData.lichessUsername.trim()) newErrors.lichessUsername = 'Usuario en Lichess obrigatorio';
      else if (formData.lichessUsername.includes(' ')) newErrors.lichessUsername = 'O usuario non pode ter espazos';
    }

     if (step === 2) {
       // Validation for step 2 if needed (e.g. mandatory year)
       if(!formData.birthYear) newErrors.birthYear = 'O ano de nacemento é obrigatorio para categorías';
     }

    if (step === 3) {
      if (!formData.rgpdAccepted) newErrors.rgpdAccepted = 'Debes aceptar a política de privacidade para continuar';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    const response = await submitToGoogleSheet(formData);
    setIsSubmitting(false);

    if (response.result === 'success') {
      setIsSuccess(true);
    } else {
      alert(response.message || 'Produciuse un erro ao enviar o formulario.');
    }
  };

  if (isSuccess) {
    return <SuccessStep formData={formData} />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl w-full mx-auto">
      {/* Header / Progress Bar */}
      <div className="bg-gray-50 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Alta no equipo de Lichess</h1>
          <span className="text-sm font-medium text-gray-500">Paso {currentStep} de 3</span>
        </div>
        
        {/* Progress Indicators */}
        <div className="flex items-center gap-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex-1">
              <div className={`h-2 rounded-full transition-all duration-300 ${s.id <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 min-h-[400px]">
        {/* Step 1: Personal Data */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Datos persoais</h2>
            </div>
            
            <div className="grid gap-5">
              <Input
                label="Nome completo"
                name="fullName"
                placeholder="Ex. Magnus Carlsen"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />
              <Input
                label="Correo electrónico"
                name="email"
                type="email"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              <Input
                label="Usuario en Lichess"
                name="lichessUsername"
                placeholder="Ex. DrNykterstein"
                value={formData.lichessUsername}
                onChange={handleChange}
                error={errors.lichessUsername}
              />
              <p className="text-xs text-gray-500 -mt-3">
                É crucial que sexa exacto para poder admitirte no equipo.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Verification Data */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Control e verificación</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Ano de nacemento"
                    name="birthYear"
                    type="number"
                    placeholder="YYYY"
                    value={formData.birthYear}
                    onChange={handleChange}
                    error={errors.birthYear}
                  />
                 <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ¿És socio de AGAX?
                    </label>
                    <select
                      name="isAgaxMember"
                      value={formData.isAgaxMember}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Non">Non</option>
                      <option value="Si">Si</option>
                      <option value="En tramitación">En tramitación</option>
                    </select>
                 </div>
              </div>

              <Input
                label="Club / Procedencia"
                name="clubName"
                placeholder="Ej. Escuela Kasparov / Independiente"
                value={formData.clubName}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentarios adicionais
                </label>
                <textarea
                  name="comments"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Algunha dúbida ou información extra..."
                  value={formData.comments}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Confirmar datos</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4 text-sm text-gray-700">
               <div className="flex justify-between border-b pb-2">
                 <span className="font-semibold">Nome:</span>
                 <span>{formData.fullName}</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                 <span className="font-semibold">Correo electrónico:</span>
                 <span>{formData.email}</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                 <span className="font-semibold">Lichess:</span>
                 <span className="font-mono bg-gray-200 px-1 rounded">{formData.lichessUsername}</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                 <span className="font-semibold">Ano de nacemento:</span>
                 <span>{formData.birthYear}</span>
               </div>
               <div className="flex justify-between border-b pb-2">
                 <span className="font-semibold">Clube:</span>
                 <span>{formData.clubName || '-'}</span>
               </div>
               <div className="flex justify-between pb-2">
                 <span className="font-semibold">Socio AGAX:</span>
                 <span>{formData.isAgaxMember}</span>
               </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="rgpdAccepted"
                  name="rgpdAccepted"
                  checked={formData.rgpdAccepted}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="rgpdAccepted" className="text-sm text-gray-700 cursor-pointer">
                  Lin e acepto a{' '}
                  <a
                    href="/politica-privacidade"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    política de privacidade
                  </a>{' '}
                  de AGAX. Entendo que os meus datos serán utilizados para xestionar a miña participación no equipo Lichess.
                </label>
              </div>
              {errors.rgpdAccepted && (
                <p className="text-xs text-red-500 ml-7">{errors.rgpdAccepted}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className={currentStep === 1 ? 'invisible' : ''}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Atrás
        </Button>

        {currentStep < 3 ? (
          <Button onClick={handleNext}>
            Seguinte
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} isLoading={isSubmitting} variant="primary" className="bg-green-600 hover:bg-green-700">
            Finalizar inscrición
          </Button>
        )}
      </div>
    </div>
  );
};