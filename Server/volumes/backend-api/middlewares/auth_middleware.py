from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from utils.security import verify_jwt_token
from dependencies.logger_handler import log_event
from dependencies.response_handler import create_response
from dependencies.constants import (
    PUBLIC_EXCLUDE_ROUTES,
    ERROR_AUTH,
    RESPONSE_STATUS_ERROR
)
from datetime import datetime, timezone
import uuid


def generate_trace(request: Request):
    user_agent = request.headers.get("user-agent", "Unknown")
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "requestId": str(uuid.uuid4()),
        "userAgent": user_agent,
        "ip": request.client.host if request.client else "Unknown"
    }


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.scope["path"]
        method = request.method
        log_event("info", f"Solicitud recibida: {method} {path}")

        # Solo se omite si la ruta está explícitamente en la lista de exclusión
        is_excluded = any(path.startswith(exc) for exc in PUBLIC_EXCLUDE_ROUTES)

        if not is_excluded:
            try:
                auth_header = request.headers.get("Authorization")

                if not auth_header or not auth_header.startswith("Bearer "):
                    raise HTTPException(status_code=401, detail="Token de autenticación faltante o inválido")

                token = auth_header.removeprefix("Bearer ").strip()
                payload = verify_jwt_token(token)
                request.state.user = payload  # ✅ Disponible para endpoints

                log_event("info", f"Autenticación exitosa: {method} {path}")

            except HTTPException as e:
                return create_response(
                    status=RESPONSE_STATUS_ERROR,
                    status_code=e.status_code,
                    message=ERROR_AUTH,
                    request=request,
                    error={"code": "AUTH_ERROR", "details": str(e.detail)},
                )

        return await call_next(request)
