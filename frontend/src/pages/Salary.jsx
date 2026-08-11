import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
    Landmark,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    IndianRupee,
    AlertCircle,
    RefreshCw,
    Users,
    CalendarDays,
    WalletCards,
    TrendingUp,
    Search,
    CheckCircle2,
} from "lucide-react";


function Salary() {

    const [salaryList, setSalaryList] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [monthFilter, setMonthFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    // Form states
    const [employeeId, setEmployeeId] = useState("");
    const [amount, setAmount] = useState("");
    const [month, setMonth] = useState("January");
    const [year, setYear] = useState(
        new Date().getFullYear()
    );

    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);


    const months = [
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
        "December",
    ];


    /* ============================================================
       LOAD DATA
    ============================================================ */

    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                salaryResponse,
                employeeResponse,
            ] = await Promise.all([
                api.get("/salary/"),
                api.get("/employees/"),
            ]);

            setSalaryList(
                salaryResponse.data
            );

            setEmployees(
                employeeResponse.data
            );

        } catch (err) {

            console.error(
                "Error loading salary data:",
                err
            );

            setError(
                "Could not retrieve salary records or employee data."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ============================================================
       EMPLOYEE INFORMATION
    ============================================================ */

    const getEmployeeInfo = (employeeId) => {

        const employee = employees.find(
            (emp) => emp.id === employeeId
        );

        if (!employee) {

            return {
                name: `Employee #${employeeId}`,
                email: "",
                baseSalary: 0,
            };

        }

        return {
            name: employee.name,
            email: employee.email,
            baseSalary: employee.salary,
        };

    };


    /* ============================================================
       FORMAT CURRENCY
    ============================================================ */

    const formatCurrency = (value) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(Number(value) || 0);

    };


    /* ============================================================
       STATISTICS
    ============================================================ */

    const statistics = useMemo(() => {

        const totalPayroll = salaryList.reduce(
            (total, record) =>
                total + Number(record.amount || 0),
            0
        );


        const uniqueEmployees =
            new Set(
                salaryList.map(
                    (record) =>
                        record.employee_id
                )
            ).size;


        const currentMonth =
            new Date().toLocaleString(
                "en-US",
                {
                    month: "long",
                }
            );


        const currentYear =
            new Date().getFullYear();


        const currentMonthPayroll =
            salaryList
                .filter(
                    (record) =>
                        record.month ===
                            currentMonth &&
                        Number(record.year) ===
                            currentYear
                )
                .reduce(
                    (total, record) =>
                        total +
                        Number(record.amount || 0),
                    0
                );


        return {
            totalRecords:
                salaryList.length,

            uniqueEmployees,

            totalPayroll,

            currentMonthPayroll,

            currentMonth,
        };

    }, [salaryList]);


    /* ============================================================
       AVAILABLE YEARS
    ============================================================ */

    const availableYears = useMemo(() => {

        const years = [
            ...new Set(
                salaryList.map(
                    (record) =>
                        Number(record.year)
                )
            ),
        ];

        const currentYear =
            new Date().getFullYear();

        if (!years.includes(currentYear)) {
            years.push(currentYear);
        }

        return years.sort(
            (a, b) => b - a
        );

    }, [salaryList]);


    /* ============================================================
       FILTER RECORDS
    ============================================================ */

    const filteredSalary = useMemo(() => {

        const query =
            searchQuery
                .trim()
                .toLowerCase();


        return salaryList.filter(
            (record) => {

                const employee =
                    getEmployeeInfo(
                        record.employee_id
                    );


                const matchesSearch =
                    !query ||
                    employee.name
                        .toLowerCase()
                        .includes(query) ||
                    employee.email
                        .toLowerCase()
                        .includes(query) ||
                    String(
                        record.employee_id
                    ).includes(query);


                const matchesMonth =
                    !monthFilter ||
                    record.month ===
                        monthFilter;


                const matchesYear =
                    !yearFilter ||
                    Number(record.year) ===
                        Number(yearFilter);


                return (
                    matchesSearch &&
                    matchesMonth &&
                    matchesYear
                );

            }
        );

    }, [
        salaryList,
        employees,
        searchQuery,
        monthFilter,
        yearFilter,
    ]);


    /* ============================================================
       EMPLOYEE CHANGE
    ============================================================ */

    const handleEmployeeChange = (
        empId
    ) => {

        setEmployeeId(empId);

        if (empId) {

            const employee =
                employees.find(
                    (emp) =>
                        emp.id ===
                        parseInt(empId)
                );


            if (employee) {

                setAmount(
                    employee.salary
                        ? employee.salary.toString()
                        : ""
                );

            }

        } else {

            setAmount("");

        }

    };


    /* ============================================================
       RESET FORM
    ============================================================ */

    const resetForm = () => {

        setEmployeeId("");

        setAmount("");

        setMonth("January");

        setYear(
            new Date().getFullYear()
        );

        setEditId(null);

    };


    /* ============================================================
       OPEN CREATE FORM
    ============================================================ */

    const handleAddSalary = () => {

        resetForm();

        setError("");
        setSuccessMessage("");

        setShowForm(true);

    };


    /* ============================================================
       SUBMIT FORM
    ============================================================ */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccessMessage("");


        if (!employeeId) {

            setError(
                "Please select an employee."
            );

            return;

        }


        if (
            !amount ||
            parseFloat(amount) <= 0
        ) {

            setError(
                "Please enter a valid salary amount."
            );

            return;

        }


        try {

            if (editId) {

                /* ============================
                   UPDATE
                ============================ */

                const response =
                    await api.put(
                        `/salary/${editId}`,
                        {
                            employee_id:
                                parseInt(
                                    employeeId
                                ),

                            amount:
                                parseFloat(
                                    amount
                                ),

                            month,

                            year:
                                parseInt(
                                    year
                                ),
                        }
                    );


                setSalaryList(
                    (previous) =>
                        previous.map(
                            (record) =>
                                record.id ===
                                editId
                                    ? response.data
                                    : record
                        )
                );


                setSuccessMessage(
                    "Salary record updated successfully."
                );

            } else {

                /* ============================
                   CREATE
                ============================ */

                const response =
                    await api.post(
                        "/salary/",
                        {
                            employee_id:
                                parseInt(
                                    employeeId
                                ),

                            amount:
                                parseFloat(
                                    amount
                                ),

                            month,

                            year:
                                parseInt(
                                    year
                                ),
                        }
                    );


                setSalaryList(
                    (previous) => [
                        response.data,
                        ...previous,
                    ]
                );


                setSuccessMessage(
                    "Salary record added successfully."
                );

            }


            resetForm();

            setShowForm(false);

        } catch (err) {

            console.error(
                "Error saving salary:",
                err
            );


            if (
                err.response?.data?.detail
            ) {

                setError(
                    err.response.data.detail
                );

            } else {

                setError(
                    "Something went wrong while saving the salary record."
                );

            }

        }

    };


    /* ============================================================
       EDIT
    ============================================================ */

    const handleEdit = (record) => {

        setEditId(record.id);

        setEmployeeId(
            record.employee_id.toString()
        );

        setAmount(
            record.amount.toString()
        );

        setMonth(record.month);

        setYear(record.year);

        setError("");
        setSuccessMessage("");

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    /* ============================================================
       CANCEL
    ============================================================ */

    const handleCancel = () => {

        resetForm();

        setShowForm(false);

        setError("");

    };


    /* ============================================================
       DELETE
    ============================================================ */

    const handleDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this salary record?"
            );


        if (!confirmed) {
            return;
        }


        setError("");
        setSuccessMessage("");


        try {

            await api.delete(
                `/salary/${id}`
            );


            setSalaryList(
                (previous) =>
                    previous.filter(
                        (record) =>
                            record.id !== id
                    )
            );


            setSuccessMessage(
                "Salary record deleted successfully."
            );


            if (editId === id) {
                handleCancel();
            }

        } catch (err) {

            console.error(
                "Error deleting salary:",
                err
            );

            setError(
                "Could not delete salary record."
            );

        }

    };


    return (

        <div className="min-h-screen flex bg-slate-50">

            <Sidebar />


            <div className="flex-1 min-w-0 flex flex-col">

                <Navbar />


                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">

                    <div className="max-w-6xl mx-auto">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">

                            <div>

                                <div className="flex items-center gap-2 mb-2">

                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                        <Landmark size={19} />

                                    </div>

                                    <span className="text-sm font-semibold text-emerald-600">
                                        Finance
                                    </span>

                                </div>


                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                                    Salary Management
                                </h1>


                                <p className="text-sm text-slate-500 mt-1">
                                    Manage employee salary records and monthly payroll information.
                                </p>

                            </div>


                            <div className="flex items-center gap-2">

                                <button
                                    onClick={
                                        loadData
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm disabled:opacity-60"
                                >

                                    <RefreshCw
                                        size={16}
                                        className={
                                            loading
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    Refresh

                                </button>


                                <button
                                    onClick={() => {

                                        if (
                                            showForm
                                        ) {
                                            handleCancel();
                                        } else {
                                            handleAddSalary();
                                        }

                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition active:scale-95"
                                >

                                    {showForm ? (
                                        <X size={17} />
                                    ) : (
                                        <Plus size={17} />
                                    )}

                                    {showForm
                                        ? "Close Form"
                                        : "Add Salary"}

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            SUCCESS
                        ================================================= */}

                        {successMessage && (

                            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">

                                    <CheckCircle2
                                        size={18}
                                    />

                                </div>


                                <div>

                                    <p className="text-sm font-bold text-emerald-800">
                                        Success
                                    </p>

                                    <p className="text-xs text-emerald-700 mt-0.5">
                                        {successMessage}
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">

                                    <AlertCircle
                                        size={18}
                                    />

                                </div>


                                <div>

                                    <p className="text-sm font-bold text-red-800">
                                        Something went wrong
                                    </p>

                                    <p className="text-xs text-red-600 mt-0.5">
                                        {error}
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            STATISTICS
                        ================================================= */}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">


                            {/* Total Records */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Salary Records
                                        </p>

                                        <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                            {
                                                statistics.totalRecords
                                            }
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Total payroll entries
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                        <WalletCards
                                            size={21}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Employees */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Employees Paid
                                        </p>

                                        <h2 className="text-3xl font-bold text-violet-600 mt-2">
                                            {
                                                statistics.uniqueEmployees
                                            }
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Unique employees
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

                                        <Users
                                            size={21}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Total Payroll */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between gap-2">

                                    <div className="min-w-0">

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Total Payroll
                                        </p>

                                        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-2 truncate">
                                            {formatCurrency(
                                                statistics.totalPayroll
                                            )}
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            All salary records
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">

                                        <IndianRupee
                                            size={21}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Current Month */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between gap-2">

                                    <div className="min-w-0">

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            This Month
                                        </p>

                                        <h2 className="text-xl sm:text-2xl font-bold text-amber-600 mt-2 truncate">
                                            {formatCurrency(
                                                statistics.currentMonthPayroll
                                            )}
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            {statistics.currentMonth}{" "}
                                            {new Date().getFullYear()}
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">

                                        <CalendarDays
                                            size={21}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FORM
                        ================================================= */}

                        {showForm && (

                            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">

                                <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                            {editId ? (
                                                <Edit2
                                                    size={19}
                                                />
                                            ) : (
                                                <Plus
                                                    size={20}
                                                />
                                            )}

                                        </div>


                                        <div>

                                            <h2 className="font-bold text-slate-800">
                                                {editId
                                                    ? "Edit Salary Record"
                                                    : "Add Salary Record"}
                                            </h2>

                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Enter the employee's monthly salary information.
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            handleCancel
                                        }
                                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                                    >

                                        <X size={18} />

                                    </button>

                                </div>


                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                    className="p-5 sm:p-6"
                                >

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">


                                        {/* Employee */}

                                        <div className="lg:col-span-1">

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">

                                                Employee

                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>

                                            </label>


                                            <select
                                                required
                                                value={
                                                    employeeId
                                                }
                                                disabled={
                                                    editId !==
                                                    null
                                                }
                                                onChange={(e) =>
                                                    handleEmployeeChange(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition disabled:opacity-60"
                                            >

                                                <option value="">
                                                    Select employee...
                                                </option>


                                                {employees.map(
                                                    (
                                                        employee
                                                    ) => (

                                                        <option
                                                            key={
                                                                employee.id
                                                            }
                                                            value={
                                                                employee.id
                                                            }
                                                        >

                                                            {
                                                                employee.name
                                                            }

                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>


                                        {/* Amount */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">

                                                Salary Amount

                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>

                                            </label>


                                            <div className="relative">

                                                <IndianRupee
                                                    size={16}
                                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                                />


                                                <input
                                                    type="number"
                                                    required
                                                    min="1"
                                                    step="0.01"
                                                    placeholder="35000"
                                                    value={
                                                        amount
                                                    }
                                                    onChange={(e) =>
                                                        setAmount(
                                                            e.target
                                                                .value
                                                        )
                                                    }
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                                />

                                            </div>

                                        </div>


                                        {/* Month */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Month
                                            </label>


                                            <select
                                                value={
                                                    month
                                                }
                                                onChange={(e) =>
                                                    setMonth(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            >

                                                {months.map(
                                                    (
                                                        monthName
                                                    ) => (

                                                        <option
                                                            key={
                                                                monthName
                                                            }
                                                            value={
                                                                monthName
                                                            }
                                                        >
                                                            {
                                                                monthName
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>


                                        {/* Year */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Year
                                            </label>


                                            <input
                                                type="number"
                                                required
                                                min="2000"
                                                max="2100"
                                                value={
                                                    year
                                                }
                                                onChange={(e) =>
                                                    setYear(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            />

                                        </div>

                                    </div>


                                    {/* Selected employee preview */}

                                    {employeeId && (

                                        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">

                                                {getEmployeeInfo(
                                                    parseInt(
                                                        employeeId
                                                    )
                                                )
                                                    .name
                                                    ?.charAt(
                                                        0
                                                    )
                                                    ?.toUpperCase()}

                                            </div>


                                            <div>

                                                <p className="text-sm font-bold text-slate-800">

                                                    {
                                                        getEmployeeInfo(
                                                            parseInt(
                                                                employeeId
                                                            )
                                                        )
                                                            .name
                                                    }

                                                </p>


                                                <p className="text-xs text-slate-500">

                                                    Base Salary:{" "}

                                                    {formatCurrency(
                                                        getEmployeeInfo(
                                                            parseInt(
                                                                employeeId
                                                            )
                                                        )
                                                            .baseSalary
                                                    )}

                                                </p>

                                            </div>

                                        </div>

                                    )}


                                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">

                                        <button
                                            type="button"
                                            onClick={
                                                handleCancel
                                            }
                                            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition active:scale-95"
                                        >

                                            <Save
                                                size={16}
                                            />

                                            {editId
                                                ? "Update Salary"
                                                : "Save Salary"}

                                        </button>

                                    </div>

                                </form>

                            </section>

                        )}


                        {/* =================================================
                            SALARY DIRECTORY
                        ================================================= */}

                        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                            {/* Header */}

                            <div className="p-5 sm:px-6 border-b border-slate-100">

                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <WalletCards
                                                size={19}
                                                className="text-emerald-600"
                                            />

                                            <h2 className="text-lg font-bold text-slate-800">
                                                Salary Records
                                            </h2>

                                        </div>


                                        <p className="text-xs text-slate-400 mt-1">
                                            View and manage monthly employee salary records.
                                        </p>

                                    </div>


                                    {/* Filters */}

                                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">


                                        {/* Search */}

                                        <div className="relative sm:w-60">

                                            <Search
                                                size={16}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="text"
                                                value={
                                                    searchQuery
                                                }
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                placeholder="Search employee..."
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            />

                                        </div>


                                        {/* Month */}

                                        <select
                                            value={
                                                monthFilter
                                            }
                                            onChange={(e) =>
                                                setMonthFilter(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 outline-none focus:bg-white focus:border-blue-500"
                                        >

                                            <option value="">
                                                All Months
                                            </option>

                                            {months.map(
                                                (
                                                    monthName
                                                ) => (

                                                    <option
                                                        key={
                                                            monthName
                                                        }
                                                        value={
                                                            monthName
                                                        }
                                                    >
                                                        {
                                                            monthName
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>


                                        {/* Year */}

                                        <select
                                            value={
                                                yearFilter
                                            }
                                            onChange={(e) =>
                                                setYearFilter(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 outline-none focus:bg-white focus:border-blue-500"
                                        >

                                            <option value="">
                                                All Years
                                            </option>

                                            {availableYears.map(
                                                (
                                                    availableYear
                                                ) => (

                                                    <option
                                                        key={
                                                            availableYear
                                                        }
                                                        value={
                                                            availableYear
                                                        }
                                                    >
                                                        {
                                                            availableYear
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>

                            </div>


                            {/* Result bar */}

                            <div className="px-5 sm:px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">

                                <p className="text-xs font-semibold text-slate-500">

                                    Showing{" "}

                                    <span className="text-slate-800">
                                        {
                                            filteredSalary.length
                                        }
                                    </span>{" "}

                                    of{" "}

                                    <span className="text-slate-800">
                                        {
                                            salaryList.length
                                        }
                                    </span>{" "}

                                    records

                                </p>


                                {(searchQuery ||
                                    monthFilter ||
                                    yearFilter) && (

                                    <button
                                        onClick={() => {
                                            setSearchQuery(
                                                ""
                                            );
                                            setMonthFilter(
                                                ""
                                            );
                                            setYearFilter(
                                                ""
                                            );
                                        }}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        Clear Filters
                                    </button>

                                )}

                            </div>


                            {/* =================================================
                                LOADING
                            ================================================= */}

                            {loading && (

                                <div className="p-12 text-center">

                                    <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 items-center justify-center mb-4">

                                        <RefreshCw
                                            size={22}
                                            className="animate-spin"
                                        />

                                    </div>


                                    <p className="text-sm font-semibold text-slate-700">
                                        Loading salary records...
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Fetching the latest payroll information.
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                EMPTY
                            ================================================= */}

                            {!loading &&
                                filteredSalary.length ===
                                    0 && (

                                    <div className="p-12 sm:p-16 text-center">

                                        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-4">

                                            <Landmark
                                                size={28}
                                            />

                                        </div>


                                        <h3 className="text-base font-bold text-slate-700">
                                            No salary records found
                                        </h3>


                                        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">

                                            {searchQuery ||
                                            monthFilter ||
                                            yearFilter
                                                ? "Try changing your search or filters."
                                                : "Start by adding a salary record."}

                                        </p>


                                        {!searchQuery &&
                                            !monthFilter &&
                                            !yearFilter && (

                                                <button
                                                    onClick={
                                                        handleAddSalary
                                                    }
                                                    className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                                                >

                                                    <Plus
                                                        size={16}
                                                    />

                                                    Add Salary

                                                </button>

                                            )}

                                    </div>

                                )}


                            {/* =================================================
                                DESKTOP TABLE
                            ================================================= */}

                            {!loading &&
                                filteredSalary.length >
                                    0 && (

                                    <>

                                        <div className="hidden md:block overflow-x-auto">

                                            <table className="w-full text-left">

                                                <thead>

                                                    <tr className="bg-slate-50 border-b border-slate-100">

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Employee
                                                        </th>

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Month
                                                        </th>

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Salary
                                                        </th>

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Status
                                                        </th>

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">
                                                            Actions
                                                        </th>

                                                    </tr>

                                                </thead>


                                                <tbody className="divide-y divide-slate-100">

                                                    {filteredSalary.map(
                                                        (
                                                            record
                                                        ) => {

                                                            const employee =
                                                                getEmployeeInfo(
                                                                    record.employee_id
                                                                );


                                                            return (

                                                                <tr
                                                                    key={
                                                                        record.id
                                                                    }
                                                                    className="hover:bg-slate-50/70 transition"
                                                                >

                                                                    {/* Employee */}

                                                                    <td className="px-6 py-4">

                                                                        <div className="flex items-center gap-3">

                                                                            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">

                                                                                {employee.name
                                                                                    ?.charAt(
                                                                                        0
                                                                                    )
                                                                                    ?.toUpperCase() ||
                                                                                    "U"}

                                                                            </div>


                                                                            <div className="min-w-0">

                                                                                <p className="text-sm font-bold text-slate-800 truncate max-w-[180px]">
                                                                                    {
                                                                                        employee.name
                                                                                    }
                                                                                </p>

                                                                                <p className="text-xs text-slate-400 truncate max-w-[220px]">
                                                                                    ID #
                                                                                    {
                                                                                        record.employee_id
                                                                                    }
                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </td>


                                                                    {/* Month */}

                                                                    <td className="px-6 py-4">

                                                                        <div className="flex items-center gap-2">

                                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">

                                                                                <CalendarDays
                                                                                    size={15}
                                                                                />

                                                                            </div>


                                                                            <div>

                                                                                <p className="text-sm font-semibold text-slate-700">
                                                                                    {
                                                                                        record.month
                                                                                    }
                                                                                </p>

                                                                                <p className="text-xs text-slate-400">
                                                                                    {
                                                                                        record.year
                                                                                    }
                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </td>


                                                                    {/* Amount */}

                                                                    <td className="px-6 py-4">

                                                                        <p className="text-sm font-bold text-emerald-600">
                                                                            {formatCurrency(
                                                                                record.amount
                                                                            )}
                                                                        </p>

                                                                    </td>


                                                                    {/* Status */}

                                                                    <td className="px-6 py-4">

                                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold">

                                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                                                                            Recorded

                                                                        </span>

                                                                    </td>


                                                                    {/* Actions */}

                                                                    <td className="px-6 py-4 text-right">

                                                                        <div className="flex justify-end gap-2">

                                                                            <button
                                                                                onClick={() =>
                                                                                    handleEdit(
                                                                                        record
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold transition active:scale-95"
                                                                            >

                                                                                <Edit2
                                                                                    size={13}
                                                                                />

                                                                                Edit

                                                                            </button>


                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        record.id
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition active:scale-95"
                                                                            >

                                                                                <Trash2
                                                                                    size={13}
                                                                                />

                                                                                Delete

                                                                            </button>

                                                                        </div>

                                                                    </td>

                                                                </tr>

                                                            );

                                                        }
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>


                                        {/* =================================================
                                            MOBILE CARDS
                                        ================================================= */}

                                        <div className="md:hidden p-4 space-y-3">

                                            {filteredSalary.map(
                                                (
                                                    record
                                                ) => {

                                                    const employee =
                                                        getEmployeeInfo(
                                                            record.employee_id
                                                        );


                                                    return (

                                                        <div
                                                            key={
                                                                record.id
                                                            }
                                                            className="border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition"
                                                        >

                                                            <div className="flex items-start justify-between gap-3">

                                                                <div className="flex items-center gap-3">

                                                                    <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">

                                                                        {employee.name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            ?.toUpperCase() ||
                                                                            "U"}

                                                                    </div>


                                                                    <div>

                                                                        <p className="font-bold text-slate-800">
                                                                            {
                                                                                employee.name
                                                                            }
                                                                        </p>

                                                                        <p className="text-xs text-slate-400">
                                                                            Employee #
                                                                            {
                                                                                record.employee_id
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>


                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold">

                                                                    Recorded

                                                                </span>

                                                            </div>


                                                            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3">

                                                                <div>

                                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                                                        Salary
                                                                    </p>

                                                                    <p className="text-base font-bold text-emerald-600 mt-1">
                                                                        {formatCurrency(
                                                                            record.amount
                                                                        )}
                                                                    </p>

                                                                </div>


                                                                <div>

                                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                                                        Period
                                                                    </p>

                                                                    <p className="text-sm font-semibold text-slate-700 mt-1">
                                                                        {
                                                                            record.month
                                                                        }{" "}
                                                                        {
                                                                            record.year
                                                                        }
                                                                    </p>

                                                                </div>

                                                            </div>


                                                            <div className="mt-4 flex gap-2">

                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            record
                                                                        )
                                                                    }
                                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold"
                                                                >

                                                                    <Edit2
                                                                        size={13}
                                                                    />

                                                                    Edit

                                                                </button>


                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            record.id
                                                                        )
                                                                    }
                                                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold"
                                                                >

                                                                    <Trash2
                                                                        size={13}
                                                                    />

                                                                    Delete

                                                                </button>

                                                            </div>

                                                        </div>

                                                    );

                                                }
                                            )}

                                        </div>

                                    </>

                                )}

                        </section>

                    </div>

                </main>


                <Footer />

            </div>

        </div>

    );

}


export default Salary;