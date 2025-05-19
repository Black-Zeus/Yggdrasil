import uuid
#import logging
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import uuid4

from models.user import User
from models.user_role import UserRole

from schemas.user import (
    LoginRequest, RecoverPasswordRequest,
    ResetPasswordRequest, ChangePasswordRequest,
    RefreshTokenRequest
)
from utils.dbConfig import get_db
from utils.security import (
    verify_password, hash_password,
    create_access_token, create_refresh_token,
    generate_secure_password, generate_uuid_token,
    verify_refresh_token, verify_access_token
)
from services.redis import (
    get_user_secret, store_user_secret,
    set_redis_key_with_expiry, get_redis_key_value, delete_redis_key
)
from dependencies.response_handler import create_response
from dependencies.response_logger import log_response
from dependencies.constants import (
    RESPONSE_STATUS_SUCCESS, RESPONSE_STATUS_ERROR,
    SUCCESS_LOGIN, SUCCESS_PASSWORD_RESET,
    SUCCESS_PASSWORD_GENERATED, SUCCESS_RECOVERY_TOKEN,
    ERROR_USER_NOT_FOUND, ERROR_INVALID_CREDENTIALS,
    ERROR_INVALID_RESET_TOKEN, ERROR_INACTIVE_USER,
    ERROR_INVALID_JWT_SECRET, ERROR_INVALID_REFRESH_TOKEN,
    ERROR_INVALID_NEW_PASSWORD, ERROR_INVALID_CURRENT_PASSWORD, ERROR_INVALID_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_GEN_MIN, PASSWORD_GEN_MAX,
    RESET_TOKEN_TTL_SECONDS,
    HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED,
    HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR, ERROR_AUTH_INVALID_TOKEN, 
    BASE_ACTIVE_STATUS, HTTP_403_FORBIDDEN,
    SUCCESS_SECRET_KEY_UPDATED, MESSAGE_SECRET_KEY_UPDATED,
    SUCCESS_UUID_GENERATED, ERROR_UUID_GENERATION, ERROR_UUID_GENERATION_CODE
)
from utils.security import generate_secure_password  # asegúrate de importar esto

from utils.mixed import is_dev_environment

from datetime import datetime, timezone

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]  # 👈 Agrupa todo bajo la categoría "Auth" en Swagger
)

# ==============================
# 🔓 Endpoints Públicos de Autenticación
# ==============================

@router.post("/login",
    summary="Iniciar sesión",
    description="""
Permite autenticar a un usuario con correo y contraseña.

Retorna un token de acceso (JWT), un token de refresco y los datos básicos del usuario autenticado. 
Solo usuarios con estado activo pueden iniciar sesión.
""")
def login(request: Request, data: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.email == data.email).first()
        
        if not user:
            raise ValueError("User not found")        
        
        if not verify_password(data.password, user.password_hash):
            raise ValueError("Invalid password")
        
        if user.status_id != BASE_ACTIVE_STATUS:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_403_FORBIDDEN,
                message=ERROR_INACTIVE_USER,
                request=request,
                error={"code": "INACTIVE_USER", "details": "User is not active"}
            )

        if not user.secret_key or not (16 <= len(user.secret_key) <= 64):
            raise ValueError(ERROR_INVALID_JWT_SECRET)

        try:
            secret_jwt = get_user_secret(user.id)
        except ValueError:
            secret_jwt = user.secret_key
            store_user_secret(user.id, secret_jwt)


        #Update LastLogin
        user.last_login = datetime.now(timezone.utc)
        db.add(user)
        db.commit()

        user_role = db.query(UserRole).filter_by(user_id=user.id).first()
        role_id = user_role.role_id if user_role else None

        access_token = create_access_token(
            {
                "user_id": user.id,
                "email": user.email,
                "name": user.full_name,
                "profileId": role_id,
            },
            secret_jwt,
        )

        refresh_token = create_refresh_token(user.id)

        response = {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "Bearer",
            "user": {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
                "profileId": role_id,
            },
        }

        return create_response(RESPONSE_STATUS_SUCCESS, HTTP_200_OK, SUCCESS_LOGIN, request, response)

    except Exception as e:
        log_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_401_UNAUTHORIZED,
            message="Authentication failed",
            request_id=request.scope["path"],
            error={"code": "AUTH_FAILURE", "details": str(e)}
        )
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_401_UNAUTHORIZED,
            message=ERROR_INVALID_CREDENTIALS,
            request=request,
            error={"code": "AUTHENTICATION_FAILED", "details": "Authentication failed"}
        )

@router.post("/refresh",
    summary="Refrescar token de acceso",
    description="""
Permite obtener un nuevo token de acceso usando un token de refresco válido.

Retorna un nuevo token de acceso manteniendo el mismo token de refresco. El token de refresco
debe ser válido y corresponder al almacenado en el sistema para el usuario.
""")
def refresh_token_endpoint(request: Request, data: RefreshTokenRequest, db: Session = Depends(get_db)):
    try:
        # Intentar obtener el user_id del token de refresco
        user_id = verify_refresh_token(data.refresh_token)
        
        # Obtener usuario de la base de datos
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_404_NOT_FOUND,
                message=ERROR_USER_NOT_FOUND,
                request=request,
                error={"code": "USER_NOT_FOUND", "details": f"User ID: {user_id}"}
            )
        
        # Verificar que el usuario esté activo
        if user.status_id != BASE_ACTIVE_STATUS:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_403_FORBIDDEN,
                message=ERROR_INACTIVE_USER,
                request=request,
                error={"code": "INACTIVE_USER", "details": "User is not active"}
            )
        
        # Obtener clave secreta para JWT
        try:
            secret_jwt = get_user_secret(user.id)
        except ValueError:
            secret_jwt = user.secret_key
            store_user_secret(user.id, secret_jwt)
        
        # Obtener rol del usuario
        user_role = db.query(UserRole).filter_by(user_id=user.id).first()
        role_id = user_role.role_id if user_role else None
        
        # Crear nuevo token de acceso
        access_token = create_access_token(
            {
                "user_id": user.id,
                "email": user.email,
                "name": user.full_name,
                "profileId": role_id,
            },
            secret_jwt,
        )
        
        response = {
            "access_token": access_token,
            "refresh_token": data.refresh_token,  # Devolver el mismo refresh token
            "token_type": "Bearer"
        }
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message="Token refreshed successfully",
            request=request,
            data=response
        )
        
    except HTTPException as e:
        # Manejar excepciones lanzadas por verify_refresh_token
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=e.status_code,
            message=e.detail,
            request=request,
            error={"code": "REFRESH_FAILED", "details": e.detail}
        )
    except Exception as e:
        log_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_401_UNAUTHORIZED,
            message="Token refresh failed",
            request_id=request.scope["path"],
            error={"code": "REFRESH_FAILURE", "details": str(e)}
        )
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_401_UNAUTHORIZED,
            message=ERROR_INVALID_REFRESH_TOKEN,
            request=request,
            error={"code": "REFRESH_FAILED", "details": "Error al refrescar el token"}
        )

@router.post("/logout",
    summary="Cerrar sesión",
    description="""
Cierra la sesión del usuario invalidando su token de refresco.

Esta operación revoca el token de refresco asociado al usuario,
obligando a realizar un nuevo login para obtener nuevas credenciales.
""")
def logout(request: Request):
    try:
        # Obtener el token del encabezado de autorización
        auth_header = request.headers.get("Authorization", "")
        
        if not auth_header or not auth_header.startswith("Bearer "):
            return create_response(
                status=RESPONSE_STATUS_SUCCESS,
                status_code=HTTP_200_OK,
                message="Logout successful",
                request=request,
                data={"message": "Sesión cerrada correctamente"}
            )
        
        token = auth_header.split(" ")[1]
        
        try:
            # Verificar token de acceso para obtener user_id
            payload = verify_access_token(token)
            user_id = payload.get("user_id")
            
            if user_id:
                # Eliminar el refresh token de Redis
                delete_redis_key(f"refresh_token:{user_id}")
                
                # También podríamos añadir el token a una lista negra si es necesario
                # add_to_blacklist(token, access_token_expiry_time)
            
        except Exception:
            # Si el token no es válido, simplemente continuamos
            pass
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message="Logout successful",
            request=request,
            data={"message": "Sesión cerrada correctamente"}
        )
        
    except Exception as e:
        log_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            message="Logout failed",
            request_id=request.scope["path"],
            error={"code": "LOGOUT_FAILURE", "details": str(e)}
        )
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            message="Error during logout",
            request=request,
            error={"code": "LOGOUT_FAILED", "details": "Error al cerrar sesión"}
        )

@router.post("/recover-password",
    summary="Solicitar token de recuperación de contraseña",
    description="""
Genera un token temporal para recuperación de contraseña y lo asocia al correo electrónico del usuario.
El token se almacena en Redis con tiempo de expiración definido.
""")
def recover_password(request: Request, data: RecoverPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_404_NOT_FOUND,
            message=ERROR_USER_NOT_FOUND,
            request=request,
            error={"code": "USER_NOT_FOUND", "details": f"Email: {data.email}"}
        )
        
    if not user or user.status_id != BASE_ACTIVE_STATUS:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_403_FORBIDDEN,
            message=ERROR_INACTIVE_USER,
            request=request,
            error={"code": "INACTIVE_USER", "details": "User is not active"}
        )

    reset_token = str(uuid4())
    redis_key = f"reset_token:{data.email}"

    set_redis_key_with_expiry(redis_key, reset_token, RESET_TOKEN_TTL_SECONDS)

    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message=SUCCESS_RECOVERY_TOKEN,
        request=request,
        data={"reset_token": reset_token, "expires_in": RESET_TOKEN_TTL_SECONDS}
    )

@router.post("/reset-password",
    summary="Restablecer contraseña usando token",
    description="""
Permite restablecer la contraseña de un usuario usando un token de recuperación previamente generado.
Verifica validez y vigencia del token antes de actualizar la contraseña.
""")
def reset_password(request: Request, data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_404_NOT_FOUND,
            message=ERROR_USER_NOT_FOUND,
            request=request,
            error={"code": "USER_NOT_FOUND", "details": f"Email: {data.email}"}
        )
        
    if not user or user.status_id != BASE_ACTIVE_STATUS:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_403_FORBIDDEN,
            message=ERROR_INACTIVE_USER,
            request=request,
            error={"code": "INACTIVE_USER", "details": "User is not active"}
        )

    redis_key = f"reset_token:{data.email}"
    stored_token = get_redis_key_value(redis_key)

    if not stored_token or stored_token != data.reset_token:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=ERROR_INVALID_RESET_TOKEN,
            request=request,
            error={"code": "INVALID_RESET_TOKEN", "details": "Token inválido o expirado"}
        )

    user.password_hash = hash_password(data.new_password)
    db.commit()
    delete_redis_key(redis_key)

    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message=SUCCESS_PASSWORD_RESET,
        request=request,
        data={"message": "Password updated successfully"}
    )

@router.get("/generate-password",
    summary="Generar contraseña segura o hashear texto",
    description="""
Genera una contraseña segura aleatoria de la longitud especificada (si el valor es numérico) 
o bien retorna el hash de una cadena dada.

En entornos de desarrollo, se muestra el hash resultante. 
En producción, solo se entrega la contraseña sin hashear.
""")
def generate_password(request: Request, value: str = "8"):
    """
    Genera una contraseña segura o encripta una cadena dada.

    Este endpoint permite generar contraseñas aleatorias de un largo específico
    (si el parámetro `value` es numérico), o bien recibir una palabra para encriptar 
    (si el valor no es numérico). En entornos de desarrollo, también retorna el hash.

    Parámetros:
    - value (str, opcional): Si es un número, genera una contraseña aleatoria de esa longitud.
                             Si es una cadena, retorna la cadena original y su hash.

    Respuestas:
    - 200: Contraseña generada o cadena encriptada exitosamente.
    - 400: Longitud inválida (si es numérica y está fuera de rango).
    - 500: Error interno al generar o procesar la contraseña.
    """
    try:
        if value.isdigit():
            length = int(value)
            if length < PASSWORD_GEN_MIN or length > PASSWORD_GEN_MAX:
                return create_response(
                    status=RESPONSE_STATUS_ERROR,
                    status_code=HTTP_400_BAD_REQUEST,
                    message=ERROR_INVALID_LENGTH,
                    request=request,
                    error={"code": "INVALID_LENGTH", "details": f"length={length}"}
                )
            plain_password = generate_secure_password(length)
        else:
            plain_password = value

        response = {"plain_password": plain_password}

        if is_dev_environment():
            response["hashed_password"] = hash_password(plain_password)

        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_PASSWORD_GENERATED,
            request=request,
            data=response
        )

    except Exception as e:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            message="An error occurred while generating the password.",
            request=request,
            error={"code": "GENERATION_ERROR", "details": str(e)}
        )

@router.get("/generate-uuid-token",
    summary="Generar token UUID único",
    description="""
Genera y retorna un token UUID versión 4. 
Útil para firmas, tokens únicos o identificadores internos.
""")
def generate_uuid_token_endpoint(request: Request):
    try:
        token = generate_uuid_token()
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_UUID_GENERATED,
            request=request,
            data={"uuid_token": token}
        )
    except Exception as e:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            message=ERROR_UUID_GENERATION,
            request=request,
            error={"code": ERROR_UUID_GENERATION_CODE, "details": str(e)}
        )

# ==============================
# 🔒 Endpoint Privado: Cambio de contraseña autenticado
# ==============================
@router.put(
    "/change-secret-key",
    summary="Regenerar secret_key del usuario",
    description="""
Regenera el campo `secret_key` de un usuario autenticado usando UUID4.

Este campo es usado para firmar JWTs personalizados. 
No se retorna el valor nuevo por seguridad.
"""
)
def change_secret_key(request: Request, db: Session = Depends(get_db)):
    user_payload = getattr(request.state, "user", None)
    if not user_payload or not user_payload.get("user_id"):
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail=ERROR_AUTH_INVALID_TOKEN)

    user_id = user_payload["user_id"]
    user = db.query(User).filter(User.id == user_id, User.deleted_at == None).first()

    if not user:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail=ERROR_USER_NOT_FOUND)

    if user.status_id != BASE_ACTIVE_STATUS:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail=ERROR_INACTIVE_USER)

    user.secret_key = str(uuid.uuid4())
    db.commit()

    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message=SUCCESS_SECRET_KEY_UPDATED,
        request=request,
        data={"message": MESSAGE_SECRET_KEY_UPDATED}
    )