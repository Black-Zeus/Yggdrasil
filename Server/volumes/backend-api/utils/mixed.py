from dependencies.constants import (  
    ENV,
    ENV_DEV
)

# ==============================
# 🔹 Función Utilitaria para Entorno de Desarrollo
# ==============================
def is_dev_environment():
    return  ENV_DEV.upper() == ENV.upper()