import logging
import os
from logging.handlers import TimedRotatingFileHandler, RotatingFileHandler
from dotenv import load_dotenv
from dependencies.constants import (  # 📌 Importamos constantes para evitar Magic Strings
    LOG_BACKEND_ENV,
    LOG_FILE_DIRECTORY,
    ENV,
    ENV_DEV,
    ENV_QA,
    ENV_PROD,
    LOG_STORE_CONSOLE,
    LOG_STORE_FILE,
    LOG_STORE_MIX,
    LOG_ROTATION_TIME,
    LOG_ROTATION_SIZE,
    LOG_DEFAULT_INTERVAL
)

# Cargar variables de entorno desde .env
load_dotenv()

# 📌 Cada contenedor define manualmente su variable de log
LOG_NAME_ENV = os.getenv(LOG_BACKEND_ENV, "app").upper()
LOG_FILE_PATH = f"{LOG_FILE_DIRECTORY}/{LOG_NAME_ENV}.log"

# Leer configuración de entorno
LOG_STORES = os.getenv("LOG_STORES", LOG_STORE_CONSOLE).lower()
LOG_ROTATION_TYPE = os.getenv("LOG_ROTATION_TYPE", LOG_ROTATION_TIME).lower()
LOG_ROTATION_INTERVAL = int(os.getenv("LOG_ROTATION_INTERVAL", LOG_DEFAULT_INTERVAL))

# Definir niveles de logging según entorno
LOG_LEVELS = {
    ENV_DEV: logging.DEBUG,
    ENV_QA: logging.WARNING,
    ENV_PROD: logging.ERROR
}

LOG_LEVEL = LOG_LEVELS.get(ENV, logging.DEBUG)

def setup_logging():
    """
    Configura el sistema de logging en base a la variable LOG_STORES y maneja la rotación de logs.
    """
    log_format = "%(asctime)s - %(levelname)s - %(message)s"
    log_handlers = []

    # Crear carpeta logs si no existe
    os.makedirs(os.path.dirname(LOG_FILE_PATH), exist_ok=True)

    # Configurar logging en consola
    if LOG_STORES in [LOG_STORE_CONSOLE, LOG_STORE_MIX]:
        console_handler = logging.StreamHandler()
        console_handler.setLevel(LOG_LEVEL)
        console_handler.setFormatter(logging.Formatter(log_format))
        log_handlers.append(console_handler)

    # Configurar logging en archivo con rotación
    if LOG_STORES in [LOG_STORE_FILE, LOG_STORE_MIX]:
        if LOG_ROTATION_TYPE == LOG_ROTATION_TIME:
            file_handler = TimedRotatingFileHandler(
                LOG_FILE_PATH, when="D", interval=LOG_ROTATION_INTERVAL, backupCount=5, encoding="utf-8"
            )  
        elif LOG_ROTATION_TYPE == LOG_ROTATION_SIZE:
            file_handler = RotatingFileHandler(
                LOG_FILE_PATH, maxBytes=LOG_ROTATION_INTERVAL * 1024 * 1024, backupCount=5, encoding="utf-8"
            )  
        else:
            file_handler = logging.FileHandler(LOG_FILE_PATH, encoding="utf-8")

        file_handler.setLevel(LOG_LEVEL)
        file_handler.setFormatter(logging.Formatter(log_format))
        log_handlers.append(file_handler)

    logging.basicConfig(level=LOG_LEVEL, handlers=log_handlers)

# Ejecutar configuración de logging al importar el módulo
setup_logging()

def log_event(level: str, message: str, extra_data=None):
    """
    Registra logs generales para depuración de procesos internos.
    """
    log_message = f"{message}"
    if extra_data:
        log_message += f" | Extra Data: {extra_data}"

    level = level.lower()
    if level == "debug":
        logging.debug(log_message)
    elif level == "info":
        logging.info(log_message)
    elif level == "warning":
        logging.warning(log_message)
    elif level == "error":
        logging.error(log_message)
    elif level == "critical":
        logging.critical(log_message)
    else:
        logging.info(log_message)
