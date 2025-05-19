from fastapi import APIRouter, HTTPException, Depends, Header, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from datetime import datetime, timezone
import os

from utils.security import verify_jwt_token
from utils.dbConfig import get_db, db_config
from utils.redisConfig import redis_client
from dependencies.response_handler import create_response
from dependencies.response_logger import log_response
from dependencies.constants import (  # 📌 Importamos constantes para evitar Magic Strings
    ENV_NAME,
    SUCCESS_API_HEALTH,
    SUCCESS_DB_CONNECTION,
    SUCCESS_REDIS_CONNECTION,
    SUCCESS_DB_CONFIG,
    SUCCESS_REDIS_CONFIG,
    SUCCESS_JWT_VALIDATION,
    ERROR_DB_CONNECTION,
    ERROR_REDIS_CONNECTION,
    ERROR_AUTH_INVALID_TOKEN,
    ERROR_ENV_RESTRICTED
)

from utils.mixed import is_dev_environment

router = APIRouter(
    prefix="/health",
    tags=["Health Check"]  # 👈 Agrupación visual en Swagger
)

# ==============================
# 🔹 Endpoint de Salud General
# ==============================
@router.get("/", response_class=JSONResponse,
    summary="Estado general de la API",
    description="""
Verifica que la API principal esté activa y operativa. 
Retorna información básica como nombre, rol, estado y timestamp.
"""
)
async def health_check(request: Request):
    response = {
        "name": "API de Conectividad con la Base de Datos del Sistema",
        "role": "Gestión y acceso a la base de datos del sistema",
        "status": "active",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "1.0.0",
    }

    log_response("success", 200, SUCCESS_API_HEALTH, request.scope["path"], response)
    return create_response("success", 200, SUCCESS_API_HEALTH, request, response)

# ==============================
# 🔹 Verificación de Conectividad a la Base de Datos
# ==============================
@router.get("/db", response_class=JSONResponse,
    summary="Verificar conexión a la base de datos",
    description="""
Prueba de conectividad con la base de datos utilizando una consulta básica.
Retorna estado de conexión y timestamp.
"""
)
async def health_db(request: Request, db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        response = {
            "name": "Base de Datos",
            "status": "connected",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        log_response("success", 200, SUCCESS_DB_CONNECTION, request.scope["path"], response)
        return create_response("success", 200, SUCCESS_DB_CONNECTION, request, response)

    except Exception as e:
        error_response = {
            "name": "Base de Datos",
            "status": "disconnected",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        log_response("error", 500, ERROR_DB_CONNECTION, request.scope["path"], error_response)
        raise HTTPException(status_code=500, detail=error_response)

# ==============================
# 🔹 Verificación de Conectividad a Redis
# ==============================
@router.get("/redis", response_class=JSONResponse,
    summary="Verificar conexión a Redis",
    description="""
Realiza un ping al servidor Redis para comprobar su disponibilidad.
Retorna estado de conexión y timestamp.
"""
)
async def health_redis(request: Request):
    try:
        if redis_client.ping():
            response = {
                "name": "Redis",
                "status": "connected",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
            log_response("success", 200, SUCCESS_REDIS_CONNECTION, request.scope["path"], response)
            return create_response("success", 200, SUCCESS_REDIS_CONNECTION, request, response)

    except Exception as e:
        error_response = {
            "name": "Redis",
            "status": "disconnected",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        log_response("error", 500, ERROR_REDIS_CONNECTION, request.scope["path"], error_response)
        raise HTTPException(status_code=500, detail=error_response)

# ==============================
# 🔹 Endpoints de Configuración (Solo en Desarrollo)
# ==============================
@router.get("/db-config", response_class=JSONResponse,
    summary="Mostrar configuración de base de datos (solo dev)",
    description="""
Devuelve los parámetros de conexión actuales a la base de datos. 
Solo está disponible en entornos de desarrollo para auditoría o debugging.
"""
)
async def show_db_config(request: Request):
    if not is_dev_environment():
        raise HTTPException(status_code=403, detail=ERROR_ENV_RESTRICTED)

    response = {
        "environment": ENV_NAME,
        "database": db_config.database_name,
        "user": os.getenv("MYSQL_USER"),
        "host": os.getenv("MYSQL_HOST"),
        "port": os.getenv("MYSQL_PORT"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    log_response("success", 200, SUCCESS_DB_CONFIG, request.scope["path"], response)
    return create_response("success", 200, SUCCESS_DB_CONFIG, request, response)

@router.get("/redis-config", response_class=JSONResponse,
    summary="Mostrar configuración de Redis (solo dev)",
    description="""
Devuelve los parámetros actuales de conexión a Redis. 
Este endpoint está restringido a entornos de desarrollo.
""")
async def show_redis_config(request: Request):
    if not is_dev_environment():
        raise HTTPException(status_code=403, detail=ERROR_ENV_RESTRICTED)

    response = {
        "environment": ENV_NAME,
        "db": os.getenv("REDIS_DB"),
        "host": os.getenv("REDIS_HOST"),
        "port": os.getenv("REDIS_PORT"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    log_response("success", 200, SUCCESS_REDIS_CONFIG, request.scope["path"], response)
    return create_response("success", 200, SUCCESS_REDIS_CONFIG, request, response)

# ==============================
# 🔹 Endpoint para Validar JWT (Solo en Desarrollo)
# ==============================
@router.get("/validate-jwt", response_class=JSONResponse,
    summary="Validar JWT (solo dev)",
    description="""
Permite validar y decodificar un token JWT recibido en el header Authorization.
Disponible únicamente en entornos de desarrollo.
""")
async def validate_jwt(request: Request, authorization: str = Header(None)):
    if not is_dev_environment():
        raise HTTPException(status_code=403, detail=ERROR_ENV_RESTRICTED)

    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail=ERROR_AUTH_INVALID_TOKEN)

    token = authorization.removeprefix("Bearer ").strip()

    try:
        payload = verify_jwt_token(token)
        response = {
            "message": SUCCESS_JWT_VALIDATION,
            "token_data": payload,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        log_response("success", 200, SUCCESS_JWT_VALIDATION, request.scope["path"], response)
        return create_response("success", 200, SUCCESS_JWT_VALIDATION, request, response)

    except HTTPException as e:
        log_response("error", e.status_code, ERROR_AUTH_INVALID_TOKEN, request.scope["path"], {"error": str(e.detail)})
        raise

    except Exception as e:
        log_response("error", 500, "Error inesperado en validación de JWT", request.scope["path"], {"error": str(e)})
        raise HTTPException(status_code=500, detail="Error inesperado en validación de JWT")
