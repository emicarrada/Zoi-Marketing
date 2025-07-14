# Zoi Marketing MVP

Plataforma de marketing digital impulsada por IA para marcas personales y negocios locales.

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

### Prerrequisitos
- Node.js 18+
- PostgreSQL 13+
- Ollama con modelo Mistral 7B
- Cuenta de Firebase
- Cuenta de Stripe (modo test)

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd zoi-marketing
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
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio**: http://localhost:5555

## 📋 Funcionalidades Implementadas

### ✅ MVP Básico
- [x] Autenticación con Firebase (email + Google)
- [x] Onboarding wizard para configurar perfil
- [x] Dashboard con métricas básicas
- [x] Conexión con IA local (Ollama + Mistral)
- [x] Estructura de base de datos completa
- [x] API REST con todos los endpoints
- [x] Interface responsive con Tailwind

### 🔄 En Desarrollo
- [ ] Generador de contenido con IA funcional
- [ ] Constructor de sitios web
- [ ] Integración completa con Stripe
- [ ] Subida de imágenes
- [ ] Calendario de publicaciones
- [ ] Analíticas y métricas

### 🎯 Próximas Características
- [ ] Templates de sitios web
- [ ] Integración con redes sociales
- [ ] Editor de contenido avanzado
- [ ] Sistema de notificaciones
- [ ] Panel de administración

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
