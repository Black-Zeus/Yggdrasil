from fastapi.middleware.cors import CORSMiddleware
from middlewares.auth_middleware import AuthMiddleware

def register_middlewares(app):
    # Middleware de CORS
    origins = [
        "http://localhost:3000",
        "https://tudominio.cl",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=[
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin"
        ],
    )

    # Middleware personalizado de autenticación
    app.add_middleware(AuthMiddleware)
