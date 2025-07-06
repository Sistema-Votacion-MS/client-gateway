# 🗳️ Client Gateway - Sistema de Votaciones Electrónicas

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">
  API Gateway construido con NestJS para el Sistema de Votaciones Electrónicas basado en microservicios
</p>

<p align="center">
  <a href="https://github.com/Sistema-Votacion-MS/client-gateway" target="_blank">
    <img src="https://img.shields.io/github/license/Sistema-Votacion-MS/client-gateway" alt="License" />
  </a>
  <a href="https://github.com/Sistema-Votacion-MS/client-gateway" target="_blank">
    <img src="https://img.shields.io/github/stars/Sistema-Votacion-MS/client-gateway" alt="Stars" />
  </a>
  <a href="https://github.com/Sistema-Votacion-MS/client-gateway/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/Sistema-Votacion-MS/client-gateway" alt="Issues" />
  </a>
</p>

## 📋 Descripción

El **Client Gateway** es el punto de entrada principal para el Sistema de Votaciones Electrónicas. Actúa como API Gateway que centraliza y orquesta las comunicaciones entre el cliente y los microservicios del sistema, proporcionando autenticación, autorización y enrutamiento de peticiones.

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───►│  Client Gateway  │───►│  Microservicios │
│   (React/Vue)   │    │    (NestJS)      │    │   (Auth, User,  │
└─────────────────┘    └──────────────────┘    │  Election, etc) │
                              │                 └─────────────────┘
                              ▼
                       ┌──────────────────┐
                       │   NATS Server    │
                       │  (Message Bus)   │
                       └──────────────────┘
```

## ✨ Características

### 🔐 Seguridad y Autenticación
- **JWT Authentication**: Autenticación basada en tokens JWT
- **Role-based Access Control (RBAC)**: Control de acceso basado en roles (ADMIN, VOTER)
- **Guards y Decoradores**: Protección automática de rutas y endpoints
- **Validación de datos**: Validación robusta con class-validator

### 🚀 Funcionalidades Principales
- **Gestión de Usuarios**: CRUD completo con control de permisos
- **Gestión de Elecciones**: Creación, consulta y administración de elecciones
- **Gestión de Candidatos**: Administración de candidatos por elección
- **Sistema de Votación**: Proceso seguro de emisión de votos
- **Documentación Automática**: Swagger/OpenAPI integrado

### 🔄 Comunicación entre Microservicios
- **NATS**: Message broker para comunicación asíncrona
- **RPC Pattern**: Comunicación request-response entre servicios
- **Error Handling**: Manejo robusto de errores distribuidos

## 🛠️ Tecnologías

- **Framework**: NestJS 11.x
- **Runtime**: Node.js 20+
- **Message Broker**: NATS
- **Authentication**: JWT
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Container**: Docker

## 📡 Endpoints API

### 🔑 Autenticación (`/auth`)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Registro de usuarios | Público |
| POST | `/auth/login` | Inicio de sesión | Público |

### 👥 Usuarios (`/users`)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| GET | `/users` | Listar usuarios | Admin |
| GET | `/users/:id` | Obtener usuario | Admin/Own |
| POST | `/users` | Crear usuario | Admin |
| PATCH | `/users/:id` | Actualizar usuario | Admin/Own |
| DELETE | `/users/:id` | Eliminar usuario | Admin |

### 🗳️ Elecciones (`/election`)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| GET | `/election` | Listar elecciones | Público |
| GET | `/election/:id` | Obtener elección | Público |
| POST | `/election` | Crear elección | Admin |
| PUT | `/election/:id` | Actualizar elección | Admin |
| DELETE | `/election/:id` | Eliminar elección | Admin |
| GET | `/election/:id/voters/:uid` | Verificar votante | Admin/Own |

### 👤 Candidatos (`/candidate`)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| GET | `/candidate` | Listar candidatos | Público |
| GET | `/candidate/:id` | Obtener candidato | Público |
| POST | `/candidate` | Crear candidato | Admin |
| PUT | `/candidate/:id` | Actualizar candidato | Admin |
| DELETE | `/candidate/:id` | Eliminar candidato | Admin |

### 🗳️ Votos (`/votes`)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| POST | `/votes` | Emitir voto | Voter |
| GET | `/votes` | Listar todos los votos | Admin |
| GET | `/votes/:id` | Obtener voto específico | Admin |

## 🚦 Control de Acceso

### Roles del Sistema
- **ADMIN**: Acceso completo al sistema
- **VOTER**: Acceso limitado para votantes

### Políticas de Seguridad
- Los votantes solo pueden acceder a su propia información
- Los administradores tienen acceso completo
- Los endpoints públicos no requieren autenticación
- Validación de JWT en cada petición protegida

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js 20+
- Docker y Docker Compose
- NATS Server

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/Sistema-Votacion-MS/client-gateway.git
cd client-gateway

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Variables de Entorno

```bash
# Puerto del servidor
PORT=3000

# Servidores NATS (separados por comas)
NATS_SERVERS=nats://localhost:4222

# Secreto JWT (cambiar en producción)
JWT_SECRET=your-super-secret-key-here
```

### Ejecución en Desarrollo

```bash
# Modo desarrollo con hot reload
npm run start:dev

# Modo producción
npm run start:prod
```

## 🐳 Despliegue con Docker

### Docker Compose (Recomendado)

```bash
# Construir y ejecutar
npm run docker:deploy

# O manualmente
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar servicios
docker-compose down
```

### Scripts NPM Disponibles

```bash
# Docker
npm run docker:build          # Construir imagen
npm run docker:build:clean    # Construir imagen limpia
npm run docker:up             # Ejecutar contenedores
npm run docker:down           # Parar contenedores
npm run docker:down:clean     # Parar y limpiar
npm run docker:logs           # Ver logs
npm run docker:restart        # Reiniciar servicios
npm run docker:deploy         # Build + Run
npm run docker:deploy:clean   # Deploy limpio

# Desarrollo
npm run start:dev             # Desarrollo con hot reload
npm run start:debug           # Debug mode
npm run build                 # Construir aplicación
npm run lint                  # Linter
npm run test                  # Tests unitarios
npm run test:e2e              # Tests E2E
```

### Scripts de Despliegue Automatizado

```bash
# Windows PowerShell
.\deploy.ps1

# Linux/Mac Bash
./deploy.sh
```

## 📊 Servicios Incluidos

Una vez desplegado, tendrás acceso a:

- **🌐 API Gateway**: http://localhost:3000
- **📚 Swagger Docs**: http://localhost:3000/api/docs
- **📡 NATS Monitoring**: http://localhost:8222

## 🔍 Documentación API

La documentación interactiva de la API está disponible en:
- **Swagger UI**: `http://localhost:3000/api/docs`
- **OpenAPI JSON**: `http://localhost:3000/api/docs-json`

### Características de la Documentación
- Interfaz interactiva para probar endpoints
- Autenticación JWT integrada
- Esquemas de datos detallados
- Ejemplos de requests/responses

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests E2E
npm run test:e2e

# Tests en modo watch
npm run test:watch
```

## 📁 Estructura del Proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── decorators/      # Decoradores personalizados
│   ├── dto/             # Data Transfer Objects
│   ├── guards/          # Guards de seguridad
│   └── interfaces/      # Interfaces TypeScript
├── candidate/           # Módulo de candidatos
├── common/              # Código compartido
│   ├── dto/            # DTOs comunes
│   └── exceptions/     # Filtros de excepciones
├── config/              # Configuración de la app
├── election/            # Módulo de elecciones
├── transports/          # Configuración NATS
├── users/               # Módulo de usuarios
├── votes/               # Módulo de votación
├── app.module.ts        # Módulo principal
└── main.ts              # Punto de entrada
```

## 🔧 Configuración Avanzada

### Guards Globales
```typescript
// Aplicados automáticamente a toda la aplicación
JwtAuthGuard    // Autenticación JWT
RolesGuard      // Control de acceso por roles
```

### Decoradores Disponibles
```typescript
@Public()                    // Endpoint público
@Roles(RoleEnum.ADMIN)      // Solo administradores
@CurrentUser()              // Inyectar usuario actual
```

### Filtros de Excepciones
- **RpcCustomExceptionFilter**: Manejo de errores de microservicios
- **HttpExceptionFilter**: Manejo de errores HTTP estándar

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código
- Usar TypeScript estricto
- Seguir las convenciones de NestJS
- Documentar todas las funciones públicas
- Escribir tests para nuevas funcionalidades

## 📝 Changelog

### v1.0.0 (Actual)
- ✅ Implementación inicial del API Gateway
- ✅ Autenticación y autorización JWT
- ✅ Integración con microservicios via NATS
- ✅ Documentación Swagger completa
- ✅ Docker deployment ready

## 🐛 Problemas Conocidos

- Consultar [Issues en GitHub](https://github.com/Sistema-Votacion-MS/client-gateway/issues)

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/Sistema-Votacion-MS/client-gateway/issues)
- **Documentation**: [Swagger Docs](http://localhost:3000/api/docs)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

<p align="center">
  Hecho con ❤️ por el equipo de Sistema de Votaciones Electrónicas
</p>
