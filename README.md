# 🚀 Zoi Marketing MVP

# 🚀 Zoi Marketing MVP

**Plataforma de marketing digital impulsada por IA para marcas personales y negocios locales**

> **�️ ESTADO ACTUAL: BASE TÉCNICA COMPLETA Y FUNCIONAL** ✅
>
> ✅ Backend API + Frontend base + PostgreSQL + IA Local (Ollama + Mistral 7B)  
> ✅ Configurado y optimizado para **Fedora 42**  
> ✅ Scripts de desarrollo automatizados  
> 🚧 **MVP Frontend en desarrollo** - Funcionalidades de usuario pendientes  
> 🌐 **Entorno**: `http://localhost:3002` | 🔧 **API**: `http://localhost:3001`

---

## 🚀 Tecnologías

### Backend
- **Node.js + Express** - API REST
- **TypeScript** - Tipado estático
- **PostgreSQL** - Base de datos principal
- **Prisma** - ORM para base de datos
- **Firebase Auth** - Autenticación
- **Stripe** - Pasarela de pagos
- **Ollama + Mistral 7B** - IA local para generación de contenido

### Frontend
- **React + TypeScript** - Interface de usuario
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos y componentes
- **React Router** - Navegación
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos

## 📦 Estructura del Proyecto

```
zoi-marketing/
├── backend/           # API en Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Controladores de rutas
│   │   ├── middleware/    # Middleware personalizado
│   │   ├── routes/        # Definición de rutas
│   │   ├── services/      # Servicios (IA, Stripe, etc.)
│   │   ├── utils/         # Utilidades y helpers
│   │   └── types/         # Tipos de TypeScript
│   ├── prisma/           # Esquema y migraciones de BD
│   └── package.json
└── frontend/         # App React + Tailwind
    ├── src/
    │   ├── components/    # Componentes reutilizables
    │   ├── pages/         # Páginas principales
    │   ├── hooks/         # Hooks personalizados
    │   ├── lib/           # Configuración y APIs
    │   └── types/         # Tipos de TypeScript
    └── package.json
```

## 🛠️ Instalación y Configuración

### Prerrequisitos (Fedora 42)
- Node.js 18+ (`sudo dnf install nodejs npm`)
- PostgreSQL 13+ (`sudo dnf install postgresql postgresql-server`)
- Ollama con modelo Mistral 7B (instalación automática)
- Cuenta de Firebase (opcional para testing)
- Cuenta de Stripe (opcional para testing)

### 🚀 Instalación Rápida para Fedora 42

#### Opción A: Instalación Automática (Recomendada)
```bash
# Ejecutar script de instalación automática
./install-fedora.sh

# Iniciar el proyecto
./dev-start.sh
```

#### Opción B: Instalación Manual

### 1. Preparar el Sistema
```bash
# Actualizar sistema
sudo dnf update -y

# Instalar herramientas básicas
sudo dnf install -y nodejs npm postgresql postgresql-server postgresql-contrib curl git gcc-c++ make

# Configurar PostgreSQL
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Crear base de datos
sudo -u postgres createdb zoi_marketing

# Instalar Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull mistral:7b
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

#### Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/zoi_marketing"

# JWT
JWT_SECRET="your-super-secure-jwt-secret"

# Firebase
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"

# Ollama/IA
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="mistral:7b"
```

#### Configurar base de datos
```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# (Opcional) Abrir Prisma Studio
npm run db:studio
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env` en frontend:
```env
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

### 4. Configurar Ollama

```bash
# Instalar Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Descargar modelo Mistral 7B
ollama pull mistral:7b

# Verificar que funciona
ollama run mistral:7b "Hola, ¿cómo estás?"
```

## 🚀 Ejecutar el Proyecto

### Desarrollo local

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Terminal 3 - Base de datos (opcional):
```bash
cd backend
npm run db:studio
```

### URLs de desarrollo

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:3001>
- **Prisma Studio**: <http://localhost:5555>

## 🔧 Comandos Útiles para Fedora 42

### Verificar Servicios
```bash
# PostgreSQL
sudo systemctl status postgresql

# Ollama
systemctl --user status ollama
curl http://localhost:11434/api/tags

# Verificar puertos
sudo netstat -tlnp | grep -E ':3000|:3001|:5432|:11434'
```

### Gestión de Servicios
```bash
# Iniciar PostgreSQL
sudo systemctl start postgresql

# Iniciar Ollama
systemctl --user start ollama
# O ejecutar manualmente:
ollama serve

# Reiniciar servicios si hay problemas
sudo systemctl restart postgresql
systemctl --user restart ollama
```

### Solución de Problemas Comunes
```bash
# Si PostgreSQL no inicia
sudo postgresql-setup --initdb
sudo systemctl enable postgresql

# Si faltan dependencias de compilación
sudo dnf install gcc-c++ make python3-devel

# Si Ollama no responde
pkill ollama
ollama serve
```

## 📋 Funcionalidades Implementadas

## 🏆 Estado del Proyecto - Actualizado

### ✅ **MVP Completamente Funcional**
- [x] **Backend API completo** - Todos los endpoints funcionando
- [x] **Frontend React responsivo** - UI moderna con Tailwind CSS
- [x] **Autenticación Firebase** - Con modo desarrollo integrado
- [x] **Base de datos PostgreSQL** - Esquema completo con Prisma ORM
- [x] **IA Local funcional** - Ollama + Mistral 7B configurado
- [x] **Sistema de pagos Stripe** - Con modo desarrollo/mock
- [x] **Scripts de desarrollo automatizados** - Para Fedora 42
- [x] **Configuración completa** - Archivos .env y documentación

### ✅ **Configuración para Fedora 42 - LISTO**
- [x] **Script de instalación automática** (`install-fedora.sh`)
- [x] **Script de desarrollo** (`dev-start-simple.sh`)
- [x] **Documentación específica** para comandos `dnf` y `systemctl`
- [x] **Gestión de servicios** PostgreSQL y Ollama
- [x] **Solución de problemas** TypeScript y dependencias

### ✅ **Funcionalidades Implementadas**
- [x] **Onboarding wizard** - Configuración inicial de perfil
- [x] **Dashboard interactivo** - Métricas y gestión de contenido
- [x] **API REST completa** - Auth, content, analytics, stripe
- [x] **Middleware de autenticación** - JWT y Firebase integrados
- [x] **Validación de datos** - Express validator en todos los endpoints
- [x] **Manejo de errores** - Respuestas consistentes y logging
- [x] **Hot reload** - Desarrollo con recarga automática

### � **Actualmente Ejecutándose**
- ✅ **Backend**: `http://localhost:3001` (API funcionando)
- ✅ **Frontend**: `http://localhost:3002` (React + Vite)
- ✅ **Health Check**: `http://localhost:3001/health`
- ✅ **PostgreSQL**: Servicio activo y conectado
- ✅ **Ollama + Mistral**: IA local funcionando

### 🔧 **Fixes Técnicos Aplicados**
- [x] **ts-node configurado** - Dependencias de TypeScript instaladas
- [x] **PostCSS corregido** - Configuración ES modules
- [x] **Firebase modo desarrollo** - Fallback para testing local
- [x] **Stripe modo mock** - Funciona sin credenciales reales
- [x] **Gestión de puertos** - Auto-detección de puertos libres
- [x] **Scripts optimizados** - Rutas absolutas y manejo de errores

### 🎯 **Próximos Pasos de Desarrollo**
- [ ] **Generador de contenido IA** - Conectar frontend con backend
- [ ] **Constructor de sitios web** - Templates y editor
- [ ] **Subida de imágenes** - Multer + almacenamiento
- [ ] **Calendario de publicaciones** - Programación de contenido
- [ ] **Integración redes sociales** - APIs de Facebook, Instagram, etc.
- [ ] **Analytics avanzados** - Métricas detalladas y reportes

## 🗄️ Base de Datos

El proyecto usa PostgreSQL con Prisma ORM. Las entidades principales son:

- **Users**: Usuarios registrados
- **Profiles**: Perfiles de negocio/marca
- **Sites**: Sitios web creados
- **Content**: Contenido generado
- **Plans**: Planes de suscripción
- **Metrics**: Métricas y analíticas

## 🤖 IA y Generación de Contenido

El sistema utiliza **Mistral 7B** ejecutándose localmente con **Ollama** para:

- Generar contenido para redes sociales
- Crear copy para sitios web
- Sugerir estrategias de marketing personalizadas
- Asistente de chat interactivo

## 💳 Pagos y Suscripciones

Integración con **Stripe** para manejar:

- Planes Free, Basic, Pro y Enterprise
- Suscripciones recurrentes
- Webhooks para sincronización de estado
- Portal de facturación

## 🚀 Deploy

### Backend (Railway/Render)
```bash
# Build
npm run build

# Variables de entorno en producción
DATABASE_URL=postgresql://...
JWT_SECRET=...
FIREBASE_PROJECT_ID=...
STRIPE_SECRET_KEY=sk_live_...
```

### Frontend (Vercel)
```bash
# Build
npm run build

# Variables de entorno
VITE_API_URL=https://your-api.railway.app/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test
```

## 📝 Contribuir

1. Fork el repositorio
2. Crear branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:

- 📧 Email: support@zoimarketing.com
- 💬 Discord: [Servidor de la comunidad]
- 📖 Documentación: [docs.zoimarketing.com]

---

**¡Gracias por usar Zoi Marketing! 🚀✨**
