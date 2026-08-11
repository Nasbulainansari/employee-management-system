from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Department
from app.schemas import DepartmentCreate, DepartmentResponse

router = APIRouter(
    prefix="/departments",
    tags=["Departments"]
)


# ==========================
# Create Department
# ==========================
@router.post(
    "/",
    response_model=DepartmentResponse,
    status_code=status.HTTP_201_CREATED
)
def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db)
):

    existing_department = db.query(Department).filter(
        Department.department_name == department.department_name
    ).first()

    if existing_department:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department already exists."
        )

    new_department = Department(
        department_name=department.department_name,
        description=department.description
    )

    db.add(new_department)
    db.commit()
    db.refresh(new_department)

    return new_department


# ==========================
# Get All Departments
# ==========================
@router.get(
    "/",
    response_model=list[DepartmentResponse]
)
def get_departments(
    db: Session = Depends(get_db)
):

    departments = db.query(Department).all()

    return departments


# ==========================
# Get Department By ID
# ==========================
@router.get(
    "/{department_id}",
    response_model=DepartmentResponse
)
def get_department(
    department_id: int,
    db: Session = Depends(get_db)
):

    department = db.query(Department).filter(
        Department.id == department_id
    ).first()

    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found."
        )

    return department


# ==========================
# Update Department
# ==========================
@router.put(
    "/{department_id}",
    response_model=DepartmentResponse
)
def update_department(
    department_id: int,
    department: DepartmentCreate,
    db: Session = Depends(get_db)
):

    db_department = db.query(Department).filter(
        Department.id == department_id
    ).first()

    if not db_department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found."
        )

    db_department.department_name = department.department_name
    db_department.description = department.description

    db.commit()
    db.refresh(db_department)

    return db_department


# ==========================
# Delete Department
# ==========================
@router.delete(
    "/{department_id}",
    status_code=status.HTTP_200_OK
)
def delete_department(
    department_id: int,
    db: Session = Depends(get_db)
):

    department = db.query(Department).filter(
        Department.id == department_id
    ).first()

    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found."
        )

    db.delete(department)
    db.commit()

    return {
        "message": "Department deleted successfully."
    }