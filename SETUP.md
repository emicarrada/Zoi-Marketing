# 🚀 Guía de Configuración - Zoi Marketing

## 📋 Checklist de Configuración

### ✅ 1. Servicios Externos Requeridos

#### PostgreSQL
- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `zoi_marketing` creada
- [ ] Usuario y permisos configurados

```bash
# Instalar PostgreSQL en Fedora 42
sudo dnf install postgresql postgresql-server postgresql-contrib

# Inicializar y habilitar PostgreSQL
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Crear base de datos
sudo -u postgres createdb zoi_marketing

# O conectarse y crear manualmente
sudo -u postgres psql
CREATE DATABASE zoi_marketing;
\q
```

#### Ollama + Mistral 7B
- [ ] Ollama instalado
- [ ] Modelo Mistral 7B descargado
- [ ] Servicio corriendo en puerto 11434

```bash
# Instalar Ollama en Fedora 42
# Opción 1: Desde el repositorio oficial
curl -fsSL https://ollama.ai/install.sh | sh

# Opción 2: Usando DNF (si está disponible en repos)
# sudo dnf install ollama

# Descargar Mistral 7B
ollama pull mistral:7b

# Iniciar servicio
systemctl --user enable ollama
systemctl --user start ollama
# O ejecutar directamente:
ollama serve
```

#### Firebase (Opcional para testing local)
- [ ] Proyecto Firebase creado
- [ ] Authentication habilitado
- [ ] Google OAuth configurado (opcional)
- [ ] Credenciales obtenidas

#### Stripe (Opcional para testing local)
- [ ] Cuenta Stripe en modo test
- [ ] Claves de API obtenidas
- [ ] Webhooks configurados (opcional)

### ✅ 2. Variables de Entorno

#### Backend (.env)
```env
# Base de datos
DATABASE_URL="postgresql://username:password@localhost:5432/zoi_marketing"

# JWT
JWT_SECRET="your-super-secure-jwt-secret-key-here"
JWT_EXPIRES_IN="7d"

# Firebase (solo para autenticación con Firebase)
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL="your-firebase-client-email"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# AI/Ollama
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="mistral:7b"

# App Config
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### ✅ 3. Instalación y Setup

```bash
# 1. Instalar dependencias en Fedora 42
# PostgreSQL y herramientas de desarrollo
sudo dnf install postgresql postgresql-server nodejs npm curl git

# 2. Instalar dependencias del proyecto
cd backend && npm install
cd ../frontend && npm install

# 3. Configurar base de datos
cd backend
npx prisma generate
npx prisma migrate dev --name init

# 4. (Opcional) Ejecutar seed
npm run db:seed

# 5. Verificar servicios
curl http://localhost:11434/api/tags
sudo systemctl status postgresql
```

### ✅ 4. Ejecutar en Desarrollo

#### Opción A: Script automático
```bash
./dev-start.sh
```

#### Opción B: Manual
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev

# Terminal 3 - Base de datos (opcional)
cd backend && npm run db:studio
```

### ✅ 5. Verificar Funcionamiento

- [ ] Backend responde: http://localhost:3001/health
- [ ] Frontend carga: http://localhost:3000
- [ ] Ollama responde: http://localhost:11434/api/tags
- [ ] Base de datos conecta: Prisma Studio en http://localhost:5555

## 🎯 Configuración Mínima para Desarrollo

Si quieres probarlo rápidamente con configuración mínima:

1. **Solo PostgreSQL y Ollama obligatorios**
2. **Firebase y Stripe opcionales** (puedes usar datos mock)
3. **Variables de entorno mínimas:**

```env
# Backend .env mínimo
DATABASE_URL="postgresql://user:pass@localhost:5432/zoi_marketing"
JWT_SECRET="any-secret-key-for-development"
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="mistral:7b"

# Frontend .env mínimo
VITE_API_URL=http://localhost:3001/api
```

## 🔧 Troubleshooting

### Error: Cannot find module '@prisma/client'
```bash
cd backend && npx prisma generate
```

### Error: Database connection failed

- Verificar que PostgreSQL esté corriendo: `sudo systemctl status postgresql`
- Iniciar PostgreSQL: `sudo systemctl start postgresql`
- Verificar credenciales en DATABASE_URL
- Crear la base de datos si no existe

### Error: Ollama not responding

```bash
# Verificar servicio
systemctl --user status ollama

# Iniciar manualmente
ollama serve
# En otra terminal:
ollama pull mistral:7b
```

### Error: Firebase authentication
- Verificar credenciales en .env
- O comentar temporalmente las rutas que requieren Firebase

## 📚 Recursos Adicionales

- [Documentación Prisma](https://www.prisma.io/docs)
- [Ollama GitHub](https://github.com/ollama/ollama)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Stripe API Docs](https://stripe.com/docs/api)
