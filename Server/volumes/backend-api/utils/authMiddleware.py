from fastapi import Request, HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN
from utils.security import verify_jwt_token  # Validación de JWT

def authenticate_request(request: Request):
    """
    Verifica la autenticación del usuario mediante JWT en los encabezados de la solicitud.
    """
    auth_header = request.headers.get("Authorization")

    # Validar si el header de autorización existe y tiene el formato correcto
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED, 
            detail="Token de autenticación faltante o inválido"
        )

    token = auth_header.removeprefix("Bearer ").strip()  # 🔹 Remueve "Bearer " de forma más segura

    try:
        # Verificar el token usando la función de `security.py`
        payload = verify_jwt_token(token)
        
        # Si el token es válido, almacenar info del usuario en la solicitud
        request.state.user = payload  

    except HTTPException as e:
        # Si `verify_jwt_token()` ya lanza `HTTPException`, la propagamos directamente
        raise e  

    except ValueError as e:
        # Si el token tiene problemas de validación, lanzar un error 403 Forbidden
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, 
            detail=str(e)
        )

    except Exception as e:
        # Captura cualquier otro error inesperado
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, 
            detail="Error desconocido en la autenticación"
        )
