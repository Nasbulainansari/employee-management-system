from datetime import date
from typing import Optional, Literal

from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator


# ============================================================
# Common Configuration
# ============================================================

class ORMBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ============================================================
# User Schemas
# ============================================================

class UserCreate(BaseModel):
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        max_length=100
    )

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Full name cannot be empty")

        return value


class UserLogin(BaseModel):
    email: EmailStr

    password: str = Field(
        ...,
        min_length=1,
        max_length=100
    )


class UserResponse(ORMBaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str


# ============================================================
# Department Schemas
# ============================================================

class DepartmentCreate(BaseModel):
    department_name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    description: Optional[str] = Field(
        default=None,
        max_length=255
    )

    @field_validator("department_name")
    @classmethod
    def validate_department_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Department name cannot be empty")

        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None

        value = value.strip()

        return value if value else None


class DepartmentResponse(ORMBaseModel):
    id: int
    department_name: str
    description: Optional[str] = None


# ============================================================
# Employee Schemas
# ============================================================

class EmployeeCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100
    )

    email: EmailStr

    phone: str = Field(
        ...,
        min_length=7,
        max_length=20
    )

    salary: float = Field(
        ...,
        gt=0
    )

    joining_date: date

    department_id: int = Field(
        ...,
        gt=0
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Employee name cannot be empty")

        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Phone number cannot be empty")

        return value


class EmployeeResponse(ORMBaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    salary: float
    joining_date: date
    profile_image: Optional[str] = None
    resume: Optional[str] = None
    department_id: int


# ============================================================
# Attendance Schemas
# ============================================================

AttendanceStatus = Literal[
    "Present",
    "Absent",
    "Late",
    "Leave"
]


class AttendanceCreate(BaseModel):
    employee_id: int = Field(
        ...,
        gt=0
    )

    date: date

    status: AttendanceStatus


class AttendanceResponse(ORMBaseModel):
    id: int
    employee_id: int
    date: date
    status: str


# ============================================================
# Salary Schemas
# ============================================================

SalaryMonth = Literal[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]


class SalaryCreate(BaseModel):
    employee_id: int = Field(
        ...,
        gt=0
    )

    amount: float = Field(
        ...,
        gt=0
    )

    month: SalaryMonth

    year: int = Field(
        ...,
        ge=2000,
        le=2100
    )


class SalaryResponse(ORMBaseModel):
    id: int
    employee_id: int
    amount: float
    month: str
    year: int


# ============================================================
# Leave Schemas
# ============================================================

LeaveType = Literal[
    "Casual Leave",
    "Medical Leave",
    "Earned Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Unpaid Leave"
]

LeaveStatus = Literal[
    "Pending",
    "Approved",
    "Rejected"
]


class LeaveCreate(BaseModel):
    employee_id: int = Field(
        ...,
        gt=0
    )

    leave_type: LeaveType

    start_date: date

    end_date: date

    reason: str = Field(
        ...,
        min_length=2,
        max_length=255
    )

    @field_validator("reason")
    @classmethod
    def validate_reason(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Leave reason cannot be empty")

        return value

    @field_validator("end_date")
    @classmethod
    def validate_end_date(
        cls,
        value: date,
        info
    ) -> date:

        start_date = info.data.get("start_date")

        if start_date and value < start_date:
            raise ValueError(
                "End date cannot be before start date"
            )

        return value


class LeaveResponse(ORMBaseModel):
    id: int
    employee_id: int
    leave_type: str
    start_date: date
    end_date: date
    reason: str
    status: str