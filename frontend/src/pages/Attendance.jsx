import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
    CalendarRange,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    UserCheck,
    AlertCircle,
    RefreshCw,
    Users,
    CheckCircle2,
    XCircle,
    Clock3,
    Search,
} from "lucide-react";


function Attendance() {

    const [attendanceList, setAttendanceList] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    // Form
    const [employeeId, setEmployeeId] = useState("");
    const [attendanceDate, setAttendanceDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [status, setStatus] = useState("Present");

    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);


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

            const [attendanceResponse, employeeResponse] =
                await Promise.all([
                    api.get("/attendance/"),
                    api.get("/employees/"),
                ]);

            setAttendanceList(attendanceResponse.data);
            setEmployees(employeeResponse.data);

        } catch (err) {

            console.error(
                "Error loading attendance data:",
                err
            );

            setError(
                "Could not load attendance records. Please make sure the backend is running."
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
            };
        }

        return {
            name: employee.name,
            email: employee.email,
        };

    };


    /* ============================================================
       ATTENDANCE STATISTICS
    ============================================================ */

    const statistics = useMemo(() => {

        const present = attendanceList.filter(
            (record) =>
                record.status?.toLowerCase() === "present"
        ).length;

        const absent = attendanceList.filter(
            (record) =>
                record.status?.toLowerCase() === "absent"
        ).length;

        const late = attendanceList.filter(
            (record) =>
                record.status?.toLowerCase() === "late"
        ).length;

        return {
            total: attendanceList.length,
            present,
            absent,
            late,
        };

    }, [attendanceList]);


    /* ============================================================
       FILTER ATTENDANCE
    ============================================================ */

    const filteredAttendance = useMemo(() => {

        const query = searchQuery.trim().toLowerCase();

        return attendanceList.filter((record) => {

            const employee = getEmployeeInfo(
                record.employee_id
            );

            const matchesSearch =
                !query ||
                employee.name.toLowerCase().includes(query) ||
                employee.email.toLowerCase().includes(query) ||
                String(record.employee_id).includes(query);

            const matchesStatus =
                !statusFilter ||
                record.status?.toLowerCase() ===
                    statusFilter.toLowerCase();

            const matchesDate =
                !dateFilter ||
                record.date === dateFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesDate
            );

        });

    }, [
        attendanceList,
        employees,
        searchQuery,
        statusFilter,
        dateFilter,
    ]);


    /* ============================================================
       RESET FORM
    ============================================================ */

    const resetForm = () => {

        setEmployeeId("");

        setAttendanceDate(
            new Date().toISOString().split("T")[0]
        );

        setStatus("Present");

        setEditId(null);

    };


    /* ============================================================
       OPEN CREATE FORM
    ============================================================ */

    const handleMarkAttendance = () => {

        resetForm();

        setError("");
        setSuccessMessage("");

        setShowForm(true);

    };


    /* ============================================================
       SUBMIT ATTENDANCE
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


        try {

            if (editId) {

                /* ============================
                   UPDATE
                ============================ */

                const response = await api.put(
                    `/attendance/${editId}`,
                    {
                        employee_id: parseInt(employeeId),
                        date: attendanceDate,
                        status: status,
                    }
                );


                setAttendanceList((previous) =>
                    previous.map((record) =>
                        record.id === editId
                            ? response.data
                            : record
                    )
                );


                setSuccessMessage(
                    "Attendance record updated successfully."
                );

            } else {

                /* ============================
                   CREATE
                ============================ */

                const response = await api.post(
                    "/attendance/",
                    {
                        employee_id: parseInt(employeeId),
                        date: attendanceDate,
                        status: status,
                    }
                );


                setAttendanceList((previous) => [
                    response.data,
                    ...previous,
                ]);


                setSuccessMessage(
                    "Attendance marked successfully."
                );

            }


            resetForm();

            setShowForm(false);

        } catch (err) {

            console.error(
                "Error saving attendance:",
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
                    "Something went wrong while saving attendance."
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

        setAttendanceDate(record.date);

        setStatus(record.status);

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

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this attendance record?"
        );

        if (!confirmed) {
            return;
        }


        setError("");
        setSuccessMessage("");


        try {

            await api.delete(
                `/attendance/${id}`
            );


            setAttendanceList((previous) =>
                previous.filter(
                    (record) =>
                        record.id !== id
                )
            );


            setSuccessMessage(
                "Attendance record deleted successfully."
            );


            if (editId === id) {
                handleCancel();
            }

        } catch (err) {

            console.error(
                "Error deleting attendance:",
                err
            );

            setError(
                "Could not delete attendance record."
            );

        }

    };


    /* ============================================================
       STATUS STYLE
    ============================================================ */

    const getStatusStyle = (value) => {

        switch (
            value?.toLowerCase()
        ) {

            case "present":

                return {
                    badge:
                        "bg-emerald-50 text-emerald-700 border-emerald-200",
                    dot:
                        "bg-emerald-500",
                    icon:
                        <CheckCircle2 size={14} />,
                };


            case "absent":

                return {
                    badge:
                        "bg-red-50 text-red-700 border-red-200",
                    dot:
                        "bg-red-500",
                    icon:
                        <XCircle size={14} />,
                };


            case "late":

                return {
                    badge:
                        "bg-amber-50 text-amber-700 border-amber-200",
                    dot:
                        "bg-amber-500",
                    icon:
                        <Clock3 size={14} />,
                };


            default:

                return {
                    badge:
                        "bg-slate-50 text-slate-700 border-slate-200",
                    dot:
                        "bg-slate-500",
                    icon:
                        <Clock3 size={14} />,
                };

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

                                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                        <CalendarRange size={19} />

                                    </div>

                                    <span className="text-sm font-semibold text-blue-600">
                                        Workforce
                                    </span>

                                </div>


                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                                    Attendance
                                </h1>


                                <p className="text-sm text-slate-500 mt-1">
                                    Track and manage employee attendance records.
                                </p>

                            </div>


                            <div className="flex items-center gap-2">

                                <button
                                    onClick={loadData}
                                    disabled={loading}
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

                                        if (showForm) {
                                            handleCancel();
                                        } else {
                                            handleMarkAttendance();
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
                                        : "Mark Attendance"}

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            MESSAGES
                        ================================================= */}

                        {successMessage && (

                            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                    <CheckCircle2 size={18} />

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


                        {error && (

                            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">

                                    <AlertCircle size={18} />

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


                            {/* Total */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Total Logs
                                        </p>

                                        <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                            {statistics.total}
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Attendance records
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                        <CalendarRange size={21} />

                                    </div>

                                </div>

                            </div>


                            {/* Present */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Present
                                        </p>

                                        <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                                            {statistics.present}
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Present employees
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                        <CheckCircle2 size={21} />

                                    </div>

                                </div>

                            </div>


                            {/* Absent */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Absent
                                        </p>

                                        <h2 className="text-3xl font-bold text-red-600 mt-2">
                                            {statistics.absent}
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Absent employees
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">

                                        <XCircle size={21} />

                                    </div>

                                </div>

                            </div>


                            {/* Late */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Late
                                        </p>

                                        <h2 className="text-3xl font-bold text-amber-600 mt-2">
                                            {statistics.late}
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Late check-ins
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">

                                        <Clock3 size={21} />

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

                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                            <UserCheck size={19} />

                                        </div>


                                        <div>

                                            <h2 className="font-bold text-slate-800">
                                                {editId
                                                    ? "Edit Attendance"
                                                    : "Mark Attendance"}
                                            </h2>

                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Record an employee's daily attendance.
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        onClick={handleCancel}
                                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                                    >

                                        <X size={18} />

                                    </button>

                                </div>


                                <form
                                    onSubmit={handleSubmit}
                                    className="p-5 sm:p-6"
                                >

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                                        {/* Employee */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Employee
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            </label>


                                            <select
                                                required
                                                value={employeeId}
                                                disabled={editId !== null}
                                                onChange={(e) =>
                                                    setEmployeeId(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition disabled:opacity-60"
                                            >

                                                <option value="">
                                                    Select employee...
                                                </option>

                                                {employees.map(
                                                    (employee) => (

                                                        <option
                                                            key={employee.id}
                                                            value={employee.id}
                                                        >
                                                            {employee.name}
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>


                                        {/* Date */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Attendance Date
                                            </label>


                                            <input
                                                type="date"
                                                required
                                                value={attendanceDate}
                                                onChange={(e) =>
                                                    setAttendanceDate(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            />

                                        </div>


                                        {/* Status */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Status
                                            </label>


                                            <div className="grid grid-cols-3 gap-2">

                                                {[
                                                    "Present",
                                                    "Late",
                                                    "Absent",
                                                ].map(
                                                    (option) => {

                                                        const active =
                                                            status ===
                                                            option;

                                                        const styles = {
                                                            Present:
                                                                active
                                                                    ? "bg-emerald-600 border-emerald-600 text-white"
                                                                    : "bg-emerald-50 border-emerald-200 text-emerald-700",
                                                            Late:
                                                                active
                                                                    ? "bg-amber-500 border-amber-500 text-white"
                                                                    : "bg-amber-50 border-amber-200 text-amber-700",
                                                            Absent:
                                                                active
                                                                    ? "bg-red-600 border-red-600 text-white"
                                                                    : "bg-red-50 border-red-200 text-red-700",
                                                        };

                                                        return (

                                                            <button
                                                                key={option}
                                                                type="button"
                                                                onClick={() =>
                                                                    setStatus(
                                                                        option
                                                                    )
                                                                }
                                                                className={`py-2.5 rounded-xl border text-xs font-bold transition active:scale-95 ${styles[option]}`}
                                                            >
                                                                {option}
                                                            </button>

                                                        );

                                                    }
                                                )}

                                            </div>

                                        </div>

                                    </div>


                                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">

                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition active:scale-95"
                                        >

                                            <Save size={16} />

                                            {editId
                                                ? "Update Attendance"
                                                : "Mark Attendance"}

                                        </button>

                                    </div>

                                </form>

                            </section>

                        )}


                        {/* =================================================
                            ATTENDANCE DIRECTORY
                        ================================================= */}

                        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                            {/* Directory Header */}

                            <div className="p-5 sm:px-6 border-b border-slate-100">

                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">


                                    <div>

                                        <div className="flex items-center gap-2">

                                            <Users
                                                size={19}
                                                className="text-blue-600"
                                            />

                                            <h2 className="text-lg font-bold text-slate-800">
                                                Attendance Records
                                            </h2>

                                        </div>


                                        <p className="text-xs text-slate-400 mt-1">
                                            View and manage employee attendance logs.
                                        </p>

                                    </div>


                                    {/* Filters */}

                                    <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">


                                        {/* Search */}

                                        <div className="relative sm:w-64">

                                            <Search
                                                size={16}
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Search employee..."
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            />

                                        </div>


                                        {/* Date */}

                                        <input
                                            type="date"
                                            value={dateFilter}
                                            onChange={(e) =>
                                                setDateFilter(
                                                    e.target.value
                                                )
                                            }
                                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 outline-none focus:bg-white focus:border-blue-500"
                                        />


                                        {/* Status */}

                                        <select
                                            value={statusFilter}
                                            onChange={(e) =>
                                                setStatusFilter(
                                                    e.target.value
                                                )
                                            }
                                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 outline-none focus:bg-white focus:border-blue-500"
                                        >

                                            <option value="">
                                                All Status
                                            </option>

                                            <option value="Present">
                                                Present
                                            </option>

                                            <option value="Late">
                                                Late
                                            </option>

                                            <option value="Absent">
                                                Absent
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>


                            {/* Results Bar */}

                            <div className="px-5 sm:px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">

                                <p className="text-xs font-semibold text-slate-500">

                                    Showing{" "}

                                    <span className="text-slate-800">
                                        {filteredAttendance.length}
                                    </span>{" "}

                                    of{" "}

                                    <span className="text-slate-800">
                                        {attendanceList.length}
                                    </span>{" "}

                                    records

                                </p>


                                {(searchQuery ||
                                    statusFilter ||
                                    dateFilter) && (

                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setStatusFilter("");
                                            setDateFilter("");
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

                                    <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 items-center justify-center mb-4">

                                        <RefreshCw
                                            size={22}
                                            className="animate-spin"
                                        />

                                    </div>


                                    <p className="text-sm font-semibold text-slate-700">
                                        Loading attendance...
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Fetching the latest attendance records.
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                EMPTY
                            ================================================= */}

                            {!loading &&
                                filteredAttendance.length === 0 && (

                                    <div className="p-12 sm:p-16 text-center">

                                        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">

                                            <CalendarRange size={28} />

                                        </div>


                                        <h3 className="text-base font-bold text-slate-700">
                                            No attendance records found
                                        </h3>


                                        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">

                                            {searchQuery ||
                                            statusFilter ||
                                            dateFilter
                                                ? "Try changing your search or filters."
                                                : "Start by marking attendance for an employee."}

                                        </p>

                                    </div>

                                )}


                            {/* =================================================
                                DESKTOP TABLE
                            ================================================= */}

                            {!loading &&
                                filteredAttendance.length > 0 && (

                                    <>

                                        <div className="hidden md:block overflow-x-auto">

                                            <table className="w-full text-left">

                                                <thead>

                                                    <tr className="bg-slate-50 border-b border-slate-100">

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Employee
                                                        </th>

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Date
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

                                                    {filteredAttendance.map(
                                                        (record) => {

                                                            const employee =
                                                                getEmployeeInfo(
                                                                    record.employee_id
                                                                );

                                                            const statusStyle =
                                                                getStatusStyle(
                                                                    record.status
                                                                );


                                                            return (

                                                                <tr
                                                                    key={record.id}
                                                                    className="hover:bg-slate-50/70 transition"
                                                                >

                                                                    <td className="px-6 py-4">

                                                                        <div className="flex items-center gap-3">

                                                                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">

                                                                                {employee.name
                                                                                    ?.charAt(
                                                                                        0
                                                                                    )
                                                                                    ?.toUpperCase() ||
                                                                                    "U"}

                                                                            </div>


                                                                            <div>

                                                                                <p className="text-sm font-bold text-slate-800">
                                                                                    {employee.name}
                                                                                </p>

                                                                                <p className="text-xs text-slate-400">
                                                                                    ID #{record.employee_id}
                                                                                </p>

                                                                            </div>

                                                                        </div>

                                                                    </td>


                                                                    <td className="px-6 py-4">

                                                                        <p className="text-sm font-semibold text-slate-700">

                                                                            {new Date(
                                                                                record.date
                                                                            ).toLocaleDateString(
                                                                                undefined,
                                                                                {
                                                                                    year: "numeric",
                                                                                    month: "short",
                                                                                    day: "numeric",
                                                                                }
                                                                            )}

                                                                        </p>

                                                                    </td>


                                                                    <td className="px-6 py-4">

                                                                        <span
                                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${statusStyle.badge}`}
                                                                        >

                                                                            {statusStyle.icon}

                                                                            {record.status}

                                                                        </span>

                                                                    </td>


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

                                                                                <Edit2 size={13} />

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

                                                                                <Trash2 size={13} />

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

                                            {filteredAttendance.map(
                                                (record) => {

                                                    const employee =
                                                        getEmployeeInfo(
                                                            record.employee_id
                                                        );

                                                    const statusStyle =
                                                        getStatusStyle(
                                                            record.status
                                                        );


                                                    return (

                                                        <div
                                                            key={record.id}
                                                            className="border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition"
                                                        >

                                                            <div className="flex items-start justify-between gap-3">

                                                                <div className="flex items-center gap-3">

                                                                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">

                                                                        {employee.name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            ?.toUpperCase() ||
                                                                            "U"}

                                                                    </div>


                                                                    <div>

                                                                        <p className="font-bold text-slate-800">
                                                                            {employee.name}
                                                                        </p>

                                                                        <p className="text-xs text-slate-400">
                                                                            ID #{record.employee_id}
                                                                        </p>

                                                                    </div>

                                                                </div>


                                                                <span
                                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${statusStyle.badge}`}
                                                                >

                                                                    {record.status}

                                                                </span>

                                                            </div>


                                                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">

                                                                <p className="text-xs font-semibold text-slate-500">

                                                                    📅{" "}

                                                                    {new Date(
                                                                        record.date
                                                                    ).toLocaleDateString(
                                                                        undefined,
                                                                        {
                                                                            year: "numeric",
                                                                            month: "short",
                                                                            day: "numeric",
                                                                        }
                                                                    )}

                                                                </p>


                                                                <div className="flex gap-2">

                                                                    <button
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                record
                                                                            )
                                                                        }
                                                                        className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold"
                                                                    >
                                                                        Edit
                                                                    </button>


                                                                    <button
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                record.id
                                                                            )
                                                                        }
                                                                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold"
                                                                    >
                                                                        Delete
                                                                    </button>

                                                                </div>

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


export default Attendance;