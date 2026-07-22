from datetime import datetime, timedelta, timezone
from typing import Optional
import os
from jose import JWTError, jwt

SECRET_KEY = os.getenv("SECRET_KEY", "aegis-dev-secret-change-in-production-64ch-minimum")
ALGORITHM  = os.getenv("ALGORITHM", "HS256")
EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24h


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=EXPIRE_MIN))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token. Returns payload dict or None."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def verify_token(token: str) -> Optional[str]:
    """Return the chassis number (sub) from a valid token, or None."""
    payload = decode_access_token(token)
    if payload is None:
        return None
    return payload.get("sub")
