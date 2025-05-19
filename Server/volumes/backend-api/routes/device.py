from fastapi import APIRouter, Depends, Request, HTTPException, Path, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from utils.dbConfig import get_db
from models.device import Device
from schemas.device import (
    DeviceResponse, 
    DeviceCreate, 
    DeviceUpdate, 
    RegisterCodeResponse, 
    DeviceRegisterRequest,
    DeviceStatusUpdate  # Añadimos este nuevo schema
)
from typing import List, Optional
from uuid import uuid4
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from dependencies.response_handler import create_response
from dependencies.constants import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    RESPONSE_STATUS_SUCCESS,
    RESPONSE_STATUS_ERROR,
    # Device Status
    DEVICE_STATUS_ACTIVE,      # 1
    DEVICE_STATUS_INACTIVE,    # 2
    DEVICE_STATUS_PENDING,     # 3
    # Device Operating Systems
    DEVICE_OS_ANDROID,
    # Success Messages
    SUCCESS_REGISTER_CODE_GENERATED,
    SUCCESS_DEVICE_REGISTERED,
    SUCCESS_DEVICE_UPDATED,
    SUCCESS_DEVICE_DELETED,
    SUCCESS_DEVICES_RETRIEVED,
    SUCCESS_DEVICE_RETRIEVED,
    SUCCESS_REGISTER_CODE_MESSAGE,
    SUCCESS_DEVICE_STATUS_UPDATED,  # Nueva constante para el mensaje de éxito
    # Error Messages
    ERROR_INVALID_REGISTER_CODE,
    ERROR_DEVICE_ALREADY_REGISTERED,
    ERROR_DEVICE_NOT_FOUND,
    ERROR_DEVICE_PHYSICAL_ID_EXISTS,
    ERROR_GENERATING_REGISTER_CODE,
    ERROR_REGISTERING_DEVICE,
    ERROR_UPDATING_DEVICE,
    ERROR_INTEGRITY_DEVICE,
    ERROR_INVALID_STATUS,      # Nueva constante para error de estado inválido
    # Default Values
    DEVICE_DEFAULT_NAME_PENDING,
    DEVICE_DEFAULT_BRAND_PENDING,
    DEVICE_DEFAULT_MODEL_PENDING,
    DEVICE_DEFAULT_PHYSICAL_ID_PENDING,
    DEVICE_DEFAULT_OS
)

router = APIRouter(prefix="/devices", tags=["Devices"])

@router.get("/register-code", response_model=RegisterCodeResponse)
def get_register_code(request: Request, db: Session = Depends(get_db)):
    """
    Genera un código de registro para un nuevo dispositivo y lo inserta en estado pendiente.
    """
    try:
        register_code = str(uuid4())
        
        # Crear dispositivo en estado pendiente
        new_device = Device(
            name=DEVICE_DEFAULT_NAME_PENDING,
            brand=DEVICE_DEFAULT_BRAND_PENDING,
            model=DEVICE_DEFAULT_MODEL_PENDING,
            device_physical_id=DEVICE_DEFAULT_PHYSICAL_ID_PENDING,
            status_id=DEVICE_STATUS_PENDING,
            operating_system=DEVICE_DEFAULT_OS,
            register_code=register_code
        )
        
        db.add(new_device)
        db.commit()
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_201_CREATED,
            message=SUCCESS_REGISTER_CODE_GENERATED,
            request=request,
            data=jsonable_encoder({
                "register_code": register_code,
                "message": SUCCESS_REGISTER_CODE_MESSAGE
            })
        )
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=f"{ERROR_GENERATING_REGISTER_CODE}: {str(e)}",
            request=request,
            error={"exception": str(e)}
        )

@router.post("/register", response_model=DeviceResponse)
def register_device(
    request: Request, 
    device_data: DeviceRegisterRequest, 
    db: Session = Depends(get_db)
):
    """
    Registra un dispositivo con todos sus datos utilizando el código de registro previamente generado.
    """
    # Buscar dispositivo por código de registro
    device = db.query(Device).filter(
        Device.register_code == device_data.register_code,
        Device.deleted_at.is_(None)
    ).first()
    
    if not device:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_404_NOT_FOUND,
            message=ERROR_INVALID_REGISTER_CODE,
            request=request,
            error={"code": "invalid_register_code"}
        )
    
    # Verificar si ya existe un dispositivo con ese device_physical_id
    existing_device = db.query(Device).filter(
        and_(
            Device.device_physical_id == device_data.device_physical_id,
            Device.id != device.id,
            Device.deleted_at.is_(None)
        )
    ).first()
    
    if existing_device:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=ERROR_DEVICE_ALREADY_REGISTERED,
            request=request,
            error={"code": "device_already_registered"}
        )
    
    try:
        # Actualizar el dispositivo con los datos completos
        device.name = device_data.name
        device.brand = device_data.brand
        device.model = device_data.model
        device.device_physical_id = device_data.device_physical_id
        device.operating_system = device_data.operating_system
        device.status_id = DEVICE_STATUS_ACTIVE
        
        db.commit()
        db.refresh(device)
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_DEVICE_REGISTERED,
            request=request,
            data=jsonable_encoder(device)
        )
    except IntegrityError:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=ERROR_INTEGRITY_DEVICE,
            request=request,
            error={"code": "integrity_error"}
        )
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=f"{ERROR_REGISTERING_DEVICE}: {str(e)}",
            request=request,
            error={"exception": str(e)}
        )

@router.get("/", response_model=List[DeviceResponse])
def get_devices(
    request: Request, 
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    user_id: Optional[int] = Query(None, description="Filtrar por ID de usuario"),
    db: Session = Depends(get_db)
):
    """
    Obtiene todos los dispositivos activos (no eliminados).
    Se puede filtrar por user_id opcional.
    """
    try:
        query = db.query(Device).filter(Device.deleted_at.is_(None))
        
        if user_id is not None:
            query = query.filter(Device.user_id == user_id)
        
        devices = query.offset(skip).limit(limit).all()
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_DEVICES_RETRIEVED,
            request=request,
            data=jsonable_encoder(devices),
            meta={"total": len(devices), "skip": skip, "limit": limit}
        )
    except Exception as e:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=f"Error al recuperar dispositivos: {str(e)}",
            request=request,
            error={"exception": str(e)}
        )

@router.get("/{device_id}", response_model=DeviceResponse)
def get_device(
    request: Request, 
    device_id: int = Path(..., ge=1), 
    db: Session = Depends(get_db)
):
    """
    Obtiene un dispositivo específico por su ID.
    """
    try:
        device = db.query(Device).filter(
            Device.id == device_id,
            Device.deleted_at.is_(None)
        ).first()
        
        if not device:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_404_NOT_FOUND,
                message=ERROR_DEVICE_NOT_FOUND,
                request=request,
                error={"device_id": device_id}
            )
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_DEVICE_RETRIEVED,
            request=request,
            data=jsonable_encoder(device)
        )
    except Exception as e:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=f"Error al recuperar el dispositivo: {str(e)}",
            request=request,
            error={"exception": str(e), "device_id": device_id}
        )

@router.delete("/{device_id}")
def delete_device(
    request: Request, 
    device_id: int = Path(..., ge=1), 
    db: Session = Depends(get_db)
):
    """
    Elimina lógicamente un dispositivo (soft delete).
    """
    try:
        device = db.query(Device).filter(
            Device.id == device_id,
            Device.deleted_at.is_(None)
        ).first()
        
        if not device:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_404_NOT_FOUND,
                message=ERROR_DEVICE_NOT_FOUND,
                request=request,
                error={"device_id": device_id}
            )
        
        # Soft delete - establecer deleted_at
        device.deleted_at = datetime.utcnow()
        db.commit()
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_DEVICE_DELETED,
            request=request,
            data={"deleted_device_id": device_id}
        )
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=f"Error al eliminar el dispositivo: {str(e)}",
            request=request,
            error={"exception": str(e), "device_id": device_id}
        )

@router.patch("/update-status", response_model=DeviceResponse)
def update_device_status(
    request: Request,
    status_data: DeviceStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualiza el estado de un dispositivo utilizando su código de registro.
    Status puede ser: 1 (Activo), 2 (Inactivo), 3 (Pendiente)
    """
    try:
        # Validar que el status sea válido
        if status_data.status_id not in [DEVICE_STATUS_ACTIVE, DEVICE_STATUS_INACTIVE, DEVICE_STATUS_PENDING]:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_400_BAD_REQUEST,
                message=ERROR_INVALID_STATUS,
                request=request,
                error={"valid_status": [DEVICE_STATUS_ACTIVE, DEVICE_STATUS_INACTIVE, DEVICE_STATUS_PENDING]}
            )
        
        # Buscar dispositivo por código de registro
        device = db.query(Device).filter(
            Device.register_code == status_data.register_code,
            Device.deleted_at.is_(None)
        ).first()
        
        if not device:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_404_NOT_FOUND,
                message=ERROR_INVALID_REGISTER_CODE,
                request=request,
                error={"register_code": status_data.register_code}
            )
        
        # Actualizar el estado del dispositivo
        device.status_id = status_data.status_id
        db.commit()
        db.refresh(device)
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_DEVICE_STATUS_UPDATED,
            request=request,
            data=jsonable_encoder(device)
        )
    except IntegrityError:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=ERROR_INTEGRITY_DEVICE,
            request=request,
            error={"code": "integrity_error"}
        )
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_400_BAD_REQUEST,
            message=f"{ERROR_UPDATING_DEVICE}: {str(e)}",
            request=request,
            error={"exception": str(e)}
        )