from fastapi import APIRouter, Depends, HTTPException, status
from fastapi import Query as FastAPIQuery
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Leave, Employee
from app.schemas import LeaveCreate, LeaveResponse

router = APIRouter(
    prefix="/leave",
    tags=["Leave"]
)


# ==========================
# Apply Leave
# ==========================
@router.post(
    "/",
    response_model=LeaveResponse,
    status_code=status.HTTP_201_CREATED
)
def apply_leave(
    leave: LeaveCreate,
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == leave.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found."
        )

    new_leave = Leave(
        employee_id=leave.employee_id,
        leave_type=leave.leave_type,
        start_date=leave.start_date,
        end_date=leave.end_date,
        reason=leave.reason
    )

    db.add(new_leave)
    db.commit()
    db.refresh(new_leave)

    return new_leave


# ==========================
# Get All Leave
# ==========================
@router.get(
    "/",
    response_model=list[LeaveResponse]
)
def get_all_leave(
    db: Session = Depends(get_db)
):
    return db.query(Leave).all()


# ==========================
# Get Leave By ID
# ==========================
@router.get(
    "/{leave_id}",
    response_model=LeaveResponse
)
def get_leave(
    leave_id: int,
    db: Session = Depends(get_db)
):

    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave not found."
        )

    return leave


# ==========================
# Update Leave
# ==========================
@router.put(
    "/{leave_id}",
    response_model=LeaveResponse
)
def update_leave(
    leave_id: int,
    leave: LeaveCreate,
    db: Session = Depends(get_db)
):

    db_leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not db_leave:
        raise HTTPException(
            status_code=404,
            detail="Leave not found."
        )

    db_leave.employee_id = leave.employee_id
    db_leave.leave_type = leave.leave_type
    db_leave.start_date = leave.start_date
    db_leave.end_date = leave.end_date
    db_leave.reason = leave.reason

    db.commit()
    db.refresh(db_leave)

    return db_leave


# ==========================
# Update Leave Status (Approve/Reject)
# Fixed: renamed 'status' param to 'new_status' to avoid shadowing FastAPI's status module
# ==========================
@router.patch(
    "/{leave_id}/status",
    response_model=LeaveResponse
)
def update_leave_status(
    leave_id: int,
    new_status: str = FastAPIQuery(..., description="Status: Pending, Approved, or Rejected"),
    db: Session = Depends(get_db)
):

    db_leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not db_leave:
        raise HTTPException(
            status_code=404,
            detail="Leave not found."
        )

    valid_statuses = ["Pending", "Approved", "Rejected"]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid status. Must be Pending, Approved, or Rejected."
        )

    db_leave.status = new_status
    db.commit()
    db.refresh(db_leave)

    return db_leave


# ==========================
# Delete Leave
# ==========================
@router.delete("/{leave_id}")
def delete_leave(
    leave_id: int,
    db: Session = Depends(get_db)
):

    leave = db.query(Leave).filter(
        Leave.id == leave_id
    ).first()

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave not found."
        )

    db.delete(leave)
    db.commit()

    return {
        "message": "Leave deleted successfully."
    }