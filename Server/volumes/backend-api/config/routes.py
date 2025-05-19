from fastapi import FastAPI
from routes import (
    health_services,
    auth,
    users,
    form_engine,
    menu_item,
    device
)

def register_routes(app: FastAPI):
    app.include_router(health_services.router)
    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(menu_item.router)
    app.include_router(form_engine.router)
    app.include_router(device.router)
