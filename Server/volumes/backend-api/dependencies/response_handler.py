import uuid
from datetime import datetime, timezone
from fastapi.responses import JSONResponse
from fastapi import Request
from dependencies.response_logger import log_response
from dependencies.constants import (
    RESPONSE_TYPE_SINGLE,
    RESPONSE_TYPE_COLLECTION,
    DEFAULT_RESPONSE_NAME,
    ERROR_NOT_FOUND,
    RESPONSE_STATUS_ERROR,
    ENV_NAME,
    ENV
)

def get_client_ip(request: Request) -> str:
    """
    Recupera la IP real del cliente desde los headers o desde el socket.
    Considera uso de proxies o balanceadores (X-Forwarded-For).
    """
    x_forwarded_for = request.headers.get("x-forwarded-for")
    if x_forwarded_for:
        # Puede haber múltiples IPs separadas por coma, se toma la primera
        ip = x_forwarded_for.split(",")[0].strip()
    else:
        # Fallback al cliente directo
        ip = request.client.host or "0.0.0.0"
    return ip


def generate_trace(request: Request, user: dict = None):
    """
    Genera un bloque de trazabilidad único para cada respuesta.
    TODO: Implementar captura de IP real del cliente en el futuro.
    """
    user_agent = request.headers.get("user-agent", "Unknown")
    
    trace_data = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "requestId": str(uuid.uuid4()),
        "userAgent": user_agent,
        "ip": get_client_ip(request),  # TODO: Capturar IP real del usuario
    }

    if user:
        trace_data["user"] = {
            "id": user.get("id"),
            "username": user.get("username")
        }

    return trace_data

def get_enviroment():
    return { "name":ENV_NAME, "description":ENV }

def create_response(
    status: str,
    status_code: int,
    message: str,
    request: Request,
    data=None,
    meta=None,
    error=None,
    user=None
):
    """
    Genera una respuesta estandarizada y registra logs basados en el entorno.
    """
    trace = generate_trace(request, user)

    response_body = {
        "status": status,
        "statusCode": status_code,
        "message": message,
        "trace": trace,
        "environment": get_enviroment(),
        "meta": meta if meta else {},
        "error": error if error else {},
        "response": {
            "name": DEFAULT_RESPONSE_NAME,
            "type": RESPONSE_TYPE_SINGLE if isinstance(data, dict) else RESPONSE_TYPE_COLLECTION,
            "data": data if data else None
        }
    }

    # Delegamos el logging al manejador de logs de respuesta
    log_response(status, status_code, message, trace["requestId"], data, error)

    return JSONResponse(content=response_body, status_code=status_code)

# Manejo de rutas no existentes
async def not_found_handler(request: Request, exc):
    trace = generate_trace(request)
    response_body = {
        "status": RESPONSE_STATUS_ERROR,
        "statusCode": 404,
        "message": ERROR_NOT_FOUND,
        "trace": trace,
        "response": {
            "name": DEFAULT_RESPONSE_NAME,
            "type": RESPONSE_TYPE_SINGLE,
            "data": None
        }
    }
    log_response(RESPONSE_STATUS_ERROR, 404, ERROR_NOT_FOUND, trace["requestId"], None, None)
    return JSONResponse(content=response_body, status_code=404)