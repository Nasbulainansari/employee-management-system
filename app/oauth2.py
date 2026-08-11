import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt


# ============================================================
# Environment Variables
# ============================================================

load_dotenv()


SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "change-this-secret-key-in-production"
)

ALGORITHM = os.getenv(
    "ALGORITHM",
    "HS256"
)

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "60"
    )
)


# ============================================================
# OAuth2 Configuration
# ============================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/users/login"
)


# ============================================================
# Create Access Token
# ============================================================

def create_access_token(data: dict) -> str:
    """
    Create a JWT access token.
    """

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return encoded_jwt


# ============================================================
# Verify Access Token
# ============================================================

def verify_access_token(token: str) -> dict:
    """
    Decode and verify JWT token.
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token.",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        return payload

    except JWTError:
        raise credentials_exception


# ============================================================
# Get Current Logged-in User
# ============================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
) -> dict:
    """
    Return information about the currently authenticated user.
    """

    return verify_access_token(token)


# ============================================================
# Get Current User ID
# ============================================================

def get_current_user_id(
    current_user: dict = Depends(get_current_user),
) -> int:
    """
    Extract user ID from JWT.
    """

    try:
        return int(current_user["sub"])

    except (KeyError, TypeError, ValueError):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user information.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )


# ============================================================
# Admin Authorization
# ============================================================

def require_admin(
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Allow access only to admin users.
    """

    role = current_user.get("role")

    if role != "admin":

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user