from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Department, Employee, Attendance, Salary

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# ==========================
# Dashboard Summary
# ==========================
@router.get("/")
def dashboard_summary(
    db: Session = Depends(get_db)
):

    total_users = db.query(User).count()

    total_departments = db.query(Department).count()

    total_employees = db.query(Employee).count()

    total_attendance = db.query(Attendance).count()

    total_salary = db.query(Salary).count()

    return {
        "total_users": total_users,
        "total_departments": total_departments,
        "total_employees": total_employees,
        "total_attendance": total_attendance,
        "total_salary_records": total_salary
    }