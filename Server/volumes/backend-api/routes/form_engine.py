from fastapi import APIRouter, Request, Depends, Query, Path, Body, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import Optional, List, Dict, Any
from uuid import uuid4
from datetime import datetime

from utils.dbConfig import get_db
from dependencies.response_handler import create_response
from dependencies.constants import (
    SUCCESS_FORM_CREATED,
    SUCCESS_FORM_UPDATED,
    SUCCESS_FORM_PUBLISHED,
    SUCCESS_FORM_CLONED,
    SUCCESS_FORM_DISABLED,
    HTTP_200_OK,
    RESPONSE_STATUS_SUCCESS,
    HTTP_404_NOT_FOUND,
    RESPONSE_STATUS_ERROR
)

# Importamos los modelos de la base de datos
# Asumo nombres basados en tu esquema SQL - ajustar según sea necesario
from models.form import Form
from models.form_question import FormQuestion
from models.status_type import StatusType
from models.user import User
from models.category import Category
from models.subcategory import Subcategory

# Importamos los esquemas Pydantic
from schemas.form import FormEngineCreate
from schemas.form import (
    FormResponse,           # Para devolver un formulario individual
    FormListResponse,       # Para listar formularios
    FormCreate,             # Para crear un formulario
    FormUpdate              # Para actualizar un formulario
)

router = APIRouter(
    prefix="/form-engine", 
    tags=["Form Engine"]
)

@router.get(
    "/",
    summary="Listar formularios",
    description="Retorna todos los formularios con soporte para filtros, paginación y límites"
)
async def list_forms(
    request: Request,
    db: Session = Depends(get_db),
    page: int = Query(1, description="Número de página"),
    limit: int = Query(10, description="Límite de resultados por página"),
    status: Optional[str] = Query(None, description="Filtro por estado (draft, published, disabled)"),
    search: Optional[str] = Query(None, description="Búsqueda por título"),
    category: Optional[str] = Query(None, description="Filtro por categoría"),
    subcategory: Optional[str] = Query(None, description="Filtro por subcategoría"),
    created_by: Optional[int] = Query(None, description="Filtro por creador"),
    sort_by: Optional[str] = Query("created_at", description="Campo por el cual ordenar"),
    sort_dir: Optional[str] = Query("desc", description="Dirección de ordenamiento (asc, desc)")
):
    # Creamos la consulta base
    query = db.query(Form)
    
    # Aplicamos los filtros
    if status:
        status_type = db.query(StatusType).filter(StatusType.code == status).first()
        if status_type:
            query = query.filter(Form.status_id == status_type.id)
    
    if search:  # Filtro por título usando el parámetro 'search'
        query = query.filter(Form.title.ilike(f"%{search}%"))
    
    if created_by:
        query = query.filter(Form.created_by == created_by)
    
    if category:  # Filtro por categoría usando el parámetro 'category'
        query = query.filter(Form.category_id == category)
    
    if subcategory:  # Filtro por subcategoría usando el parámetro 'subcategory'
        query = query.filter(Form.subcategory_id == subcategory)
    
    # Contamos el total de registros para paginación
    total_items = query.count()
    total_pages = (total_items + limit - 1) // limit if total_items > 0 else 1
    
    # Aplicamos ordenamiento
    if sort_dir.lower() == "asc":
        query = query.order_by(asc(getattr(Form, sort_by)))
    else:
        query = query.order_by(desc(getattr(Form, sort_by)))
    
    # Aplicamos paginación
    forms = query.offset((page - 1) * limit).limit(limit).all()
    
    # Construimos la respuesta
    response_data = {
        "items": [
            {
                "id": form.id,
                "uuid": str(form.uuid),
                "title": form.title,
                "description": form.description,
                "category_id": form.category_id,
                "subcategory_id": form.subcategory_id,
                "visibility": form.visibility,
                "version_number": form.version_number,
                "status": db.query(StatusType).filter(StatusType.id == form.status_id).first().code,
                "created_by": form.created_by,
                "created_at": form.created_at.isoformat() if form.created_at else None,
                "updated_at": form.updated_at.isoformat() if form.updated_at else None,
                "questions_count": db.query(FormQuestion).filter(FormQuestion.form_id == form.id).count()
            } for form in forms
        ],
        "pagination": {
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": page,
            "items_per_page": limit
        }
    }
    
    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Formularios obtenidos correctamente",
        request=request,
        data=jsonable_encoder(response_data)
    )

@router.post("/create-form",
             summary="Crear nuevo formulario",
             description="Crea un formulario nuevo a partir de un JSON con metadatos, preguntas y configuración.")
async def create_form(
    request: Request,
    form_data: FormEngineCreate = Body(...),
    db: Session = Depends(get_db)
):
    try:
        # Extraemos los datos del formulario
        form_state = form_data.state
        form_meta = form_state.get("metadata", {})
        form_config = form_state.get("formConfig", {})
        questions = form_state.get("questions", [])
        
        # Obtenemos el status_id para 'draft'
        draft_status = db.query(StatusType).filter(StatusType.code == "draft").first()
        if not draft_status:
            raise HTTPException(status_code=404, detail="Estado 'draft' no encontrado en la base de datos")
        
        # Creamos un nuevo registro de formulario
        new_form = Form(
            uuid=str(uuid4()),
            title=form_meta.get("title", "Formulario sin título"),
            description=form_meta.get("description", ""),
            category_id=form_config.get("categoryId"),
            subcategory_id=form_config.get("subcategoryId"),
            visibility=form_config.get("visibility", {}).get("type", "Privada"),
            allow_anonymous=form_config.get("visibility", {}).get("allowAnonymous", False),
            require_institutional_email=form_config.get("visibility", {}).get("requireInstitutionalEmail", False),
            limit_one_response=form_config.get("visibility", {}).get("limitOneResponsePerPerson", False),
            require_signature=form_config.get("requirements", {}).get("requireSignature", False),
            version_number=1,
            draft_data=jsonable_encoder(form_data),
            status_id=draft_status.id,
            created_by=request.state.user_id if hasattr(request.state, "user_id") else None,
        )
        
        db.add(new_form)
        db.commit()
        db.refresh(new_form)
        
        # Ahora guardamos las preguntas
        for idx, question_data in enumerate(questions):
            question_info = question_data.get("question", {})
            
            # Obtenemos el status_id para 'active'
            active_status = db.query(StatusType).filter(StatusType.code == "active").first()
            
            new_question = FormQuestion(
                form_id=new_form.id,
                question_uid=question_data.get("id", str(uuid4())),
                order=idx + 1,
                title=question_data.get("title", ""),
                description=question_data.get("description", ""),
                type=question_info.get("type", "text"),
                prompt=question_info.get("prompt", ""),
                is_required=question_info.get("required", False),
                validation=jsonable_encoder(question_info.get("validation", {})),
                extra_config=jsonable_encoder({
                    "options": question_info.get("options", []),
                    "items": question_info.get("items", []),
                    "min": question_info.get("min"),
                    "max": question_info.get("max"),
                    "step": question_info.get("step")
                }),
                status_id=active_status.id if active_status else draft_status.id,
            )
            
            db.add(new_question)
        
        db.commit()
        
        # Preparamos la respuesta
        result_data = {
            "form_id": new_form.id, 
            "uuid": new_form.uuid,
            "status": "created"
        }
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_FORM_CREATED,
            request=request,
            data=jsonable_encoder(result_data)
        )
        
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=500,
            message=f"Error al crear formulario: {str(e)}",
            request=request,
            data=None
        )


@router.post("/create-update",
             summary="Actualizar formulario",
             description="Actualiza un formulario existente a partir de su UUID. Solo posible si no está publicado.")
async def create_or_update_form(
    request: Request,
    form_data: FormEngineCreate = Body(...),
    db: Session = Depends(get_db)
):
    try:
        # Extraemos los datos del formulario
        form_state = form_data.state
        form_meta = form_state.get("metadata", {})
        form_id = form_meta.get("id")
        
        # Buscamos el formulario existente
        existing_form = db.query(Form).filter(Form.uuid == form_id).first()
        
        if not existing_form:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_404_NOT_FOUND,
                message="Formulario no encontrado",
                request=request,
                data=None
            )
        
        # Verificamos que no esté publicado
        published_status = db.query(StatusType).filter(StatusType.code == "published").first()
        if existing_form.status_id == published_status.id:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=400,
                message="No se puede actualizar un formulario publicado",
                request=request,
                data=None
            )
        
        # Actualizamos los datos del formulario
        form_config = form_state.get("formConfig", {})
        existing_form.title = form_meta.get("title", existing_form.title)
        existing_form.description = form_meta.get("description", existing_form.description)
        existing_form.category_id = form_config.get("categoryId", existing_form.category_id)
        existing_form.subcategory_id = form_config.get("subcategoryId", existing_form.subcategory_id)
        existing_form.visibility = form_config.get("visibility", {}).get("type", existing_form.visibility)
        existing_form.allow_anonymous = form_config.get("visibility", {}).get("allowAnonymous", existing_form.allow_anonymous)
        existing_form.require_institutional_email = form_config.get("visibility", {}).get("requireInstitutionalEmail", existing_form.require_institutional_email)
        existing_form.limit_one_response = form_config.get("visibility", {}).get("limitOneResponsePerPerson", existing_form.limit_one_response)
        existing_form.require_signature = form_config.get("requirements", {}).get("requireSignature", existing_form.require_signature)
        existing_form.draft_data = jsonable_encoder(form_data)
        existing_form.updated_at = datetime.now()
        
        # Ahora actualizamos las preguntas
        # Primero eliminamos todas las preguntas existentes
        db.query(FormQuestion).filter(FormQuestion.form_id == existing_form.id).delete()
        
        # Y agregamos las nuevas
        questions = form_state.get("questions", [])
        
        for idx, question_data in enumerate(questions):
            question_info = question_data.get("question", {})
            
            # Obtenemos el status_id para 'active'
            active_status = db.query(StatusType).filter(StatusType.code == "active").first()
            
            new_question = FormQuestion(
                form_id=existing_form.id,
                question_uid=question_data.get("id", str(uuid4())),
                order=idx + 1,
                title=question_data.get("title", ""),
                description=question_data.get("description", ""),
                type=question_info.get("type", "text"),
                prompt=question_info.get("prompt", ""),
                is_required=question_info.get("required", False),
                validation=jsonable_encoder(question_info.get("validation", {})),
                extra_config=jsonable_encoder({
                    "options": question_info.get("options", []),
                    "items": question_info.get("items", []),
                    "min": question_info.get("min"),
                    "max": question_info.get("max"),
                    "step": question_info.get("step")
                }),
                status_id=active_status.id if active_status else 1,
            )
            
            db.add(new_question)
        
        db.commit()
        
        # Preparamos la respuesta
        result_data = {
            "form_id": existing_form.id, 
            "uuid": existing_form.uuid,
            "status": "updated"
        }
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_FORM_UPDATED,
            request=request,
            data=jsonable_encoder(result_data)
        )
        
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=500,
            message=f"Error al actualizar formulario: {str(e)}",
            request=request,
            data=None
        )


@router.post("/form-publish",
             summary="Publicar formulario",
             description="Marca un formulario como publicado. Un formulario publicado no puede ser modificado.")
async def publish_form(
    request: Request,
    form_data: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    try:
        form_id = form_data.get("uuid")
        if not form_id:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=400,
                message="UUID del formulario no proporcionado",
                request=request,
                data=None
            )
            
        existing_form = db.query(Form).filter(Form.uuid == form_id).first()
        
        if not existing_form:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_404_NOT_FOUND,
                message="Formulario no encontrado",
                request=request,
                data=None
            )
        
        # Obtenemos el status_id para 'published'
        published_status = db.query(StatusType).filter(StatusType.code == "published").first()
        if not published_status:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=404,
                message="Estado 'published' no encontrado en la base de datos",
                request=request,
                data=None
            )
        
        # Actualizamos el estado del formulario
        existing_form.status_id = published_status.id
        existing_form.updated_at = datetime.now()
        
        db.commit()
        
        # Preparamos la respuesta
        result_data = {
            "form_id": existing_form.id, 
            "uuid": existing_form.uuid,
            "status": "published"
        }
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_FORM_PUBLISHED,
            request=request,
            data=jsonable_encoder(result_data)
        )
        
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=500,
            message=f"Error al publicar formulario: {str(e)}",
            request=request,
            data=None
        )


@router.post("/clone-form",
             summary="Clonar formulario",
             description="Clona un formulario existente (publicado o no), creando una nueva versión editable.")
async def clone_form(
    request: Request,
    form_data: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    try:
        original_form_id = form_data.get("uuid")
        if not original_form_id:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=400,
                message="UUID del formulario original no proporcionado",
                request=request,
                data=None
            )
            
        original_form = db.query(Form).filter(Form.uuid == original_form_id).first()
        
        if not original_form:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_404_NOT_FOUND,
                message="Formulario original no encontrado",
                request=request,
                data=None
            )
        
        # Obtenemos el status_id para 'draft'
        draft_status = db.query(StatusType).filter(StatusType.code == "draft").first()
        if not draft_status:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=404,
                message="Estado 'draft' no encontrado en la base de datos",
                request=request,
                data=None
            )
        
        # Creamos el nuevo formulario clonado
        new_form = Form(
            uuid=str(uuid4()),
            title=f"{original_form.title} (copia)",
            description=original_form.description,
            category_id=original_form.category_id,
            subcategory_id=original_form.subcategory_id,
            visibility=original_form.visibility,
            allow_anonymous=original_form.allow_anonymous,
            require_institutional_email=original_form.require_institutional_email,
            limit_one_response=original_form.limit_one_response,
            require_signature=original_form.require_signature,
            version_number=original_form.version_number + 1,
            parent_form_id=original_form.id,
            draft_data=original_form.draft_data,
            status_id=draft_status.id,
            created_by=request.state.user_id if hasattr(request.state, "user_id") else None
        )
        
        db.add(new_form)
        db.commit()
        db.refresh(new_form)
        
        # Ahora clonamos las preguntas
        original_questions = db.query(FormQuestion).filter(
            FormQuestion.form_id == original_form.id
        ).order_by(FormQuestion.order).all()
        
        for question in original_questions:
            new_question = FormQuestion(
                form_id=new_form.id,
                question_uid=str(uuid4()),
                order=question.order,
                title=question.title,
                description=question.description,
                type=question.type,
                prompt=question.prompt,
                is_required=question.is_required,
                validation=question.validation,
                extra_config=question.extra_config,
                status_id=question.status_id
            )
            
            db.add(new_question)
        
        db.commit()
        
        # Preparamos la respuesta
        result_data = {
            "form_id": new_form.id, 
            "uuid": new_form.uuid,
            "status": "cloned",
            "original_form_id": original_form.id,
            "original_form_uuid": original_form.uuid
        }
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_FORM_CLONED,
            request=request,
            data=jsonable_encoder(result_data)
        )
        
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=500,
            message=f"Error al clonar formulario: {str(e)}",
            request=request,
            data=None
        )


@router.post("/disabled-form",
             summary="Deshabilitar formulario",
             description="Marca un formulario como deshabilitado, dejándolo inaccesible para nuevos usuarios.")
async def disable_form(
    request: Request,
    form_data: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db)
):
    try:
        form_id = form_data.get("uuid")
        if not form_id:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=400,
                message="UUID del formulario no proporcionado",
                request=request,
                data=None
            )
            
        existing_form = db.query(Form).filter(Form.uuid == form_id).first()
        
        if not existing_form:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=HTTP_404_NOT_FOUND,
                message="Formulario no encontrado",
                request=request,
                data=None
            )
        
        # Obtenemos el status_id para 'disabled'
        disabled_status = db.query(StatusType).filter(StatusType.code == "disabled").first()
        if not disabled_status:
            return create_response(
                status=RESPONSE_STATUS_ERROR,
                status_code=404,
                message="Estado 'disabled' no encontrado en la base de datos",
                request=request,
                data=None
            )
        
        # Actualizamos el estado del formulario
        existing_form.status_id = disabled_status.id
        existing_form.updated_at = datetime.now()
        
        db.commit()
        
        # Preparamos la respuesta
        result_data = {
            "form_id": existing_form.id, 
            "uuid": existing_form.uuid,
            "status": "disabled"
        }
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message=SUCCESS_FORM_DISABLED,
            request=request,
            data=jsonable_encoder(result_data)
        )
        
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=500,
            message=f"Error al deshabilitar formulario: {str(e)}",
            request=request,
            data=None
        )

@router.get(
    "/published",
    summary="Listar formularios publicados",
    description="Retorna todos los formularios que han sido marcados como publicados y están disponibles para uso en producción."
)
def list_published_forms(
    request: Request,
    db: Session = Depends(get_db),
    page: int = Query(1, description="Número de página"),
    limit: int = Query(10, description="Límite de resultados por página")
):
    # Obtenemos el status_id para 'published'
    published_status = db.query(StatusType).filter(StatusType.code == "published").first()
    if not published_status:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=404,
            message="Estado 'published' no encontrado en la base de datos",
            request=request,
            data=None
        )
    
    # Consulta base
    query = db.query(Form).filter(Form.status_id == published_status.id)
    
    # Contamos el total de registros para paginación
    total_items = query.count()
    total_pages = (total_items + limit - 1) // limit if total_items > 0 else 1
    
    # Aplicamos paginación
    forms = query.order_by(desc(Form.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    # Construimos la respuesta
    response_data = {
        "items": [
            {
                "id": form.id,
                "uuid": form.uuid,
                "title": form.title,
                "description": form.description,
                "category_id": form.category_id,
                "subcategory_id": form.subcategory_id,
                "visibility": form.visibility,
                "version_number": form.version_number,
                "created_by": form.created_by,
                "created_at": form.created_at,
                "updated_at": form.updated_at,
                "questions_count": db.query(FormQuestion).filter(FormQuestion.form_id == form.id).count()
            } for form in forms
        ],
        "pagination": {
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": page,
            "items_per_page": limit
        }
    }
    
    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Formularios publicados obtenidos correctamente",
        request=request,
        data=jsonable_encoder(response_data)
    )

@router.get(
    "/drafts",
    summary="Listar formularios en borrador",
    description="Retorna todos los formularios que aún están en estado de edición (no publicados), y pueden ser modificados por los usuarios autorizados."
)
def list_draft_forms(
    request: Request,
    db: Session = Depends(get_db),
    page: int = Query(1, description="Número de página"),
    limit: int = Query(10, description="Límite de resultados por página")
):
    # Obtenemos el status_id para 'draft'
    draft_status = db.query(StatusType).filter(StatusType.code == "draft").first()
    if not draft_status:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=404,
            message="Estado 'draft' no encontrado en la base de datos",
            request=request,
            data=None
        )
    
    # Consulta base
    query = db.query(Form).filter(Form.status_id == draft_status.id)
    
    # Contamos el total de registros para paginación
    total_items = query.count()
    total_pages = (total_items + limit - 1) // limit if total_items > 0 else 1
    
    # Aplicamos paginación
    forms = query.order_by(desc(Form.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    # Construimos la respuesta
    response_data = {
        "items": [
            {
                "id": form.id,
                "uuid": form.uuid,
                "title": form.title,
                "description": form.description,
                "category_id": form.category_id,
                "subcategory_id": form.subcategory_id,
                "visibility": form.visibility,
                "version_number": form.version_number,
                "created_by": form.created_by,
                "created_at": form.created_at,
                "updated_at": form.updated_at,
                "questions_count": db.query(FormQuestion).filter(FormQuestion.form_id == form.id).count()
            } for form in forms
        ],
        "pagination": {
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": page,
            "items_per_page": limit
        }
    }
    
    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Formularios en borrador obtenidos correctamente",
        request=request,
        data=jsonable_encoder(response_data)
    )

@router.get("/sync",
            summary="Sincronizar formularios publicados",
            description="Devuelve la lista de formularios publicados que deben estar disponibles en el dispositivo para uso offline o ejecución remota.")
async def sync_published_forms(
    request: Request,
    db: Session = Depends(get_db)
):
    # Obtenemos el status_id para 'published'
    published_status = db.query(StatusType).filter(StatusType.code == "published").first()
    if not published_status:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=404,
            message="Estado 'published' no encontrado en la base de datos",
            request=request,
            data=None
        )
    
    # Obtenemos todos los formularios publicados
    forms = db.query(Form).filter(Form.status_id == published_status.id).all()
    
    # Preparamos la respuesta
    response_data = {
        "sync_at": datetime.now().isoformat(),
        "forms": [
            {
                "form_id": form.id,
                "uuid": form.uuid,
                "title": form.title,
                "version": f"v{form.version_number}.0"
            } for form in forms
        ]
    }
    
    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Formularios sincronizados correctamente",
        request=request,
        data=jsonable_encoder(response_data)
    )

@router.get("/{form_id}",
            summary="Obtener detalles de un formulario",
            description="Devuelve los detalles completos de un formulario específico según su ID o UUID.")
async def get_form_details(
    request: Request,
    form_id: str = Path(..., description="ID o UUID del formulario"),
    db: Session = Depends(get_db)
):
    # Primero intentamos buscar por UUID
    form = db.query(Form).filter(Form.uuid == form_id).first()
    
    # Si no lo encontramos, intentamos buscar por ID (si es un número)
    if not form and form_id.isdigit():
        form = db.query(Form).filter(Form.id == int(form_id)).first()
    
    if not form:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_404_NOT_FOUND,
            message="Formulario no encontrado",
            request=request,
            data=None
        )
    
    # Obtenemos información adicional
    status = db.query(StatusType).filter(StatusType.id == form.status_id).first()
    questions = db.query(FormQuestion).filter(FormQuestion.form_id == form.id).order_by(FormQuestion.order).all()
    
    # Obtenemos el creador
    creator = None
    if form.created_by:
        creator = db.query(User).filter(User.id == form.created_by).first()
    
    # Obtenemos categoría y subcategoría si existen
    category = None
    subcategory = None
    if form.category_id:
        category = db.query(Category).filter(Category.id == form.category_id).first()
    if form.subcategory_id:
        subcategory = db.query(Subcategory).filter(Subcategory.id == form.subcategory_id).first()
    
    # Preparamos la respuesta detallada
    form_details = {
        "id": form.id,
        "uuid": form.uuid,
        "title": form.title,
        "description": form.description,
        "category": {
            "id": category.id if category else None,
            "name": category.name if category else None
        },
        "subcategory": {
            "id": subcategory.id if subcategory else None,
            "name": subcategory.name if subcategory else None
        },
        "visibility": form.visibility,
        "allow_anonymous": form.allow_anonymous,
        "require_institutional_email": form.require_institutional_email,
        "limit_one_response": form.limit_one_response,
        "require_signature": form.require_signature,
        "deadline": form.deadline.isoformat() if form.deadline else None,
        "deadline_time": str(form.deadline_time) if form.deadline_time else None,
        "version_number": form.version_number,
        "parent_form_id": form.parent_form_id,
        "status": {
            "id": status.id if status else None,
            "code": status.code if status else None,
            "name": status.name if status else None
        },
        "created_by": {
            "id": creator.id if creator else None,
            "name": creator.full_name if creator else None
        },
        "created_at": form.created_at.isoformat() if form.created_at else None,
        "updated_at": form.updated_at.isoformat() if form.updated_at else None,
        "questions": [
            {
                "id": q.id,
                "uid": q.question_uid,
                "order": q.order,
                "title": q.title,
                "description": q.description,
                "type": q.type,
                "prompt": q.prompt,
                "is_required": q.is_required,
                "validation": q.validation,
                "extra_config": q.extra_config
            } for q in questions
        ],
        "draft_data": form.draft_data
    }
    
    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Detalles del formulario obtenidos correctamente",
        request=request,
        data=jsonable_encoder(form_details)
    )

@router.delete("/{form_id}",
               summary="Eliminar formulario",
               description="Elimina un formulario específico según su ID o UUID.")
async def delete_form(
    request: Request,
    form_id: str = Path(..., description="ID o UUID del formulario"),
    db: Session = Depends(get_db)
):
    # Primero intentamos buscar por UUID
    form = db.query(Form).filter(Form.uuid == form_id).first()
    
    # Si no lo encontramos, intentamos buscar por ID (si es un número)
    if not form and form_id.isdigit():
        form = db.query(Form).filter(Form.id == int(form_id)).first()
    
    if not form:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_404_NOT_FOUND,
            message="Formulario no encontrado",
            request=request,
            data=None
        )
    
    # Verificamos permisos (aquí se podría implementar lógica adicional)
    
    try:
        # Primero eliminamos las preguntas asociadas
        db.query(FormQuestion).filter(FormQuestion.form_id == form.id).delete()
        
        # Luego eliminamos el formulario
        db.delete(form)
        db.commit()
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message="Formulario eliminado correctamente",
            request=request,
            data=None
        )
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=500,
            message=f"Error al eliminar formulario: {str(e)}",
            request=request,
            data=None
        )

@router.get("/{form_id}/questions",
            summary="Obtener preguntas de un formulario",
            description="Devuelve la lista de preguntas asociadas a un formulario específico.")
async def get_form_questions(
    request: Request,
    form_id: str = Path(..., description="ID o UUID del formulario"),
    db: Session = Depends(get_db)
):
    # Primero intentamos buscar por UUID
    form = db.query(Form).filter(Form.uuid == form_id).first()
    
    # Si no lo encontramos, intentamos buscar por ID (si es un número)
    if not form and form_id.isdigit():
        form = db.query(Form).filter(Form.id == int(form_id)).first()
    
    if not form:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_404_NOT_FOUND,
            message="Formulario no encontrado",
            request=request,
            data=None
        )
    
    # Obtenemos todas las preguntas del formulario
    questions = db.query(FormQuestion).filter(FormQuestion.form_id == form.id).order_by(FormQuestion.order).all()
    
    # Preparamos la respuesta
    questions_data = [
        {
            "id": q.id,
            "uid": q.question_uid,
            "order": q.order,
            "title": q.title,
            "description": q.description,
            "type": q.type,
            "prompt": q.prompt,
            "is_required": q.is_required,
            "validation": q.validation,
            "extra_config": q.extra_config
        } for q in questions
    ]
    
    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Preguntas del formulario obtenidas correctamente",
        request=request,
        data=jsonable_encoder(questions_data)
    )

@router.post("/{form_id}/questions/reorder",
             summary="Reordenar preguntas",
             description="Actualiza el orden de las preguntas en un formulario.")
async def reorder_questions(
    request: Request,
    form_id: str = Path(..., description="ID o UUID del formulario"),
    order_data: List[Dict[str, Any]] = Body(..., description="Nueva ordenación de preguntas"),
    db: Session = Depends(get_db)
):
    # Primero intentamos buscar por UUID
    form = db.query(Form).filter(Form.uuid == form_id).first()
    
    # Si no lo encontramos, intentamos buscar por ID (si es un número)
    if not form and form_id.isdigit():
        form = db.query(Form).filter(Form.id == int(form_id)).first()
    
    if not form:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_404_NOT_FOUND,
            message="Formulario no encontrado",
            request=request,
            data=None
        )
    
    # Verificamos que el formulario no esté publicado
    published_status = db.query(StatusType).filter(StatusType.code == "published").first()
    if form.status_id == published_status.id:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=400,
            message="No se puede reordenar preguntas de un formulario publicado",
            request=request,
            data=None
        )
    
    try:
        # Actualizamos el orden de cada pregunta
        for item in order_data:
            question_id = item.get("id")
            new_order = item.get("order")
            
            if question_id and new_order is not None:
                # Intentamos buscar primero por question_uid
                question = db.query(FormQuestion).filter(
                    FormQuestion.form_id == form.id,
                    FormQuestion.question_uid == question_id
                ).first()
                
                # Si no lo encontramos, intentamos por ID
                if not question and str(question_id).isdigit():
                    question = db.query(FormQuestion).filter(
                        FormQuestion.form_id == form.id,
                        FormQuestion.id == int(question_id)
                    ).first()
                
                if question:
                    question.order = new_order
        
        db.commit()
        
        # Obtenemos las preguntas actualizadas
        questions = db.query(FormQuestion).filter(FormQuestion.form_id == form.id).order_by(FormQuestion.order).all()
        
        # Preparamos la respuesta
        questions_data = [
            {
                "id": q.id,
                "uid": q.question_uid,
                "order": q.order,
                "title": q.title
            } for q in questions
        ]
        
        return create_response(
            status=RESPONSE_STATUS_SUCCESS,
            status_code=HTTP_200_OK,
            message="Preguntas reordenadas correctamente",
            request=request,
            data=jsonable_encoder(questions_data)
        )
    except Exception as e:
        db.rollback()
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=500,
            message=f"Error al reordenar preguntas: {str(e)}",
            request=request,
            data=None
        )

@router.get("/{form_id}/responses",
            summary="Obtener respuestas de un formulario",
            description="Devuelve la lista de respuestas enviadas para un formulario específico.")
async def get_form_responses(
    request: Request,
    form_id: str = Path(..., description="ID o UUID del formulario"),
    page: int = Query(1, description="Número de página"),
    limit: int = Query(10, description="Límite de resultados por página"),
    db: Session = Depends(get_db)
):
    from models.form_response import FormResponse
    from models.response_answer import ResponseAnswer
    
    # Primero intentamos buscar por UUID
    form = db.query(Form).filter(Form.uuid == form_id).first()
    
    # Si no lo encontramos, intentamos buscar por ID (si es un número)
    if not form and form_id.isdigit():
        form = db.query(Form).filter(Form.id == int(form_id)).first()
    
    if not form:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_404_NOT_FOUND,
            message="Formulario no encontrado",
            request=request,
            data=None
        )
    
    # Consulta base para obtener respuestas
    query = db.query(FormResponse).filter(FormResponse.form_id == form.id)
    
    # Contamos el total de registros para paginación
    total_items = query.count()
    total_pages = (total_items + limit - 1) // limit if total_items > 0 else 1
    
    # Aplicamos paginación
    responses = query.order_by(desc(FormResponse.submitted_at)).offset((page - 1) * limit).limit(limit).all()
    
    # Preparamos la respuesta
    response_data = {
        "items": [],
        "pagination": {
            "total_items": total_items,
            "total_pages": total_pages,
            "current_page": page,
            "items_per_page": limit
        }
    }
    
    # Para cada respuesta, obtenemos los detalles
    for response in responses:
        # Buscamos el usuario que respondió (si no es anónimo)
        user = None
        if response.user_id:
            user = db.query(User).filter(User.id == response.user_id).first()
        
        # Obtenemos el estado
        status = db.query(StatusType).filter(StatusType.id == response.status_id).first()
        
        # Obtenemos las respuestas a cada pregunta
        answers = db.query(ResponseAnswer).filter(ResponseAnswer.response_id == response.id).all()
        
        # Formateamos la respuesta
        response_item = {
            "id": response.id,
            "token": response.response_token,
            "submitted_at": response.submitted_at.isoformat() if response.submitted_at else None,
            "status": {
                "id": status.id if status else None,
                "code": status.code if status else None,
                "name": status.name if status else None
            },
            "respondent": {
                "user_id": user.id if user else None,
                "name": user.full_name if user else response.signed_by_name,
                "email": user.email if user else response.signed_by_email
            },
            "ip_address": response.ip_address,
            "answers_count": len(answers)
        }
        
        response_data["items"].append(response_item)
    
    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Respuestas del formulario obtenidas correctamente",
        request=request,
        data=jsonable_encoder(response_data)
    )

@router.get("/{form_id}/stats",
            summary="Estadísticas del formulario",
            description="Devuelve estadísticas generales sobre un formulario específico.")
async def get_form_stats(
    request: Request,
    form_id: str = Path(..., description="ID o UUID del formulario"),
    db: Session = Depends(get_db)
):
    from models.form_response import FormResponse
    from models.response_answer import ResponseAnswer
    from sqlalchemy import func
    
    # Primero intentamos buscar por UUID
    form = db.query(Form).filter(Form.uuid == form_id).first()
    
    # Si no lo encontramos, intentamos buscar por ID (si es un número)
    if not form and form_id.isdigit():
        form = db.query(Form).filter(Form.id == int(form_id)).first()
    
    if not form:
        return create_response(
            status=RESPONSE_STATUS_ERROR,
            status_code=HTTP_404_NOT_FOUND,
            message="Formulario no encontrado",
            request=request,
            data=None
        )
    
    # Contamos las preguntas
    questions_count = db.query(FormQuestion).filter(FormQuestion.form_id == form.id).count()
    
    # Contamos las respuestas
    responses_count = db.query(FormResponse).filter(FormResponse.form_id == form.id).count()
    
    # Agrupamos respuestas por día
    daily_responses = db.query(
        func.date(FormResponse.submitted_at).label('date'),
        func.count().label('count')
    ).filter(
        FormResponse.form_id == form.id
    ).group_by(
        func.date(FormResponse.submitted_at)
    ).all()
    
    # Contamos respuestas por tipo de usuario (registrado vs anónimo)
    registered_responses = db.query(FormResponse).filter(
        FormResponse.form_id == form.id,
        FormResponse.user_id.isnot(None)
    ).count()
    
    anonymous_responses = responses_count - registered_responses
    
    # Tasa de finalización (si aplica)
    completion_rate = 0
    if responses_count > 0:
        completed_responses = db.query(FormResponse).filter(
            FormResponse.form_id == form.id,
            # Asumiendo que un estado 'completed' indica respuesta completa
            FormResponse.status_id == db.query(StatusType.id).filter(StatusType.code == "completed").scalar()
        ).count()
        
        completion_rate = (completed_responses / responses_count) * 100
    
    # Preparamos las estadísticas
    stats = {
        "form_info": {
            "id": form.id,
            "uuid": form.uuid,
            "title": form.title,
            "created_at": form.created_at.isoformat() if form.created_at else None,
        },
        "questions_count": questions_count,
        "responses": {
            "total": responses_count,
            "registered_users": registered_responses,
            "anonymous": anonymous_responses,
            "completion_rate": completion_rate
        },
        "daily_responses": [
            {
                "date": str(record.date),
                "count": record.count
            } for record in daily_responses
        ],
        "status": {
            "is_published": form.status_id == db.query(StatusType.id).filter(StatusType.code == "published").scalar(),
            "days_active": (datetime.now() - form.created_at).days if form.created_at else 0
        }
    }
    
    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Estadísticas del formulario obtenidas correctamente",
        request=request,
        data=jsonable_encoder(stats)
    )