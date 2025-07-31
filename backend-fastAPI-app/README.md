# Backend FastAPI App - Documentación de la API

## Descripción
Este proyecto implementa un backend para la gestión de objetos en cajones utilizando FastAPI, SQLAlchemy y PostgreSQL. Proporciona una API REST para la gestión de usuarios, cajones, tipos de objetos, objetos y recomendaciones basadas en IA con OpenAI.

## Estructura del Proyecto
```bash
app/
├── core/                     # Configuraciones y elementos centrales
│   ├── config.py             # Configuración de la aplicación
│   ├── constants.py          # Constantes globales
│   ├── database.py           # Configuración de la base de datos
│   ├── exceptions.py         # Excepciones personalizadas
│   └── logging.py            # Configuración de logging
├── domain/                   # Lógica de dominio
│   ├── controls/             # Controladores de dominio
│   ├── dao_control.py        # Control de acceso a datos
│   └── models/               # Modelos de datos (SQLAlchemy)
├── interfaces/               # Interfaces de la aplicación
│   ├── api/                  # Definición de la API
│   │   ├── v1/               # Endpoints versión 1
│   │   └── v2/               # Endpoints versión 2
│   └── schemas/              # Esquemas de datos (Pydantic)
├── lib/                      # Bibliotecas compartidas
│   └── token_header.py       # Gestión de tokens JWT
├── utils/                    # Utilidades generales
│   └── openai.py             # Cliente para OpenAI
├── __init__.py
└── main.py                   # Punto de entrada de la aplicación
```

## Requisitos previos
- Python 3.9+
- PostgreSQL
- Entorno virtual (opcional pero recomendado)

## Configuración
1. Clonar el repositorio
2. Crear un entorno virtual e instalar dependencias:
   ```bash
   python -m venv virtual
   source virtual/bin/activate  # En Windows: virtual\Scripts\activate
   pip install -r requirements.txt
   ```
3. Configurar variables de entorno (crear archivo `.env` en la raíz):
   ```
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=drawer_manager_db
   VALID_TOKENS=["token1", "token2"]
   JWT_SECRET_KEY=your_secret_key
   OPENAI_API_KEY=your_openai_api_key  # Opcional para funciones de IA
   ```

## Ejecución
```bash
uvicorn run:app --reload
```

## Documentación de la API

### Autenticación
La API utiliza dos mecanismos de autenticación:
1. **Token de API (X-Token)**: Para acceso general a la API
2. **JWT (Bearer token)**: Para autenticación de usuarios

Todas las rutas (excepto aquellas marcadas explícitamente) requieren el encabezado `X-Token` con un token válido.

### Endpoints de Usuarios (v1/users)

#### Registro de usuario
- **Endpoint:** `POST /v1/users/create`
- **Descripción:** Crea un nuevo usuario y genera automáticamente un token JWT
- **Body:**
  ```json
  {
    "dni": "12345678",
    "username": "usuario1",
    "email": "usuario@ejemplo.com",
    "password": "contraseña"
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "User created successfully",
    "dni": "12345678",
    "access_token": "eyJhbGciOiJIUzI...",
    "token_type": "bearer"
  }
  ```

#### Inicio de sesión
- **Endpoint:** `POST /v1/users/login`
- **Descripción:** Autentica un usuario y genera un token JWT
- **Body:**
  ```json
  {
    "username": "usuario1",
    "password": "contraseña"
  }
  ```
- **Respuesta:**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI...",
    "token_type": "bearer"
  }
  ```

#### Obtener información del usuario actual
- **Endpoint:** `GET /v1/users/me`
- **Descripción:** Devuelve información del usuario autenticado
- **Auth:** Bearer token (JWT)
- **Respuesta:**
  ```json
  {
    "dni": "12345678",
    "username": "usuario1",
    "email": "usuario@ejemplo.com"
  }
  ```

#### Obtener usuario por nombre de usuario
- **Endpoint:** `GET /v1/users/get/{username}`
- **Descripción:** Obtiene información de un usuario por su nombre de usuario
- **Respuesta:** Datos serializados del usuario

### Endpoints de Cajones (v1/drawers)

#### Crear cajón
- **Endpoint:** `POST /v1/drawers/create`
- **Descripción:** Crea un nuevo cajón para el usuario autenticado
- **Auth:** Bearer token (JWT)
- **Body:**
  ```json
  {
    "name": "Mi Cajón",
    "description": "Descripción del cajón",
    "size": "MEDIUM",
    "max_obj": 10
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Drawer created successfully"
  }
  ```

#### Listar cajones del usuario
- **Endpoint:** `GET /v1/drawers/`
- **Descripción:** Obtiene todos los cajones del usuario autenticado
- **Auth:** Bearer token (JWT)
- **Parámetros de consulta:**
  - `skip`: Número de cajones a saltar (default: 0)
  - `limit`: Número máximo de cajones a devolver (default: 100)
- **Respuesta:** Lista de cajones serializados

#### Obtener cajón por ID
- **Endpoint:** `GET /v1/drawers/{drawer_id}`
- **Descripción:** Obtiene información detallada de un cajón específico
- **Auth:** Bearer token (JWT)
- **Respuesta:** Datos serializados del cajón

#### Actualizar cajón
- **Endpoint:** `PUT /v1/drawers/{drawer_id}`
- **Descripción:** Actualiza un cajón existente
- **Auth:** Bearer token (JWT)
- **Body:** Campos a actualizar
- **Respuesta:**
  ```json
  {
    "message": "Drawer updated successfully"
  }
  ```

#### Eliminar cajón
- **Endpoint:** `DELETE /v1/drawers/{drawer_id}`
- **Descripción:** Elimina un cajón y todos sus objetos
- **Auth:** Bearer token (JWT)
- **Respuesta:**
  ```json
  {
    "message": "Drawer deleted successfully"
  }
  ```

### Endpoints de Tipos de Objetos (v1/object-types)

#### Crear tipo de objeto
- **Endpoint:** `POST /v1/object-types/create`
- **Descripción:** Crea un nuevo tipo de objeto
- **Auth:** Bearer token (JWT)
- **Body:**
  ```json
  {
    "name": "Herramienta",
    "description": "Herramientas manuales"
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Object type created successfully"
  }
  ```

#### Listar tipos de objetos
- **Endpoint:** `GET /v1/object-types/`
- **Descripción:** Obtiene todos los tipos de objetos disponibles
- **Parámetros de consulta:**
  - `skip`: Número de tipos a saltar (default: 0)
  - `limit`: Número máximo de tipos a devolver (default: 100)
- **Respuesta:** Lista de tipos de objetos serializados

#### Obtener tipo de objeto por ID
- **Endpoint:** `GET /v1/object-types/{type_id}`
- **Descripción:** Obtiene información de un tipo de objeto específico
- **Respuesta:** Datos serializados del tipo de objeto

#### Actualizar tipo de objeto
- **Endpoint:** `PUT /v1/object-types/{type_id}`
- **Descripción:** Actualiza un tipo de objeto existente
- **Auth:** Bearer token (JWT)
- **Body:** Campos a actualizar
- **Respuesta:**
  ```json
  {
    "message": "Object type updated successfully"
  }
  ```

#### Eliminar tipo de objeto
- **Endpoint:** `DELETE /v1/object-types/{type_id}`
- **Descripción:** Elimina un tipo de objeto
- **Auth:** Bearer token (JWT)
- **Respuesta:**
  ```json
  {
    "message": "Object type deleted successfully"
  }
  ```

### Endpoints de Objetos (v1/objects)

#### Crear objeto
- **Endpoint:** `POST /v1/objects/create`
- **Descripción:** Crea un nuevo objeto en un cajón
- **Auth:** Bearer token (JWT)
- **Parámetros de consulta:**
  - `drawer_id`: ID del cajón donde se guardará el objeto
- **Body:**
  ```json
  {
    "name": "Martillo",
    "description": "Martillo de carpintero",
    "object_type_id": 1,
    "size_concept": "SMALL"
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Object created successfully"
  }
  ```

#### Listar objetos de un cajón
- **Endpoint:** `GET /v1/objects/drawer/{drawer_id}`
- **Descripción:** Obtiene todos los objetos de un cajón específico
- **Auth:** Bearer token (JWT)
- **Parámetros de consulta:**
  - `skip`: Número de objetos a saltar (default: 0)
  - `limit`: Número máximo de objetos a devolver (default: 100)
  - `sort_by_name`: Ordenar por nombre (default: false)
- **Respuesta:** Lista de objetos serializados

#### Obtener objeto por ID
- **Endpoint:** `GET /v1/objects/{object_id}`
- **Descripción:** Obtiene información detallada de un objeto específico
- **Auth:** Bearer token (JWT)
- **Respuesta:** Datos serializados del objeto

#### Actualizar objeto
- **Endpoint:** `PUT /v1/objects/{object_id}`
- **Descripción:** Actualiza un objeto existente
- **Auth:** Bearer token (JWT)
- **Body:** Campos a actualizar
- **Respuesta:**
  ```json
  {
    "message": "Object updated successfully"
  }
  ```

#### Eliminar objeto
- **Endpoint:** `DELETE /v1/objects/{object_id}`
- **Descripción:** Elimina un objeto
- **Auth:** Bearer token (JWT)
- **Respuesta:**
  ```json
  {
    "message": "Object deleted successfully"
  }
  ```

#### Mover objeto a otro cajón
- **Endpoint:** `POST /v1/objects/{object_id}/move/{drawer_id}`
- **Descripción:** Mueve un objeto a otro cajón
- **Auth:** Bearer token (JWT)
- **Respuesta:**
  ```json
  {
    "message": "Object moved successfully"
  }
  ```

### Endpoints de Historial de Acciones (v1/action-history)

#### Obtener historial de acciones del usuario
- **Endpoint:** `GET /v1/action-history/`
- **Descripción:** Obtiene todas las acciones realizadas por el usuario autenticado
- **Auth:** Bearer token (JWT)
- **Respuesta:** Lista de acciones serializadas

#### Obtener acciones por tipo
- **Endpoint:** `GET /v1/action-history/type/{action_type}`
- **Descripción:** Obtiene acciones del usuario filtradas por tipo
- **Auth:** Bearer token (JWT)
- **Respuesta:** Lista de acciones serializadas

#### Obtener acción por ID
- **Endpoint:** `GET /v1/action-history/{action_id}`
- **Descripción:** Obtiene información detallada de una acción específica
- **Auth:** Bearer token (JWT)
- **Respuesta:** Datos serializados de la acción

#### Eliminar acción
- **Endpoint:** `DELETE /v1/action-history/{action_id}`
- **Descripción:** Elimina un registro de acción
- **Auth:** Bearer token (JWT)
- **Respuesta:**
  ```json
  {
    "message": "Action history entry deleted successfully"
  }
  ```

### Endpoints de Recomendaciones IA (v1/ai)

#### Obtener recomendaciones para un cajón
- **Endpoint:** `POST /v1/ai/drawer-recommendations`
- **Descripción:** Analiza un cajón y proporciona recomendaciones de organización utilizando IA
- **Auth:** Bearer token (JWT)
- **Body:**
  ```json
  {
    "drawer_id": 1
  }
  ```
- **Respuesta:**
  ```json
  {
    "recomendaciones": [
      "Eliminar objetos duplicados",
      "Ordenar objetos por tipo"
    ],
    "mensajes": [
      "Se encontraron 3 objetos duplicados"
    ],
    "acciones": {
      "eliminar_duplicados": true,
      "ordenar_por_tipo": true,
      "ordenar_por_tamanio": false
    }
  }
  ```

#### Aplicar recomendaciones
- **Endpoint:** `POST /v1/ai/apply-recommendations`
- **Descripción:** Aplica las recomendaciones generadas por la IA
- **Auth:** Bearer token (JWT)
- **Body:**
  ```json
  {
    "drawer_id": 1,
    "actions": {
      "eliminar_duplicados": true,
      "ordenar_por_tipo": true,
      "ordenar_por_tamanio": false
    }
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Recommendations applied successfully",
    "results": {
      "duplicates_removed": 2,
      "sorted_by_type": true
    }
  }
  ```

## Consideraciones para el Despliegue

### Producción
Para un entorno de producción, asegúrate de:
- Usar una clave secreta fuerte para JWT
- Configurar CORS adecuadamente
- Usar HTTPS
- Usar PostgreSQL en un servidor dedicado o servicio gestionado

### Docker
El proyecto incluye un Dockerfile para facilitar el despliegue:
```bash
docker build -t backend-fastapi-app .
docker run -p 8000:8000 --env-file .env backend-fastapi-app
```

## Integración con OpenAI
La aplicación integra OpenAI para proporcionar recomendaciones inteligentes para la organización de cajones. Para activar esta funcionalidad:

1. Configura tu clave API de OpenAI en las variables de entorno:
   ```
   OPENAI_API_KEY=tu-clave-api-de-openai
   OPENAI_ORGANIZATION=tu-id-de-organizacion (opcional)
   ```

2. Utiliza los endpoints de recomendaciones descritos anteriormente.

## Licencia
Este proyecto está licenciado bajo los términos de la licencia MIT.