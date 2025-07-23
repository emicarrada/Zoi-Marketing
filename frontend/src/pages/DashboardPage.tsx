import { useState, useEffect } from 'react';
import { BarChart3, Users, Globe, Sparkles } from 'lucide-react';
import { dashboardAPI, contentAPI } from '../lib/api';
// import { useAuth } from '../hooks/useAuth';
import type { DashboardData } from '../types';

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  // const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
    loadContentSuggestions();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await dashboardAPI.getData();
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContentSuggestions = async () => {
    try {
      const response = await contentAPI.getSuggestions();
      if (response.data?.suggestions) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalSites: 0,
    totalContent: 0,
    publishedSites: 0,
    contentGenerated: 0,
    sitesCreated: 0,
    pageViews: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola{data?.profile?.businessName ? `, ${data.profile.businessName}` : ''}!
          </h1>
          <p className="text-gray-600 mt-2">
            Aquí tienes un resumen de tu progreso en marketing
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contenido Generado</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.contentGenerated || 0}</p>
              </div>
              <Sparkles className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sitios Creados</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalSites || 0}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sitios Publicados</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.publishedSites || 0}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vistas Totales</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.pageViews || 0}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Suggestions */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Sugerencias de Contenido
            </h2>
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.slice(0, 5).map((suggestion, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{suggestion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Completa tu perfil para recibir sugerencias personalizadas
              </p>
            )}
          </div>

          {/* Recent Content */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Contenido Reciente
            </h2>
            {data?.recentContent && data.recentContent.length > 0 ? (
              <div className="space-y-3">
                {data.recentContent.slice(0, 5).map((content) => (
                  <div key={content.id} className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">{content.title}</h3>
                    <p className="text-sm text-gray-600">{content.type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Aún no has creado contenido. ¡Empieza ahora!
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="card p-6 text-left hover:shadow-lg transition-shadow">
              <Sparkles className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Generar Contenido</h3>
              <p className="text-sm text-gray-600">
                Crea publicaciones para redes sociales con IA
              </p>
            </button>

            <button className="card p-6 text-left hover:shadow-lg transition-shadow">
              <Globe className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Crear Sitio Web</h3>
              <p className="text-sm text-gray-600">
                Construye tu sitio web en minutos
              </p>
            </button>

            <button className="card p-6 text-left hover:shadow-lg transition-shadow">
              <BarChart3 className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Ver Analíticas</h3>
              <p className="text-sm text-gray-600">
                Analiza el rendimiento de tu contenido
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
