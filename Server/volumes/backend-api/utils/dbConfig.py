#volumes\backend-api\utils\dbConfig.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Cargar variables de entorno
load_dotenv()

Base = declarative_base()

class DatabaseConfig:
    """Clase para encapsular la configuración de la base de datos."""
    
    def __init__(self):
        self.__database = os.getenv("MYSQL_DATABASE")
        self.__user = os.getenv("MYSQL_USER")
        self.__password = os.getenv("MYSQL_PASSWORD")
        self.__host = os.getenv("MYSQL_HOST")
        self.__port = os.getenv("MYSQL_PORT")

        # Validar que todas las variables necesarias están definidas
        if not all([self.__database, self.__user, self.__password, self.__host, self.__port]):
            raise ValueError("Faltan variables de entorno para la configuración de la base de datos.")

        self.__connection_url = self.__generate_connection_url()

    def __generate_connection_url(self) -> str:
        """Genera la URL de conexión a la base de datos."""
        return f"mysql+pymysql://{self.__user}:{self.__password}@{self.__host}:{self.__port}/{self.__database}"

    @property
    def connection_url(self) -> str:
        """Devuelve la URL de conexión."""
        return self.__connection_url

    @property
    def database_name(self) -> str:
        """Devuelve el nombre de la base de datos."""
        return self.__database

# Instancia única para evitar múltiples cargas
db_config = DatabaseConfig()

# Intentar crear la conexión a la base de datos
try:
    engine = create_engine(db_config.connection_url, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
except Exception as e:
    raise RuntimeError(f"Error al conectar con la base de datos: {e}")

# 🔹 Dependencia para manejar la conexión a la base de datos en FastAPI
def get_db():
    """Maneja la sesión de base de datos para FastAPI, asegurando cierre correcto."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
