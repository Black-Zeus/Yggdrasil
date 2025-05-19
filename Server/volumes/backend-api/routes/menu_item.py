from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from utils.dbConfig import get_db
from models.menu_item import MenuItem
from schemas.menu_item import MenuItemTree, MenuItemWithChildren

from fastapi.encoders import jsonable_encoder
from dependencies.response_handler import create_response
from dependencies.constants import (
    HTTP_200_OK,
    RESPONSE_STATUS_SUCCESS
)

router = APIRouter(prefix="/menus", tags=["Menus"])

def build_tree(items: list[MenuItem], parent_id=None) -> list[MenuItemWithChildren]:
    return [
        MenuItemWithChildren(
            id=item.id,
            label=item.label,
            path=item.path,
            icon=item.icon,
            order=item.order,
            is_active=item.is_active,
            parent_id=item.parent_id,
            created_at=item.created_at,
            updated_at=item.updated_at,
            children=build_tree(items, item.id)
        )
        for item in items if item.parent_id == parent_id
    ]


@router.get("/", response_model=MenuItemTree)
def get_menus(request: Request, db: Session = Depends(get_db)):
    """
    Devuelve el árbol completo de menús desde la base de datos.
    """
    all_items = db.query(MenuItem).filter(MenuItem.is_active == True).all()
    tree = build_tree(all_items)
    menu = MenuItemTree(items=tree)

    return create_response(
        status=RESPONSE_STATUS_SUCCESS,
        status_code=HTTP_200_OK,
        message="Usuarios obtenidos correctamente",
        request=request,
        data=jsonable_encoder(menu)
    )