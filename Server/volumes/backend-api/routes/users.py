from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from models.user import User
from datetime import datetime, timezone
from schemas.user import UserCreate, UserUpdate, UserResponse, UserResponseFull
from utils.security import hash_password
from utils.dbConfig import get_db
from utils.authMiddleware import authenticate_request
from dependencies.response_handler import create_response
from dependencies.constants import (
    ERROR_USER_NOT_FOUND,
    ERROR_EMAIL_REGISTERED,
    SUCCESS_USER_CREATED,
    SUCCESS_USER_UPDATED,
    SUCCESS_USER_DELETED,
    BASE_ACTIVE_STATUS,
    HTTP_200_OK,
    HTTP_201_CREATED,
    RESPONSE_STATUS_SUCCESS,
    SUCCESS_USER_RETRIEVED
)
from fastapi.encoders import jsonable_encoder

import uuid

router = APIRouter(
    prefix="/users",
    tags=["Users"]  # 👈 Esto aparecerá como grupo en Swagger
)

# Obtener todos los usuarios (Excluyendo eliminados)
@router.get("/", response_model=list[UserResponseFull],
    summary="Obtener lista de usuarios",
    description="""
        Retorna todos los usuarios activos del sistema (excluyendo aquellos marcados como eliminados).
        Incluye el estado asociado a cada usuario.
        """
)
def get_users(request: Request, db: Session = Depends(get_db)):
    users = db.query(User)\
              .options(joinedload(User.status))\
              .filter(User.deleted_at == None)\
              .all()

    users_data = [UserResponseFull.from_orm(user) for user in users]

    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Usuarios obtenidos correctamente",
        request=request,
        data=jsonable_encoder(users_data)
    )

# Obtener un usuario por ID (Excluyendo eliminados)
@router.get("/{user_id}", response_model=UserResponseFull,
    summary="Obtener usuario por ID",
    description="""
Retorna la información detallada de un usuario específico identificado por su ID, 
excluyendo aquellos que estén marcados como eliminados.
Incluye relaciones como el estado del usuario.
"""
)
def get_user(user_id: int, request: Request, db: Session = Depends(get_db)):
    user = db.query(User)\
                        .options(joinedload(User.status))\
                        .filter(User.id == user_id, User.deleted_at == None)\
                        .first()
    
    if not user:
        raise HTTPException(status_code=404, detail=ERROR_USER_NOT_FOUND)

    user_data = UserResponseFull.from_orm(user)

    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message=SUCCESS_USER_RETRIEVED,
        request=request,
        data=jsonable_encoder(user_data)
    )

# Crear un nuevo usuario
@router.post("/", response_model=UserResponseFull,
    summary="Crear nuevo usuario",
    description="""
Registra un nuevo usuario en el sistema con estado activo por defecto.
El correo electrónico debe ser único.
El `secret_key` se genera automáticamente en el backend.
"""
)
def create_user(user_data: UserCreate, request: Request, db: Session = Depends(get_db)):
    user_id = request.state.user.get("user_id")

    # ✅ Validar si el correo ya existe
    existing_user = db.query(User).filter(User.email == user_data.email, User.deleted_at == None).first()
    if existing_user:
        raise HTTPException(status_code=400, detail=ERROR_EMAIL_REGISTERED)

    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        institutional_email=user_data.institutional_email,
        password_hash=hash_password(user_data.password),
        status_id=BASE_ACTIVE_STATUS,  # fijo en backend
        secret_key=str(uuid.uuid4())  # generado en backend
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user = db.query(User).filter(User.id == new_user.id).first()
    
    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_201_CREATED,
        message=SUCCESS_USER_CREATED,
        request=request,
        data=jsonable_encoder(UserResponseFull.from_orm(user))
    )

@router.put("/{user_id}", response_model=UserResponseFull,
    summary="Actualizar usuario",
    description="""
Actualiza los campos permitidos de un usuario específico.
No se permite actualizar el `secret_key`.
"""
)
def update_user(user_id: int, user_data: UserUpdate, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.deleted_at == None).first()
    if not user:
        raise HTTPException(status_code=404, detail=ERROR_USER_NOT_FOUND)

    update_fields = user_data.dict(exclude_unset=True)

    # Limpieza y lógica especial
    if "institutional_email" in update_fields:
        institutional_email = update_fields["institutional_email"]
        update_fields["institutional_email"] = institutional_email if institutional_email else None

    update_fields.pop("secret_key", None)  # secret_key no debe actualizarse

    for key, value in update_fields.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    # Recargar con relaciones
    user = db.query(User).options(joinedload(User.status)).filter(User.id == user.id).first()

    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message=SUCCESS_USER_UPDATED,
        request=request,
        data=jsonable_encoder(UserResponseFull.from_orm(user))
    )

# Soft Delete: Marcar usuario como eliminado y registrar quién lo eliminó
@router.delete("/{user_id}",
    summary="Eliminar usuario (Soft Delete)",
    description="""
Marca un usuario como eliminado (`deleted_at`), sin eliminarlo físicamente de la base de datos.
Registra quién realizó la acción mediante JWT.
"""
)
def delete_user(user_id: int, request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.deleted_at == None).first()
    if not user:
        raise HTTPException(status_code=404, detail=ERROR_USER_NOT_FOUND)

    # Obtener el usuario autenticado desde el JWT
    auth_user = request.state.user  # Esto proviene del middleware de autenticación
    deleted_by_id = auth_user.get("user_id") if auth_user else None  # `None` si no se encuentra

    user.deleted_at = datetime.now(timezone.utc)
    user.deleted_by = deleted_by_id  # Registrar quién eliminó el usuario
    db.commit()

    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message=SUCCESS_USER_DELETED,
        request=request
    )
