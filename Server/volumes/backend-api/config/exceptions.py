from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from dependencies.response_handler import create_response
from dependencies.constants import (
    RESPONSE_STATUS_ERROR,
    ERROR_NOT_FOUND,
    HTTP_422_UNPROCESSABLE_ENTITY
)

ERROR_TRANSLATIONS = {
    "value_error.missing": "Este campo es obligatorio",
    "type_error.integer": "Debe ser un número entero",
    "type_error.string": "Debe ser una cadena de texto",
    "string_too_short": "Debe tener al menos {min_length} caracteres",
    "string_too_long": "Debe tener como máximo {max_length} caracteres",
    "value_error.email": "Debe ser un correo electrónico válido",
    "value_error.any_str.min_length": "Debe tener al menos {limit_value} caracteres",
    "value_error.any_str.max_length": "Debe tener como máximo {limit_value} caracteres",
}

FIELD_TRANSLATIONS = {
    "email": "Correo electrónico",
    "password": "Contraseña",
    "name": "Nombre",
    "username": "Nombre de usuario"
}

def translate_error(error):
    err_type = error.get("type", "")
    ctx = error.get("ctx", {})
    template = ERROR_TRANSLATIONS.get(err_type)
    if not template:
        return error.get("msg", "Error de validación")
    try:
        return template.format(**ctx)
    except Exception:
        return template

def register_exception_handlers(app):
    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc):
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=404,
            message=ERROR_NOT_FOUND,
            request=request,
            data=None
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        translated_errors = []

        for e in exc.errors():
            loc_parts = e.get("loc", [])
            field = ".".join(str(p) for p in loc_parts if p != "body")

            translated_errors.append({
                "field": field,
                "message": translate_error(e),
                "type": e.get("type")
            })

        first_error = translated_errors[0]
        field_label = FIELD_TRANSLATIONS.get(first_error["field"], first_error["field"].capitalize())
        main_message = f"{field_label}: {first_error['message']}"

        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_422_UNPROCESSABLE_ENTITY,
            message=main_message,
            request=request,
            error={
                "code": "VALIDATION_ERROR",
                "details": translated_errors
            }
        )
