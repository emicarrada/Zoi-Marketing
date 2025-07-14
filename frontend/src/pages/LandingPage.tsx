import { Link } from 'react-router-dom';
import { Sparkles, Target, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">Zoi Marketing</span>
          </div>
          <Link 
            to="/login" 
            className="btn btn-primary"
          >
            Iniciar Sesión
          </Link>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Impulsa tu marca con <span className="text-primary-600">IA inteligente</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crea contenido viral, sitios web profesionales y estrategias de marketing 
            personalizadas con la potencia de la inteligencia artificial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login" 
              className="btn btn-primary text-lg px-8 py-3"
            >
              Comenzar Gratis
            </Link>
            <Link 
              to="/pricing" 
              className="btn btn-secondary text-lg px-8 py-3"
            >
              Ver Planes
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Todo lo que necesitas para hacer crecer tu negocio
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Contenido con IA</h3>
            <p className="text-gray-600">
              Genera publicaciones para redes sociales, blogs y emails que 
              conviertan, adaptados a tu marca y audiencia.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-secondary-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Sitios Web Rápidos</h3>
            <p className="text-gray-600">
              Crea sitios web profesionales en minutos con nuestro constructor 
              inteligente y templates optimizados para conversión.
            </p>
          </div>

          <div className="card p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Estrategia Personalizada</h3>
            <p className="text-gray-600">
              Recibe recomendaciones de marketing basadas en tu tipo de negocio, 
              audiencia y objetivos específicos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para transformar tu marketing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a cientos de emprendedores que ya están creciendo con Zoi Marketing
          </p>
          <Link 
            to="/login" 
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Comenzar Ahora - Es Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-xl font-bold">Zoi Marketing</span>
          </div>
          <p className="text-gray-400">
            © 2025 Zoi Marketing. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
