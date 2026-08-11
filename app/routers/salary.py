from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Salary, Employee
from app.schemas import SalaryCreate, SalaryResponse

router = APIRouter(
    prefix="/salary",
    tags=["Salary"]
)


# ==========================
# Create Salary
# ==========================
@router.post(
    "/",
    response_model=SalaryResponse,
    status_code=status.HTTP_201_CREATED
)
def create_salary(
    salary: SalaryCreate,
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == salary.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found."
        )

    new_salary = Salary(
        employee_id=salary.employee_id,
        amount=salary.amount,
        month=salary.month,
        year=salary.year
    )

    db.add(new_salary)
    db.commit()
    db.refresh(new_salary)

    return new_salary


# ==========================
# Get All Salary
# ==========================
@router.get(
    "/",
    response_model=list[SalaryResponse]
)
def get_all_salary(
    db: Session = Depends(get_db)
):

    return db.query(Salary).all()


# ==========================
# Get Salary By ID
# ==========================
@router.get(
    "/{salary_id}",
    response_model=SalaryResponse
)
def get_salary(
    salary_id: int,
    db: Session = Depends(get_db)
):

    salary = db.query(Salary).filter(
        Salary.id == salary_id
    ).first()

    if not salary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salary record not found."
        )

    return salary


# ==========================
# Update Salary
# ==========================
@router.put(
    "/{salary_id}",
    response_model=SalaryResponse
)
def update_salary(
    salary_id: int,
    salary: SalaryCreate,
    db: Session = Depends(get_db)
):

    db_salary = db.query(Salary).filter(
        Salary.id == salary_id
    ).first()

    if not db_salary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salary record not found."
        )

    db_salary.employee_id = salary.employee_id
    db_salary.amount = salary.amount
    db_salary.month = salary.month
    db_salary.year = salary.year

    db.commit()
    db.refresh(db_salary)

    return db_salary


# ==========================
# Delete Salary
# ==========================
@router.delete("/{salary_id}")
def delete_salary(
    salary_id: int,
    db: Session = Depends(get_db)
):

    salary = db.query(Salary).filter(
        Salary.id == salary_id
    ).first()

    if not salary:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salary record not found."
        )

    db.delete(salary)
    db.commit()

    return {
        "message": "Salary deleted successfully."
    }