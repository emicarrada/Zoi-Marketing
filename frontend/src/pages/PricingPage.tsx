const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Planes y Precios
        </h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Gratis</h3>
            <p className="text-4xl font-bold text-primary-600 mb-6">$0</p>
            <p className="text-gray-600 mb-6">Perfecto para empezar</p>
          </div>
          <div className="card p-8 text-center border-2 border-primary-600">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-4xl font-bold text-primary-600 mb-6">$29/mes</p>
            <p className="text-gray-600 mb-6">Para creadores serios</p>
          </div>
          <div className="card p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
            <p className="text-4xl font-bold text-primary-600 mb-6">$99/mes</p>
            <p className="text-gray-600 mb-6">Para equipos grandes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
