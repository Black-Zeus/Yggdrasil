from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from middlewares.auth_middleware import AuthMiddleware

from config.routes import register_routes
from config.openapi import custom_openapi
from config.middlewares import register_middlewares
from config.exceptions import register_exception_handlers

# Inicializa FastAPI con metadatos
app = FastAPI(
    title="API de Conectividad con la Base de Datos del Sistema",
    description="API encargada de gestionar la conectividad y acceso a la base de datos del sistema, con múltiples endpoints para manejar datos específicos.",
    version="1.0.0",
    docs_url="/swagger",
    redoc_url=None,
    openapi_url="/openapi.json",
)

# Registrar middlewares (CORS + autenticación personalizada)
register_middlewares(app)

# Registrar rutas agrupadas por módulo
register_routes(app)

# Registrar manejo global de excepciones
register_exception_handlers(app)

# Generar y personalizar el esquema OpenAPI
app.openapi = lambda: custom_openapi(app)