from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    ForeignKey,
    DateTime,
    Boolean
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


# ==========================
# User Model
# ==========================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default="employee")
    created_at = Column(DateTime, default=datetime.utcnow)


# ==========================
# Department Model
# ==========================
class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)

    employees = relationship(
        "Employee",
        back_populates="department",
        cascade="all, delete"
    )


# ==========================
# Employee Model
# ==========================
class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)

    salary = Column(Float, nullable=False)
    joining_date = Column(Date, nullable=False)

    profile_image = Column(String(255), nullable=True)
    resume = Column(String(255), nullable=True)

    department_id = Column(
        Integer,
        ForeignKey("departments.id"),
        nullable=False
    )

    department = relationship(
        "Department",
        back_populates="employees"
    )

    attendance = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete"
    )

    salary_details = relationship(
        "Salary",
        back_populates="employee",
        cascade="all, delete"
    )

    leaves = relationship(
        "Leave",
        back_populates="employee",
        cascade="all, delete"
    )


# ==========================
# Attendance Model
# ==========================
class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False
    )

    date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)

    employee = relationship(
        "Employee",
        back_populates="attendance"
    )


# ==========================
# Salary Model
# ==========================
class Salary(Base):
    __tablename__ = "salary"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False
    )

    amount = Column(Float, nullable=False)
    month = Column(String(20), nullable=False)
    year = Column(Integer, nullable=False)

    employee = relationship(
        "Employee",
        back_populates="salary_details"
    )


# ==========================
# Leave Table
# ==========================
class Leave(Base):
    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False
    )

    leave_type = Column(String(50), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String(255), nullable=False)

    status = Column(
        String(20),
        default="Pending"
    )

    employee = relationship(
        "Employee",
        back_populates="leaves"
    )