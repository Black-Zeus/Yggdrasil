from dependencies.logger_handler import log_event
from dependencies.constants import (  # 📌 Importamos constantes para evitar Magic Strings
    RESPONSE_STATUS_SUCCESS,
    RESPONSE_STATUS_ERROR,
    LOG_LEVEL_INFO,
    LOG_LEVEL_DEBUG,
    LOG_LEVEL_WARNING,
    LOG_LEVEL_ERROR
)

def log_response(status: str, status_code: int, message: str, request_id: str, data=None, error=None):
    """
    Maneja los logs de la API en base al entorno y configuración de almacenamiento.
    """
    if status == RESPONSE_STATUS_SUCCESS:
        log_event(LOG_LEVEL_INFO, f"Response [SUCCESS] - {status_code} - {message} - RequestId: {request_id}")
        if data:
            log_event(LOG_LEVEL_DEBUG, f"Debug Data: {data}")
    elif status == RESPONSE_STATUS_ERROR:
        log_event(LOG_LEVEL_ERROR, f"Response [ERROR] - {status_code} - {message} - RequestId: {request_id} - Error: {error}")
    elif status_code >= 400:
        log_event(LOG_LEVEL_WARNING, f"Response [WARNING] - {status_code} - {message} - RequestId: {request_id}")
