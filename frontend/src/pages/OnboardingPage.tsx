import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
// import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../lib/api';
import toast from 'react-hot-toast';
import type { OnboardingData } from '../types';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    businessType: '',
    businessName: '',
    targetAudience: '',
    tone: 'professional',
    primaryColors: [],
    description: '',
    goals: []
  });

  // const { user } = useAuth();
  const navigate = useNavigate();

  const businessTypes = [
    'Marca Personal',
    'Negocio Local',
    'E-commerce',
    'Servicios Profesionales',
    'Restaurante/Café',
    'Fitness/Wellness',
    'Tecnología',
    'Otro'
  ];

  const tones = [
    { value: 'casual', label: 'Casual y Cercano' },
    { value: 'professional', label: 'Profesional' },
    { value: 'friendly', label: 'Amigable' },
    { value: 'formal', label: 'Formal' }
  ];

  const goalOptions = [
    'Aumentar seguidores en redes sociales',
    'Generar más ventas online',
    'Mejorar la visibilidad de marca',
    'Crear contenido viral',
    'Automatizar marketing',
    'Construir autoridad en mi nicho'
  ];

  const steps = [
    'Tipo de Negocio',
    'Información Básica',
    'Audiencia y Tono',
    'Objetivos'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await userAPI.updateProfile(formData);
      toast.success('¡Perfil configurado exitosamente!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Error al guardar el perfil. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.businessType !== '';
      case 1:
        return formData.businessName !== '';
      case 2:
        return formData.targetAudience !== '' && formData.tone !== '';
      case 3:
        return formData.goals.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Qué tipo de negocio tienes?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {businessTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => updateFormData('businessType', type)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    formData.businessType === type
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Cuéntanos sobre tu negocio
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de tu negocio o marca
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                className="input"
                placeholder="Ej: Mi Tienda Online"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción breve (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className="input min-h-[100px]"
                placeholder="Describe en pocas palabras qué haces..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Audiencia y Tono
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Quién es tu audiencia principal?
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => updateFormData('targetAudience', e.target.value)}
                className="input"
                placeholder="Ej: Jóvenes profesionales de 25-35 años"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ¿Qué tono prefieres para tu contenido?
              </label>
              <div className="space-y-2">
                {tones.map((tone) => (
                  <button
                    key={tone.value}
                    onClick={() => updateFormData('tone', tone.value)}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-colors ${
                      formData.tone === tone.value
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ¿Cuáles son tus objetivos principales?
            </h2>
            <p className="text-gray-600 mb-4">Selecciona todos los que apliquen:</p>
            <div className="space-y-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => {
                    const currentGoals = formData.goals;
                    const updatedGoals = currentGoals.includes(goal)
                      ? currentGoals.filter(g => g !== goal)
                      : [...currentGoals, goal];
                    updateFormData('goals', updatedGoals);
                  }}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-colors flex items-center justify-between ${
                    formData.goals.includes(goal)
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span>{goal}</span>
                  {formData.goals.includes(goal) && (
                    <Check className="h-5 w-5 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              Paso {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="card p-8">
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>
                {currentStep === steps.length - 1 
                  ? (loading ? 'Guardando...' : 'Finalizar')
                  : 'Siguiente'
                }
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
