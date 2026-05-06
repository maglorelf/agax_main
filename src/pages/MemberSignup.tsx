import React, { useMemo, useState } from 'react';
import { Check, ChevronRight, FileText, UserRound, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MemberSignupErrors, MemberSignupFormData } from '../types';
import { submitMemberSignupToGoogleSheet } from '../services/sheetService';

const INITIAL_MEMBER_DATA: MemberSignupFormData = {
  fullName: '',
  birthDate: '',
  dniNie: '',
  email: '',
  phone: '',
  requestDate: new Date().toISOString().split('T')[0],
  signatureName: '',
  guardianName: '',
  privacyAccepted: false,
  mediaPermissionAccepted: false
};

const calculateIsMinor = (birthDate: string): boolean => {
  if (!birthDate) return false;

  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age < 18;
};

export const MemberSignup: React.FC = () => {
  const [formData, setFormData] = useState<MemberSignupFormData>(INITIAL_MEMBER_DATA);
  const [errors, setErrors] = useState<MemberSignupErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isMinor = useMemo(() => calculateIsMinor(formData.birthDate), [formData.birthDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof MemberSignupErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));

    if (errors[name as keyof MemberSignupErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: MemberSignupErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'O nome e apelidos é obrigatorio.';
    if (!formData.birthDate) newErrors.birthDate = 'A data de nacemento é obrigatoria.';
    if (!formData.dniNie.trim()) newErrors.dniNie = 'O DNI/NIE é obrigatorio.';
    if (!formData.phone.trim()) newErrors.phone = 'O teléfono é obrigatorio.';
    if (!formData.requestDate) newErrors.requestDate = 'A data da solicitude é obrigatoria.';
    if (!formData.signatureName.trim()) newErrors.signatureName = 'A sinatura/firma é obrigatoria.';

    if (isMinor && !formData.guardianName.trim()) {
      newErrors.guardianName = 'Para menores de 18 anos, o nome do titor é obrigatorio.';
    }

    if (!formData.mediaPermissionAccepted) {
      newErrors.mediaPermissionAccepted = 'Debes aceptar o permiso de publicación de resultados/fotografías.';
    }

    if (!formData.privacyAccepted) {
      newErrors.privacyAccepted = 'Debes aceptar a cláusula de protección de datos para continuar.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    const response = await submitMemberSignupToGoogleSheet(formData);
    setIsSubmitting(false);

    if (response.result === 'success') {
      setIsSuccess(true);
      return;
    }

    alert(response.message || 'Produciuse un erro ao enviar a alta de socio.');
  };

  if (isSuccess) {
    return (
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 sm:p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Solicitude enviada</h1>
          <p className="text-gray-700 mb-3">
            Recibimos a túa solicitude de alta como socio/a de AGAX.
          </p>
          <p className="text-gray-600 text-sm">
            O rexistro está configurado en modo simulado ata que se complete a URL de REXISTRO_SOCIOS_AGAX.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-6 sm:px-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Faite socio</h1>
            </div>
            <p className="text-sm text-gray-600">ASOCIACION GALEGA DE AXEDRECISTAS (AGAX) - www.agax.org</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
            <section className="space-y-4 text-gray-800 leading-relaxed">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserRound className="w-5 h-5 text-gray-700" />
                Información
              </h2>
              <p>
                AGAX e unha asociación sen ánimo de lucro, que ten por finalidade promover o xadrez e os xogos de mesa en Galicia,
                porque consideramos é unha boa actividade para todas as idades.
              </p>
              <p>
                Facendote socio axudas o noso funcionamento organizando torneos aos que poderás inscribirte gratuitamente.
                Se nos facilitas un correo electrónico avisaremoste de todos os torneos que organice AGAX e tamen de outros que sepamos.
                Tamen podes participar nos torneos online. Os datos que facilites solo se utilizaran para os fins da asociación.
                Teléfono de contacto 981150168.
              </p>
              <p>
                A cuota e anual, actualmente de cinco euros para menores de idade e dez para maiores.
              </p>
              <p>
                Podes facer un ingreso na cuenta da asociación IBAN ES32-2080-0000-7730-0193-1837.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Datos da solicitude</h2>

              <Input
                label="Nome e apelidos"
                name="fullName"
                placeholder="Nome completo"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Data de nacemento"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  error={errors.birthDate}
                />
                <Input
                  label="DNI/NIE"
                  name="dniNie"
                  placeholder="Ex. 12345678A"
                  value={formData.dniNie}
                  onChange={handleChange}
                  error={errors.dniNie}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Correo electrónico (opcional)"
                  name="email"
                  type="email"
                  placeholder="correo@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="Tfno"
                  name="phone"
                  type="tel"
                  placeholder="981150168"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Data desta solicitude"
                  name="requestDate"
                  type="date"
                  value={formData.requestDate}
                  onChange={handleChange}
                  error={errors.requestDate}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
                <Input
                  label="Sinatura"
                  name="signatureName"
                  placeholder="Nome de quen asina"
                  value={formData.signatureName}
                  onChange={handleChange}
                  error={errors.signatureName}
                />
              </div>

              <Input
                label={isMinor ? 'Firmado (titor/a, obrigatorio por menor de idade)' : 'Firmado (titor/a, opcional)'}
                name="guardianName"
                placeholder="Nome do pai/nai ou titor legal"
                value={formData.guardianName}
                onChange={handleChange}
                error={errors.guardianName}
              />

            </section>

            <section className="space-y-4 text-gray-800 leading-relaxed">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gray-700" />
                Texto legal e autorizacións
              </h2>

              <p>
                Os socios ou os seus titores dan permiso para publicar resultados e fotografias de torneos ou actividades
                nos que participen, sempre co fin de promocionar o xadrez.
              </p>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="mediaPermissionAccepted"
                  name="mediaPermissionAccepted"
                  checked={formData.mediaPermissionAccepted}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="mediaPermissionAccepted" className="text-sm text-gray-700 cursor-pointer">
                  Acepto esta autorización para publicación de resultados e fotografias.
                </label>
              </div>
              {errors.mediaPermissionAccepted && (
                <p className="text-xs text-red-500">{errors.mediaPermissionAccepted}</p>
              )}

              <p>
                De conformidade co establecido no artigo 5 da Lei Orgánica 15/1999, os datos de carácter persoal declarados
                pasarán a formar parte do ficheiro de socios, do que o responsable do tratamento será AGAX. A sua finalidade
                e uso será a xestión de socios, autorizando a utilización do teléfono e correo electrónico para avisos e
                comunicación por parte de AGAX. Os datos non serán cedidos a outras entidades. Os dereitos de acceso,
                rectificación, cancelación e oposición os datos persoais rexistrados no ficheiro poderanse exercer por
                comunicación escrita dirixida a AGAX nos termos establecidos nos artigos 15-16-17 da devandita Lei.
              </p>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="privacyAccepted"
                  name="privacyAccepted"
                  checked={formData.privacyAccepted}
                  onChange={handleCheckboxChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="privacyAccepted" className="text-sm text-gray-700 cursor-pointer">
                  Lin e acepto a cláusula de protección de datos.
                </label>
              </div>
              {errors.privacyAccepted && <p className="text-xs text-red-500">{errors.privacyAccepted}</p>}
            </section>

            <div className="pt-2 flex justify-end">
              <Button type="submit" isLoading={isSubmitting} className="bg-green-600 hover:bg-green-700">
                Enviar solicitude
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
