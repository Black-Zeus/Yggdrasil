import os

# ==========================================
# 🔹 1️⃣ Entorno de Ejecución
# ==========================================
ENV_DEV = "DEV"
ENV_QA = "QA"
ENV_PROD = "PRD"
ENV_NAME = os.getenv("ENV_NAME", "Desconocido")
ENV = os.getenv("BACKEND_ENV", "Desconocido").upper()


# ==========================================
# 🔹 2️⃣ Rutas Públicas que se Excluyen del Middleware
# ==========================================
PUBLIC_EXCLUDE_ROUTES = [
    "/swagger",
    "/openapi.json",
    "/health/",
    "/auth/login",
    "/auth/recover-password",
    "/auth/generate-password",
    "/auth/generate-uuid-token"
]

# ==========================================
# 🔹 3️⃣ Tokens y Seguridad
# ==========================================
TOKEN_PREFIX = "Bearer "

# ==========================================
# 🔹 4️⃣ Estados de Respuesta
# ==========================================
RESPONSE_STATUS_SUCCESS = "success"
RESPONSE_STATUS_ERROR = "error"

# ==========================================
# 🔹 5️⃣ Tipos de Respuesta
# ==========================================
RESPONSE_TYPE_SINGLE = "single"
RESPONSE_TYPE_COLLECTION = "collection"

# ==========================================
# 🔹 6️⃣ Valores Predeterminados
# ==========================================
DEFAULT_RESPONSE_NAME = "default"

# ==========================================
# 🔹 7️⃣ Mensajes de Error
# ==========================================
ERROR_AUTH = "Unauthorized access"
ERROR_NOT_FOUND = "Resource not found"
ERROR_INVALID_INPUT = "Invalid input"
ERROR_USER_NOT_FOUND = "User not found or has been deleted"
ERROR_EMAIL_REGISTERED = "Email is already registered"
ERROR_IP_NOT_IMPLEMENTED = "Real IP capture not implemented yet"
ERROR_INVALID_CREDENTIALS = "Invalid credentials"
ERROR_INACTIVE_USER = "Inactive user. Please contact the administrator."
ERROR_INVALID_JWT_SECRET = "Invalid JWT secret"
ERROR_INVALID_RESET_TOKEN = "Invalid password reset token"
ERROR_DB_CONNECTION = "Database connection error"
ERROR_REDIS_CONNECTION = "Redis connection error"
ERROR_AUTH_INVALID_TOKEN = "Missing or invalid authentication token"
ERROR_ENV_RESTRICTED = "This endpoint is only available in development environments"

# ==========================================
# 🔹 8️⃣ Mensajes de Éxito
# ==========================================
SUCCESS_CREATED = "Item created successfully"
SUCCESS_UPDATED = "Item updated successfully"
SUCCESS_DELETED = "Item deleted successfully"
SUCCESS_USER_CREATED = "User created successfully"
SUCCESS_USER_UPDATED = "User updated successfully"
SUCCESS_USER_DELETED = "User marked as deleted successfully"
SUCCESS_LOGIN = "Login successful"
SUCCESS_RECOVERY_TOKEN = "Recovery token generated successfully"
SUCCESS_PASSWORD_RESET = "Password reset successfully"
SUCCESS_PASSWORD_GENERATED = "Password generated successfully"
SUCCESS_API_HEALTH = "API health status retrieved successfully"
SUCCESS_DB_CONNECTION = "Database connection successful"
SUCCESS_REDIS_CONNECTION = "Redis connection successful"
SUCCESS_DB_CONFIG = "Database configuration retrieved successfully"
SUCCESS_REDIS_CONFIG = "Redis configuration retrieved successfully"
SUCCESS_JWT_VALIDATION = "JWT validation successful"
SUCCESS_USER_RETRIEVED = "User retrieved successfully"

# ==========================================
# 🔹 Mensajes de Error para JWT
# ==========================================
ERROR_INVALID_TOKEN = "Invalid token: missing `user_id`"
ERROR_EXPIRED_ACCESS_TOKEN = "Access token has expired"
ERROR_EXPIRED_REFRESH_TOKEN = "Refresh token has expired"
ERROR_INVALID_REFRESH_TOKEN = "Invalid or expired refresh token"
ERROR_USER_SECRET_NOT_FOUND = "User secret could not be retrieved"

# ==========================================
# 🔹 9️⃣ Configuración de Logging
# ==========================================
LOG_LEVEL_INFO = "info"
LOG_LEVEL_DEBUG = "debug"
LOG_LEVEL_WARNING = "warning"
LOG_LEVEL_ERROR = "error"

# ==========================================
# 🔹 🔟 Configuración de Logs y Rotación
# ==========================================
LOG_BACKEND_ENV = "LOG_BACKEND"
LOG_FILE_DIRECTORY = "logs"
LOG_STORE_CONSOLE = "console"
LOG_STORE_FILE = "file"
LOG_STORE_MIX = "mix"
LOG_ROTATION_TIME = "time"
LOG_ROTATION_SIZE = "size"
LOG_DEFAULT_INTERVAL = 1  # Valor por defecto para la rotación

# ==========================================
# 🔹 Configuración de JWT
# ==========================================
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRATION_MINUTES = 120  # Expira en 15 min
REFRESH_TOKEN_EXPIRATION_DAYS = 7  # Expira en 7 días

# ==========================================
# 🔹 Estados Base
# ==========================================
BASE_ACTIVE_STATUS=1

# ==========================================
# 🔹 HTTP Status Codes
# ==========================================
HTTP_200_OK = 200  # OK
HTTP_201_CREATED = 201  # Created
HTTP_204_NO_CONTENT = 204  # No Content

HTTP_400_BAD_REQUEST = 400  # Bad Request
HTTP_401_UNAUTHORIZED = 401  # Unauthorized
HTTP_403_FORBIDDEN = 403  # Forbidden
HTTP_404_NOT_FOUND = 404  # Not Found
HTTP_409_CONFLICT = 409  # Conflict
HTTP_422_UNPROCESSABLE_ENTITY = 422  # Unprocessable Entity

HTTP_500_INTERNAL_SERVER_ERROR = 500  # Internal Server Error

HTTP_502_BAD_GATEWAY = 502  # Bad Gateway
HTTP_503_SERVICE_UNAVAILABLE = 503  # Service Unavailable


# ==========================================
# 🔐 Errores de Seguridad / Contraseña
# ==========================================
ERROR_INVALID_LENGTH = "Invalid length. Must be between 4 and 64 characters."
ERROR_INVALID_NEW_PASSWORD = "New password must be at least 8 characters."
ERROR_INVALID_CURRENT_PASSWORD = "Current password is incorrect."

# ==========================================
# 🔐 Seguridad: Parámetros Generales
# ==========================================
PASSWORD_MIN_LENGTH = 8
PASSWORD_GEN_MIN = 4
PASSWORD_GEN_MAX = 64
RESET_TOKEN_TTL_SECONDS = 15 * 60  # 15 minutos

# ==========================================
# 🔐 Mensajes para cambio de secret_key
# ==========================================
SUCCESS_SECRET_KEY_UPDATED = "Secret key updated successfully"
MESSAGE_SECRET_KEY_UPDATED = "The secret key has been successfully updated"

# ==========================================
# 🔑 UUID Token
# ==========================================
SUCCESS_UUID_GENERATED = "UUID token generated successfully."
ERROR_UUID_GENERATION = "An error occurred while generating the UUID token."
ERROR_UUID_GENERATION_CODE = "UUID_GENERATION_ERROR"

# ==========================================
# 📄 Form Engine -
# ==========================================
SUCCESS_FORM_CREATED = "Form created successfully."
SUCCESS_FORM_UPDATED = "Form updated successfully."
SUCCESS_FORM_PUBLISHED = "Form published successfully."
SUCCESS_FORM_CLONED = "Form cloned successfully."
SUCCESS_FORM_DISABLED = "Form disabled successfully."

# ==========================================
# 📱 Device Management - Status IDs
# ==========================================
DEVICE_STATUS_ACTIVE = 1
DEVICE_STATUS_INACTIVE = 2
DEVICE_STATUS_PENDING = 3

# ==========================================
# 📱 Device Management - Operating Systems
# ==========================================
DEVICE_OS_ANDROID = "ANDROID"
DEVICE_OS_IOS = "IOS"

# ==========================================
# 📱 Device Management - Success Messages
# ==========================================
SUCCESS_REGISTER_CODE_GENERATED = "Registration code generated successfully"
SUCCESS_DEVICE_REGISTERED = "Device registered successfully"
SUCCESS_DEVICE_UPDATED = "Device updated successfully"
SUCCESS_DEVICE_DELETED = "Device deleted successfully"
SUCCESS_DEVICES_RETRIEVED = "Devices retrieved successfully"
SUCCESS_DEVICE_RETRIEVED = "Device retrieved successfully"
SUCCESS_REGISTER_CODE_MESSAGE = "Use this code to register your device"
SUCCESS_DEVICE_STATUS_UPDATED = "Device status updated successfully"

# ==========================================
# 📱 Device Management - Error Messages
# ==========================================
ERROR_INVALID_REGISTER_CODE = "Invalid or expired registration code"
ERROR_DEVICE_ALREADY_REGISTERED = "This physical device is already registered in the system"
ERROR_DEVICE_NOT_FOUND = "Device not found"
ERROR_DEVICE_PHYSICAL_ID_EXISTS = "This physical device ID is already registered to another device"
ERROR_GENERATING_REGISTER_CODE = "Error generating registration code"
ERROR_REGISTERING_DEVICE = "Error registering device"
ERROR_UPDATING_DEVICE = "Error updating device"
ERROR_INTEGRITY_DEVICE = "Data integrity error. The physical device ID may already be registered."
ERROR_INVALID_STATUS = "Invalid device status"

# ==========================================
# 📱 Device Management - Default Values
# ==========================================
DEVICE_DEFAULT_NAME_PENDING = "Pending Registration"
DEVICE_DEFAULT_BRAND_PENDING = "Pending"
DEVICE_DEFAULT_MODEL_PENDING = "Pending"
DEVICE_DEFAULT_PHYSICAL_ID_PENDING = "Pending"
DEVICE_DEFAULT_OS = DEVICE_OS_ANDROID  # Default OS value for pending devices



