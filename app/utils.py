"""
Utility helper functions for Employee Management System
"""

from datetime import date


def calculate_days_between(start_date: date, end_date: date) -> int:
    """Calculate number of days between two dates (inclusive)."""
    delta = end_date - start_date
    return delta.days + 1


def format_currency(amount: float, symbol: str = "$") -> str:
    """Format a float as currency string."""
    return f"{symbol}{amount:,.2f}"


def validate_date_range(start_date: date, end_date: date) -> bool:
    """Return True if start_date is before or equal to end_date."""
    return start_date <= end_date


def get_attendance_percentage(present_days: int, total_days: int) -> float:
    """Calculate attendance percentage."""
    if total_days == 0:
        return 0.0
    return round((present_days / total_days) * 100, 2)
