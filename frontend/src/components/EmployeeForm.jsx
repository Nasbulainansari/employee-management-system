import { useState, useEffect } from "react";
import api from "../services/api";

import {
    Save,
    X,
    UserPlus,
    Edit3,
    User,
    Mail,
    Phone,
    IndianRupee,
    CalendarDays,
    Building2,
    Loader2,
} from "lucide-react";


function EmployeeForm({
    loadEmployees,
    editEmployee,
    setEditEmployee,
}) {

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [departmentLoading, setDepartmentLoading] = useState(true);
    const [error, setError] = useState("");


    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        phone: "",
        salary: "",
        joining_date: "",
        department_id: "",
    });


    /* ============================================================
       Fetch Departments
       ============================================================ */

    useEffect(() => {
        fetchDepartments();
    }, []);


    /* ============================================================
       Load Employee Data When Editing
       ============================================================ */

    useEffect(() => {

        if (editEmployee) {

            setEmployee({
                name: editEmployee.name || "",
                email: editEmployee.email || "",
                phone: editEmployee.phone || "",
                salary: editEmployee.salary ?? "",
                joining_date: editEmployee.joining_date
                    ? editEmployee.joining_date.split("T")[0]
                    : "",
                department_id: editEmployee.department_id ?? "",
            });

        } else {

            resetForm();

        }

    }, [editEmployee]);


    /* ============================================================
       Fetch Departments
       ============================================================ */

    const fetchDepartments = async () => {

        try {

            setDepartmentLoading(true);

            const response = await api.get("/departments/");

            setDepartments(response.data);

        } catch (err) {

            console.error(
                "Failed to load departments:",
                err
            );

            setError(
                "Failed to load departments. Please refresh and try again."
            );

        } finally {

            setDepartmentLoading(false);

        }

    };


    /* ============================================================
       Input Change
       ============================================================ */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setEmployee((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    /* ============================================================
       Reset Form
       ============================================================ */

    const resetForm = () => {

        setEmployee({
            name: "",
            email: "",
            phone: "",
            salary: "",
            joining_date: "",
            department_id: "",
        });

        setError("");

    };


    /* ============================================================
       Close Form
       ============================================================ */

    const clearForm = () => {

        resetForm();

        setEditEmployee(null);

    };


    /* ============================================================
       Submit Employee
       ============================================================ */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            /* Department validation */

            if (!employee.department_id) {

                setError(
                    "Please select a department."
                );

                setLoading(false);

                return;

            }


            /* Prepare FastAPI payload */

            const payload = {
                name: employee.name.trim(),
                email: employee.email.trim(),
                phone: employee.phone.trim(),
                salary: Number(employee.salary),
                joining_date: employee.joining_date,
                department_id: Number(employee.department_id),
            };


            console.log(
                "Employee payload:",
                payload
            );


            let response;


            /* Update Employee */

            if (editEmployee) {

                response = await api.put(
                    `/employees/${editEmployee.id}`,
                    payload
                );

                alert(
                    "Employee updated successfully!"
                );

            }

            /* Add Employee */

            else {

                response = await api.post(
                    "/employees/",
                    payload
                );

                alert(
                    "Employee added successfully!"
                );

            }


            console.log(
                "Employee API response:",
                response.data
            );


            clearForm();

            await loadEmployees();


        } catch (err) {

            console.error(
                "Employee save error:",
                err
            );

            console.error(
                "Response:",
                err.response?.data
            );


            /* Unauthorized */

            if (err.response?.status === 401) {

                setError(
                    "You are not authorized. Please login again."
                );

            }

            /* Bad Request */

            else if (err.response?.status === 400) {

                setError(
                    err.response?.data?.detail ||
                    "Invalid employee information."
                );

            }

            /* Validation Error */

            else if (err.response?.status === 422) {

                const detail =
                    err.response?.data?.detail;


                if (Array.isArray(detail)) {

                    setError(
                        detail
                            .map((item) => item.msg)
                            .join(", ")
                    );

                } else {

                    setError(
                        detail ||
                        "Please check the employee information."
                    );

                }

            }

            /* Other errors */

            else {

                setError(
                    err.response?.data?.detail ||
                    "Failed to save employee. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    /* ============================================================
       Reusable Classes
       ============================================================ */

    const inputClass =
        "w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300";


    const labelClass =
        "block text-sm font-semibold text-slate-700 mb-2";


    return (

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


            {/* ================================================= */}
            {/* Form Header */}
            {/* ================================================= */}

            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 px-6 py-5 border-b border-blue-100">

                <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                                editEmployee
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-blue-100 text-blue-600"
                            }`}
                        >

                            {editEmployee ? (
                                <Edit3 size={21} />
                            ) : (
                                <UserPlus size={21} />
                            )}

                        </div>


                        <div>

                            <h2 className="text-lg font-bold text-slate-800">

                                {editEmployee
                                    ? "Edit Employee"
                                    : "Add New Employee"}

                            </h2>


                            <p className="text-xs text-slate-500 mt-1">

                                {editEmployee
                                    ? "Update employee information and save changes."
                                    : "Enter employee information to create a new record."}

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={clearForm}
                        className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition"
                        title="Close form"
                    >

                        <X size={18} />

                    </button>

                </div>

            </div>


            {/* ================================================= */}
            {/* Error */}
            {/* ================================================= */}

            {error && (

                <div className="mx-6 mt-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-start gap-3">

                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">

                        <X size={16} />

                    </div>

                    <div>

                        <p className="font-semibold">
                            Unable to save employee
                        </p>

                        <p className="mt-0.5 text-red-600">
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* ================================================= */}
            {/* Form */}
            {/* ================================================= */}

            <form
                onSubmit={handleSubmit}
                className="p-6"
            >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                    {/* ================================================= */}
                    {/* Full Name */}
                    {/* ================================================= */}

                    <div>

                        <label className={labelClass}>
                            Full Name
                        </label>

                        <div className="relative">

                            <User
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />

                            <input
                                type="text"
                                name="name"
                                placeholder="e.g. Rahul Sharma"
                                value={employee.name}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* Email */}
                    {/* ================================================= */}

                    <div>

                        <label className={labelClass}>
                            Email Address
                        </label>

                        <div className="relative">

                            <Mail
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                value={employee.email}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* Phone */}
                    {/* ================================================= */}

                    <div>

                        <label className={labelClass}>
                            Phone Number
                        </label>

                        <div className="relative">

                            <Phone
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />

                            <input
                                type="tel"
                                name="phone"
                                placeholder="+91 98765 43210"
                                value={employee.phone}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* Salary */}
                    {/* ================================================= */}

                    <div>

                        <label className={labelClass}>
                            Base Salary
                        </label>

                        <div className="relative">

                            <IndianRupee
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />

                            <input
                                type="number"
                                name="salary"
                                placeholder="e.g. 50000"
                                value={employee.salary}
                                onChange={handleChange}
                                className={inputClass}
                                step="0.01"
                                min="0"
                                required
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* Joining Date */}
                    {/* ================================================= */}

                    <div>

                        <label className={labelClass}>
                            Joining Date
                        </label>

                        <div className="relative">

                            <CalendarDays
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />

                            <input
                                type="date"
                                name="joining_date"
                                value={employee.joining_date}
                                onChange={handleChange}
                                className={inputClass}
                                required
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* Department */}
                    {/* ================================================= */}

                    <div>

                        <label className={labelClass}>
                            Department
                        </label>

                        <div className="relative">

                            <Building2
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                            />

                            <select
                                name="department_id"
                                value={employee.department_id}
                                onChange={handleChange}
                                className={`${inputClass} appearance-none cursor-pointer`}
                                required
                                disabled={departmentLoading}
                            >

                                <option value="">
                                    {departmentLoading
                                        ? "Loading departments..."
                                        : "Select Department..."}
                                </option>


                                {departments.map((dept) => (

                                    <option
                                        key={dept.id}
                                        value={dept.id}
                                    >
                                        {dept.department_name}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* Form Footer */}
                {/* ================================================= */}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-7 pt-5 border-t border-slate-100">


                    <p className="text-xs text-slate-400">
                        All fields are required.
                    </p>


                    <div className="flex items-center gap-3 w-full sm:w-auto">


                        <button
                            type="button"
                            onClick={clearForm}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-sm transition active:scale-95"
                        >

                            <X size={17} />

                            Cancel

                        </button>


                        <button
                            type="submit"
                            disabled={loading || departmentLoading}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >

                            {loading ? (

                                <>
                                    <Loader2
                                        size={17}
                                        className="animate-spin"
                                    />

                                    Saving...

                                </>

                            ) : (

                                <>
                                    <Save size={17} />

                                    {editEmployee
                                        ? "Update Employee"
                                        : "Add Employee"}

                                </>

                            )}

                        </button>

                    </div>

                </div>

            </form>

        </div>

    );
}


export default EmployeeForm;