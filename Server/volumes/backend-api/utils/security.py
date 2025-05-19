import jwt
import secrets
import string
import os
import uuid
import hashlib

from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

from services.redis import get_user_secret, set_redis_key_with_expiry, get_redis_key_value
from dependencies.constants import (
    ACCESS_TOKEN_EXPIRATION_MINUTES,
    REFRESH_TOKEN_EXPIRATION_DAYS,
    JWT_ALGORITHM,
    ERROR_INVALID_TOKEN,
    ERROR_EXPIRED_ACCESS_TOKEN,
    ERROR_EXPIRED_REFRESH_TOKEN,
    ERROR_INVALID_REFRESH_TOKEN,
    ERROR_USER_SECRET_NOT_FOUND,
)

# 🔹 Cargar variables de entorno
ACCESS_SECRET = os.getenv("API_SECRET_KEY", "default_access_secret")
REFRESH_SECRET = os.getenv("API_SECRET_KEY_REFRESH", "default_refresh_secret")

# 🔹 Configuración de encriptación de contraseñas
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
    pbkdf2_sha256__default_rounds=480000  # mismo número de rondas que tu hash insertado
)

# ==============================
# 🔹 Funciones para manejar contraseñas
# ==============================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# ==============================
# 🔹 Funciones para manejar JWT
# ==============================

def create_access_token(user_data: dict, user_secret: str) -> str:
    if not user_secret:
        raise ValueError(ERROR_USER_SECRET_NOT_FOUND)

    combined_secret = hashlib.sha256((ACCESS_SECRET + user_secret).encode()).hexdigest()

    payload = {
        **user_data,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRATION_MINUTES),
        "iat": datetime.now(timezone.utc),
    }

    return jwt.encode(payload, combined_secret, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRATION_DAYS),
        "iat": datetime.now(timezone.utc),
    }

    refresh_token = jwt.encode(payload, REFRESH_SECRET, algorithm=JWT_ALGORITHM)

    # Guardar el Refresh Token en Redis (TTL: 7 días = 604800 segundos)
    set_redis_key_with_expiry(f"refresh_token:{user_id}", refresh_token, 604800)

    return refresh_token

def verify_access_token(token: str) -> dict:
    try:
        unverified_payload = jwt.decode(token, options={"verify_signature": False})
        user_id = unverified_payload.get("user_id")

        if not user_id:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_INVALID_TOKEN)

        user_secret = get_user_secret(user_id)

        if not user_secret:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_USER_SECRET_NOT_FOUND)

        combined_secret = hashlib.sha256((ACCESS_SECRET + user_secret).encode()).hexdigest()

        return jwt.decode(token, combined_secret, algorithms=[JWT_ALGORITHM])

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_EXPIRED_ACCESS_TOKEN)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_INVALID_TOKEN)

def verify_refresh_token(refresh_token: str) -> str:
    try:
        payload = jwt.decode(refresh_token, REFRESH_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("user_id")

        stored_token = get_redis_key_value(f"refresh_token:{user_id}")
        if stored_token != refresh_token:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_INVALID_REFRESH_TOKEN)

        return user_id

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_EXPIRED_REFRESH_TOKEN)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_INVALID_REFRESH_TOKEN)

def verify_jwt_token(token: str) -> dict:
    try:
        unverified_payload = jwt.decode(token, options={"verify_signature": False})
        user_id = unverified_payload.get("user_id")

        if not user_id:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_INVALID_TOKEN)

        is_access_token = "exp" in unverified_payload

        if is_access_token:
            user_secret = get_user_secret(user_id)

            if not user_secret:
                raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_USER_SECRET_NOT_FOUND)

            combined_secret = hashlib.sha256((ACCESS_SECRET + user_secret).encode()).hexdigest()
            return jwt.decode(token, combined_secret, algorithms=[JWT_ALGORITHM])
        else:
            return jwt.decode(token, REFRESH_SECRET, algorithms=[JWT_ALGORITHM])

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_EXPIRED_ACCESS_TOKEN)
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail=ERROR_INVALID_TOKEN)

def generate_secure_password(length: int = 12) -> str:
    if length < 4:
        raise ValueError("La longitud mínima recomendada es 4 caracteres.")
    alphabet = string.ascii_letters + string.digits + "-_@!$%&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_uuid_token() -> str:
    return str(uuid.uuid4())
    #return os.urandom(32).hex()  # 64 caracteres hexadecimales
