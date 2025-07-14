#!/bin/bash

# 🐧 Script de instalación para Fedora 42 - Zoi Marketing
echo "🐧 Configurando Zoi Marketing en Fedora 42..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${BLUE}🔄 Actualizando sistema...${NC}"
sudo dnf update -y

echo -e "${BLUE}📦 Instalando dependencias del sistema...${NC}"

# Instalar herramientas básicas
sudo dnf install -y curl wget git gcc-c++ make

# Instalar Node.js y npm
if ! command_exists node; then
    echo -e "${YELLOW}📦 Instalando Node.js...${NC}"
    sudo dnf install -y nodejs npm
    echo -e "${GREEN}✅ Node.js $(node --version) instalado${NC}"
else
    echo -e "${GREEN}✅ Node.js ya está instalado: $(node --version)${NC}"
fi

# Instalar PostgreSQL
if ! command_exists psql; then
    echo -e "${YELLOW}🗄️ Instalando PostgreSQL...${NC}"
    sudo dnf install -y postgresql postgresql-server postgresql-contrib
    
    # Inicializar PostgreSQL
    echo -e "${YELLOW}🔧 Inicializando PostgreSQL...${NC}"
    sudo postgresql-setup --initdb
    
    # Habilitar y iniciar PostgreSQL
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
    
    echo -e "${GREEN}✅ PostgreSQL instalado y configurado${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL ya está instalado${NC}"
    # Asegurar que esté corriendo
    if ! systemctl is-active --quiet postgresql; then
        sudo systemctl start postgresql
    fi
fi

# Instalar Ollama
if ! command_exists ollama; then
    echo -e "${YELLOW}🤖 Instalando Ollama...${NC}"
    curl -fsSL https://ollama.ai/install.sh | sh
    
    # Configurar como servicio de usuario
    systemctl --user enable ollama
    systemctl --user start ollama
    
    echo -e "${GREEN}✅ Ollama instalado${NC}"
else
    echo -e "${GREEN}✅ Ollama ya está instalado${NC}"
fi

# Configurar base de datos
echo -e "${BLUE}🗄️ Configurando base de datos...${NC}"
sudo -u postgres createdb zoi_marketing 2>/dev/null || echo -e "${YELLOW}⚠️ Base de datos ya existe${NC}"

# Instalar dependencias del proyecto
echo -e "${BLUE}📦 Instalando dependencias del proyecto...${NC}"

# Backend
if [ -d "backend" ]; then
    echo -e "${YELLOW}🔧 Instalando dependencias del backend...${NC}"
    cd backend && npm install
    cd ..
    echo -e "${GREEN}✅ Dependencias del backend instaladas${NC}"
fi

# Frontend  
if [ -d "frontend" ]; then
    echo -e "${YELLOW}🎨 Instalando dependencias del frontend...${NC}"
    cd frontend && npm install
    cd ..
    echo -e "${GREEN}✅ Dependencias del frontend instaladas${NC}"
fi

# Descargar modelo de IA
echo -e "${BLUE}🧠 Descargando modelo Mistral 7B...${NC}"
if systemctl --user is-active --quiet ollama; then
    ollama pull mistral:7b
    echo -e "${GREEN}✅ Modelo Mistral 7B descargado${NC}"
else
    echo -e "${YELLOW}⚠️ Iniciando Ollama...${NC}"
    ollama serve &
    sleep 5
    ollama pull mistral:7b
    echo -e "${GREEN}✅ Modelo Mistral 7B descargado${NC}"
fi

# Configurar archivos de entorno
echo -e "${BLUE}⚙️ Configurando archivos de entorno...${NC}"

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Archivo backend/.env creado${NC}"
fi

if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:3001/api
EOF
    echo -e "${GREEN}✅ Archivo frontend/.env creado${NC}"
fi

# Configurar base de datos con Prisma
if [ -d "backend" ]; then
    echo -e "${BLUE}🔧 Configurando Prisma...${NC}"
    cd backend
    npx prisma generate
    npx prisma migrate dev --name init
    cd ..
    echo -e "${GREEN}✅ Prisma configurado${NC}"
fi

echo ""
echo -e "${GREEN}🎉 ¡Instalación completada en Fedora 42!${NC}"
echo ""
echo -e "${BLUE}📋 Resumen de servicios instalados:${NC}"
echo -e "  🗄️ PostgreSQL: $(psql --version | head -1)"
echo -e "  📦 Node.js: $(node --version)"
echo -e "  🤖 Ollama: $(ollama --version 2>/dev/null || echo 'Instalado')"
echo ""
echo -e "${BLUE}🚀 Para iniciar el proyecto:${NC}"
echo -e "  ${GREEN}./dev-start.sh${NC}"
echo ""
echo -e "${BLUE}🔗 URLs una vez iniciado:${NC}"
echo -e "  🌐 Frontend: http://localhost:3000"
echo -e "  🔧 Backend: http://localhost:3001"
echo -e "  📊 Prisma Studio: http://localhost:5555"
echo ""
echo -e "${YELLOW}💡 Nota: Edita los archivos .env con tus credenciales reales para producción${NC}"
