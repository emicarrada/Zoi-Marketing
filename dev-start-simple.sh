#!/bin/bash

# 🚀 Script de desarrollo simplificado para Zoi Marketing
echo "🚀 Iniciando Zoi Marketing en modo desarrollo..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directorio base del proyecto
PROJECT_DIR="/home/carrada/Escritorio/Zoi-Marketing"

echo -e "${BLUE}📋 Verificando servicios externos...${NC}"

# Verificar PostgreSQL
if systemctl is-active --quiet postgresql; then
    echo -e "${GREEN}✅ PostgreSQL está corriendo${NC}"
else
    echo -e "${YELLOW}⚠️ PostgreSQL no está corriendo. Intentando iniciar...${NC}"
    if sudo systemctl start postgresql; then
        echo -e "${GREEN}✅ PostgreSQL iniciado${NC}"
    else
        echo -e "${RED}❌ Error al iniciar PostgreSQL${NC}"
        exit 1
    fi
fi

# Verificar Ollama
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo -e "${GREEN}✅ Ollama está corriendo${NC}"
else
    echo -e "${YELLOW}⚠️ Ollama no responde. Asegúrate de que esté corriendo${NC}"
    echo -e "${YELLOW}💡 Ejecuta: ollama serve${NC}"
fi

echo -e "${BLUE}🔧 Iniciando servicios...${NC}"

# Función para limpiar procesos al salir
cleanup() {
    echo -e "${YELLOW}🛑 Deteniendo servicios...${NC}"
    pkill -f "tsx.*server.ts" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    exit 0
}

# Capturar señales para limpiar al salir
trap cleanup SIGINT SIGTERM

# Iniciar backend
echo -e "${GREEN}🔧 Iniciando backend...${NC}"
cd "$PROJECT_DIR/backend"
npx tsx watch src/server.ts &
BACKEND_PID=$!

# Esperar un poco para que el backend se inicie
sleep 3

# Iniciar frontend
echo -e "${GREEN}🎨 Iniciando frontend...${NC}"
cd "$PROJECT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}🎉 ¡Zoi Marketing está corriendo!${NC}"
echo ""
echo -e "${BLUE}📱 URLs disponibles:${NC}"
echo -e "  🌐 Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "  🔧 Backend:  ${GREEN}http://localhost:3001${NC}"
echo -e "  📊 Health:   ${GREEN}http://localhost:3001/health${NC}"
echo ""
echo -e "${YELLOW}💡 Presiona Ctrl+C para detener todos los servicios${NC}"
echo ""

# Mantener el script corriendo
wait
