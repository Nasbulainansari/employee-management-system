from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Attendance, Employee
from app.schemas import AttendanceCreate, AttendanceResponse

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)


# ==========================
# Mark Attendance
# ==========================
@router.post(
    "/",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED
)
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == attendance.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found."
        )

    new_attendance = Attendance(
        employee_id=attendance.employee_id,
        date=attendance.date,
        status=attendance.status
    )

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance


# ==========================
# Get All Attendance
# ==========================
@router.get(
    "/",
    response_model=list[AttendanceResponse]
)
def get_all_attendance(
    db: Session = Depends(get_db)
):

    return db.query(Attendance).all()


# ==========================
# Get Attendance By ID
# ==========================
@router.get(
    "/{attendance_id}",
    response_model=AttendanceResponse
)
def get_attendance(
    attendance_id: int,
    db: Session = Depends(get_db)
):

    attendance = db.query(Attendance).filter(
        Attendance.id == attendance_id
    ).first()

    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance not found."
        )

    return attendance


# ==========================
# Update Attendance
# ==========================
@router.put(
    "/{attendance_id}",
    response_model=AttendanceResponse
)
def update_attendance(
    attendance_id: int,
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):

    db_attendance = db.query(Attendance).filter(
        Attendance.id == attendance_id
    ).first()

    if not db_attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance not found."
        )

    db_attendance.employee_id = attendance.employee_id
    db_attendance.date = attendance.date
    db_attendance.status = attendance.status

    db.commit()
    db.refresh(db_attendance)

    return db_attendance


# ==========================
# Delete Attendance
# ==========================
@router.delete("/{attendance_id}")
def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db)
):

    attendance = db.query(Attendance).filter(
        Attendance.id == attendance_id
    ).first()

    if not attendance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance not found."
        )

    db.delete(attendance)
    db.commit()

    return {
        "message": "Attendance deleted successfully."
    }