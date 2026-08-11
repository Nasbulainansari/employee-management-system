from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import (
    UserCreate,
    UserResponse,
    UserLogin,
)
from app.auth import (
    hash_password,
    verify_password,
)
from app.oauth2 import (
    create_access_token,
    get_current_user,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# ============================================================
# Register User
# ============================================================

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    # Check existing email
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered.",
        )

    # Hash password
    hashed_password = hash_password(user.password)

    # New users are employees by default
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hashed_password,
        role="employee",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ============================================================
# Login User
# ============================================================

@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    # Find user
    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Email or Password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # Verify password
    if not verify_password(
        user.password,
        db_user.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Email or Password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # Create JWT token
    access_token = create_access_token(
        data={
            "sub": str(db_user.id),
            "email": db_user.email,
            "role": db_user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# ============================================================
# Current User Profile
# ============================================================

@router.get(
    "/profile",
    response_model=UserResponse,
)
def get_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = current_user.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    try:
        user_id = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user information.",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return user