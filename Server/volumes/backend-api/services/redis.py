from utils.redisConfig import redis_client

def get_redis_key_value(key: str):
    """Obtiene un valor desde Redis usando una clave."""
    return redis_client.get(key)

def set_redis_key_with_expiry(key: str, value: str, ttl_seconds: int):
    """Guarda un valor en Redis con una expiración."""
    redis_client.setex(key, ttl_seconds, value)

def delete_redis_key(key: str):
    """Elimina una clave específica en Redis."""
    redis_client.delete(key)

def get_user_secret(user_id: int):
    """
    Obtiene el secreto JWT de un usuario desde Redis o la base de datos si no está en caché.
    """
    cache_key = f"user_secret:{user_id}"
    secret = get_redis_key_value(cache_key)

    if secret is None:
        from models.user import User  # Importación diferida para evitar dependencias circulares
        from sqlalchemy.orm import Session
        from utils.dbConfig import SessionLocal

        db: Session = SessionLocal()
        user = db.query(User).filter(User.id == user_id).first()

        if user and user.secret_key:
            secret = user.secret_key
            set_redis_key_with_expiry(cache_key, secret, 3600)
        else:
            raise ValueError("El usuario no tiene un secreto válido.")
    
    return secret

def store_user_secret(user_id: int, secret: str):
    """
    Almacena el secreto JWT del usuario en Redis.
    """
    cache_key = f"user_secret:{user_id}"
    set_redis_key_with_expiry(cache_key, secret, 3600)
