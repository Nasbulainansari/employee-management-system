from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Query
)
from sqlalchemy.orm import Session

import os
import shutil

from app.database import get_db
from app.models import Employee, Department
from app.schemas import EmployeeCreate, EmployeeResponse

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)


# ==========================
# Create Employee
# ==========================
@router.post(
    "/",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED
)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):

    existing_employee = db.query(Employee).filter(
        Employee.email == employee.email
    ).first()

    if existing_employee:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee email already exists."
        )

    department = db.query(Department).filter(
        Department.id == employee.department_id
    ).first()

    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found."
        )

    new_employee = Employee(
        name=employee.name,
        email=employee.email,
        phone=employee.phone,
        salary=employee.salary,
        joining_date=employee.joining_date,
        department_id=employee.department_id
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return new_employee


# ==========================
# Get All Employees
# ==========================
@router.get(
    "/",
    response_model=list[EmployeeResponse]
)
def get_all_employees(
    db: Session = Depends(get_db)
):
    return db.query(Employee).all()


# ==========================
# Search Employees
# IMPORTANT: Must be BEFORE /{employee_id} to avoid routing conflict
# ==========================
@router.get("/search", response_model=list[EmployeeResponse])
def search_employees(
    name: str | None = Query(None),
    email: str | None = Query(None),
    department_id: int | None = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Employee)

    if name:
        query = query.filter(Employee.name.ilike(f"%{name}%"))

    if email:
        query = query.filter(Employee.email.ilike(f"%{email}%"))

    if department_id:
        query = query.filter(Employee.department_id == department_id)

    employees = query.all()

    if not employees:
        raise HTTPException(
            status_code=404,
            detail="No employee found."
        )

    return employees


# ==========================
# Upload Resume
# IMPORTANT: Must be BEFORE /{employee_id} routes
# ==========================
@router.post("/upload-resume/{employee_id}")
def upload_resume(
    employee_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found."
        )

    # Allow only PDF
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are allowed."
        )

    upload_folder = "app/uploads/resumes"
    os.makedirs(upload_folder, exist_ok=True)

    filename = f"{employee.id}_{file.filename}"
    file_path = os.path.join(upload_folder, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    employee.resume = file_path

    db.commit()
    db.refresh(employee)

    return {
        "message": "Resume uploaded successfully",
        "resume_path": file_path
    }


# ==========================
# Upload Profile Image
# IMPORTANT: Must be BEFORE /{employee_id} routes
# ==========================
@router.post("/upload-profile/{employee_id}")
def upload_profile(
    employee_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Check Employee
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found."
        )

    # Allow only Image Files
    allowed_extensions = [".jpg", ".jpeg", ".png"]
    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, JPEG and PNG files are allowed."
        )

    upload_folder = "app/uploads/profile_images"
    os.makedirs(upload_folder, exist_ok=True)

    filename = f"{employee.id}_{file.filename}"
    file_path = os.path.join(upload_folder, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    employee.profile_image = file_path

    db.commit()
    db.refresh(employee)

    return {
        "message": "Profile image uploaded successfully.",
        "image_path": file_path
    }


# ==========================
# Get Employee By ID
# ==========================
@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found."
        )

    return employee


# ==========================
# Update Employee
# ==========================
@router.put(
    "/{employee_id}",
    response_model=EmployeeResponse
)
def update_employee(
    employee_id: int,
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):
    db_employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not db_employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found."
        )

    department = db.query(Department).filter(
        Department.id == employee.department_id
    ).first()

    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found."
        )

    db_employee.name = employee.name
    db_employee.email = employee.email
    db_employee.phone = employee.phone
    db_employee.salary = employee.salary
    db_employee.joining_date = employee.joining_date
    db_employee.department_id = employee.department_id

    db.commit()
    db.refresh(db_employee)

    return db_employee


# ==========================
# Delete Employee
# ==========================
@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found."
        )

    db.delete(employee)
    db.commit()

    return {
        "message": "Employee deleted successfully."
    }