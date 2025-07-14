#!/bin/bash

echo "🚀 Iniciando Zoi Marketing en modo desarrollo..."

# Verificar si PostgreSQL está corriendo
echo "📊 Verificando PostgreSQL..."
if ! systemctl is-active --quiet postgresql; then
    echo "❌ PostgreSQL no está corriendo. Intentando iniciar..."
    if sudo systemctl start postgresql; then
        echo "✅ PostgreSQL iniciado correctamente"
    else
        echo "❌ Error al iniciar PostgreSQL. Verifica la instalación."
        echo "💡 En Fedora 42: sudo dnf install postgresql postgresql-server"
        echo "💡 Inicializar: sudo postgresql-setup --initdb"
        exit 1
    fi
fi

# Verificar si Ollama está corriendo
echo "🤖 Verificando Ollama..."
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "❌ Ollama no está corriendo. Por favor, inicia Ollama primero."
    echo "💡 Ejecuta: ollama serve"
    echo "💡 Y en otra terminal: ollama pull mistral:7b"
    exit 1
fi

echo "✅ Servicios externos verificados"

# Función para matar procesos hijos al salir
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $(jobs -p) 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Iniciar backend en background
# Guardar directorio actual
PROJECT_DIR=$(pwd)

echo "🔧 Iniciando backend..."
cd "$PROJECT_DIR/backend" && npm run dev &
BACKEND_PID=$!

# Esperar un poco para que el backend se inicie
sleep 3

# Iniciar frontend en background
echo "🎨 Iniciando frontend..."
cd "$PROJECT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 ¡Zoi Marketing está corriendo!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios"

# Esperar a que terminen los procesos
wait
