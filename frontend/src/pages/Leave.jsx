import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
    CalendarDays,
    Plus,
    CheckCircle2,
    XCircle,
    Trash2,
    Save,
    X,
    AlertCircle,
    RefreshCw,
    ClipboardList,
    Clock3,
    CircleCheck,
    CircleX,
    Users,
    Search,
    FileText,
} from "lucide-react";


function Leave() {

    const [leaveList, setLeaveList] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Form states
    const [employeeId, setEmployeeId] = useState("");
    const [leaveType, setLeaveType] = useState("Casual Leave");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reason, setReason] = useState("");

    const [showForm, setShowForm] = useState(false);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");


    const leaveTypes = [
        "Casual Leave",
        "Medical Leave",
        "Earned Leave",
        "Maternity Leave",
        "Paternity Leave",
        "Unpaid Leave",
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

            const [leaveRes, empRes] =
                await Promise.all([
                    api.get("/leave/"),
                    api.get("/employees/"),
                ]);


            const sortedLeaves =
                [...leaveRes.data].sort(
                    (a, b) => {

                        if (
                            a.status === "Pending" &&
                            b.status !== "Pending"
                        ) {
                            return -1;
                        }

                        if (
                            a.status !== "Pending" &&
                            b.status === "Pending"
                        ) {
                            return 1;
                        }

                        return (
                            new Date(
                                b.start_date
                            ) -
                            new Date(
                                a.start_date
                            )
                        );

                    }
                );


            setLeaveList(sortedLeaves);
            setEmployees(empRes.data);

        } catch (err) {

            console.error(
                "Error loading leave data:",
                err
            );

            setError(
                "Could not retrieve leave applications or employee data."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ============================================================
       EMPLOYEE INFO
    ============================================================ */

    const getEmployeeInfo = (empId) => {

        const employee =
            employees.find(
                (emp) =>
                    emp.id === empId
            );


        if (!employee) {

            return {
                name: `Employee #${empId}`,
                email: "",
            };

        }


        return {
            name: employee.name,
            email: employee.email,
        };

    };


    /* ============================================================
       DATE FORMAT
    ============================================================ */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    /* ============================================================
       LEAVE DAYS
    ============================================================ */

    const calculateDays = (
        start,
        end
    ) => {

        if (!start || !end) {
            return 0;
        }

        const startDate =
            new Date(start);

        const endDate =
            new Date(end);

        const difference =
            endDate - startDate;

        return (
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            ) + 1
        );

    };


    /* ============================================================
       STATISTICS
    ============================================================ */

    const statistics = useMemo(() => {

        const total =
            leaveList.length;


        const pending =
            leaveList.filter(
                (item) =>
                    item.status ===
                    "Pending"
            ).length;


        const approved =
            leaveList.filter(
                (item) =>
                    item.status ===
                    "Approved"
            ).length;


        const rejected =
            leaveList.filter(
                (item) =>
                    item.status ===
                    "Rejected"
            ).length;


        return {
            total,
            pending,
            approved,
            rejected,
        };

    }, [leaveList]);


    /* ============================================================
       FILTERED DATA
    ============================================================ */

    const filteredLeaves = useMemo(() => {

        const query =
            searchQuery
                .trim()
                .toLowerCase();


        return leaveList.filter(
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
                    ).includes(query) ||
                    record.reason
                        ?.toLowerCase()
                        .includes(query);


                const matchesStatus =
                    !statusFilter ||
                    record.status ===
                        statusFilter;


                const matchesType =
                    !typeFilter ||
                    record.leave_type ===
                        typeFilter;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesType
                );

            }
        );

    }, [
        leaveList,
        employees,
        searchQuery,
        statusFilter,
        typeFilter,
    ]);


    /* ============================================================
       SUBMIT LEAVE
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


        if (!startDate || !endDate) {

            setError(
                "Start date and End date are required."
            );

            return;

        }


        if (
            new Date(startDate) >
            new Date(endDate)
        ) {

            setError(
                "Start date cannot be after end date."
            );

            return;

        }


        if (!reason.trim()) {

            setError(
                "Please enter a reason for leave."
            );

            return;

        }


        try {

            const response =
                await api.post(
                    "/leave/",
                    {
                        employee_id:
                            parseInt(
                                employeeId
                            ),

                        leave_type:
                            leaveType,

                        start_date:
                            startDate,

                        end_date:
                            endDate,

                        reason:
                            reason.trim(),
                    }
                );


            setSuccessMessage(
                "Leave application submitted successfully!"
            );


            setLeaveList(
                (previous) => [
                    response.data,
                    ...previous,
                ]
            );


            resetForm();

            setShowForm(false);

        } catch (err) {

            console.error(
                "Error submitting leave:",
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
                    "Something went wrong while submitting the leave request."
                );

            }

        }

    };


    /* ============================================================
       RESET FORM
    ============================================================ */

    const resetForm = () => {

        setEmployeeId("");
        setLeaveType("Casual Leave");
        setStartDate("");
        setEndDate("");
        setReason("");

    };


    /* ============================================================
       STATUS CHANGE
    ============================================================ */

    const handleStatusChange = async (
        id,
        newStatus
    ) => {

        setError("");
        setSuccessMessage("");


        try {

            const response =
                await api.patch(
                    `/leave/${id}/status?new_status=${newStatus}`
                );


            setSuccessMessage(
                `Leave application ${newStatus.toLowerCase()} successfully!`
            );


            setLeaveList(
                (previous) =>
                    previous.map(
                        (item) =>
                            item.id === id
                                ? response.data
                                : item
                    )
            );

        } catch (err) {

            console.error(
                "Error updating leave status:",
                err
            );

            setError(
                "Failed to update leave request status."
            );

        }

    };


    /* ============================================================
       DELETE
    ============================================================ */

    const handleDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this leave application?"
            );


        if (!confirmed) {
            return;
        }


        setError("");
        setSuccessMessage("");


        try {

            await api.delete(
                `/leave/${id}`
            );


            setSuccessMessage(
                "Leave record deleted successfully."
            );


            setLeaveList(
                (previous) =>
                    previous.filter(
                        (item) =>
                            item.id !== id
                    )
            );

        } catch (err) {

            console.error(
                "Error deleting leave:",
                err
            );

            setError(
                "Could not delete leave record."
            );

        }

    };


    /* ============================================================
       STATUS STYLE
    ============================================================ */

    const getStatusStyle = (
        status
    ) => {

        switch (
            status?.toLowerCase()
        ) {

            case "approved":

                return {
                    badge:
                        "bg-emerald-50 text-emerald-700 border-emerald-200",

                    icon:
                        "text-emerald-600",
                };


            case "rejected":

                return {
                    badge:
                        "bg-red-50 text-red-700 border-red-200",

                    icon:
                        "text-red-600",
                };


            default:

                return {
                    badge:
                        "bg-amber-50 text-amber-700 border-amber-200",

                    icon:
                        "text-amber-600",
                };

        }

    };


    /* ============================================================
       CLEAR FILTERS
    ============================================================ */

    const clearFilters = () => {

        setSearchQuery("");
        setStatusFilter("");
        setTypeFilter("");

    };


    return (

        <div className="min-h-screen flex bg-slate-50">

            <Sidebar />


            <div className="flex-1 min-w-0 flex flex-col">

                <Navbar />


                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">

                    <div className="max-w-7xl mx-auto">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">

                            <div>

                                <div className="flex items-center gap-2 mb-2">

                                    <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

                                        <CalendarDays
                                            size={19}
                                        />

                                    </div>

                                    <span className="text-sm font-semibold text-violet-600">
                                        Employee Services
                                    </span>

                                </div>


                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                                    Leave Management
                                </h1>


                                <p className="text-sm text-slate-500 mt-1">
                                    Review, manage and track employee leave requests.
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

                                            resetForm();
                                            setShowForm(
                                                false
                                            );

                                        } else {

                                            setError("");
                                            setSuccessMessage("");
                                            setShowForm(
                                                true
                                            );

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
                                        : "Apply Leave"}

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            STATISTICS
                        ================================================= */}

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">


                            {/* Total */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Total Requests
                                        </p>

                                        <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                            {
                                                statistics.total
                                            }
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            All leave applications
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                        <ClipboardList
                                            size={21}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Approved */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Approved
                                        </p>

                                        <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                                            {
                                                statistics.approved
                                            }
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Accepted requests
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                        <CircleCheck
                                            size={21}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Pending */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Pending
                                        </p>

                                        <h2 className="text-3xl font-bold text-amber-500 mt-2">
                                            {
                                                statistics.pending
                                            }
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Awaiting approval
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">

                                        <Clock3
                                            size={21}
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Rejected */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Rejected
                                        </p>

                                        <h2 className="text-3xl font-bold text-red-600 mt-2">
                                            {
                                                statistics.rejected
                                            }
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Declined requests
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">

                                        <CircleX
                                            size={21}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            SUCCESS MESSAGE
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
                            ERROR MESSAGE
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
                            APPLY LEAVE FORM
                        ================================================= */}

                        {showForm && (

                            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">

                                <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

                                            <CalendarDays
                                                size={19}
                                            />

                                        </div>


                                        <div>

                                            <h2 className="font-bold text-slate-800">
                                                Apply For Leave
                                            </h2>

                                            <p className="text-xs text-slate-400 mt-0.5">
                                                Submit a new employee leave request.
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={() => {

                                            resetForm();
                                            setShowForm(
                                                false
                                            );

                                        }}
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

                                        <div>

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
                                                onChange={(e) =>
                                                    setEmployeeId(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            >

                                                <option value="">
                                                    Choose Employee...
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
                                                            }{" "}
                                                            (ID:{" "}
                                                            {
                                                                employee.id
                                                            })

                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>


                                        {/* Leave Type */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Leave Type
                                            </label>


                                            <select
                                                value={
                                                    leaveType
                                                }
                                                onChange={(e) =>
                                                    setLeaveType(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            >

                                                {leaveTypes.map(
                                                    (
                                                        type
                                                    ) => (

                                                        <option
                                                            key={
                                                                type
                                                            }
                                                            value={
                                                                type
                                                            }
                                                        >
                                                            {
                                                                type
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                        </div>


                                        {/* Start Date */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                Start Date
                                            </label>


                                            <input
                                                type="date"
                                                required
                                                value={
                                                    startDate
                                                }
                                                onChange={(e) =>
                                                    setStartDate(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            />

                                        </div>


                                        {/* End Date */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                End Date
                                            </label>


                                            <input
                                                type="date"
                                                required
                                                value={
                                                    endDate
                                                }
                                                min={
                                                    startDate ||
                                                    undefined
                                                }
                                                onChange={(e) =>
                                                    setEndDate(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            />

                                        </div>

                                    </div>


                                    {/* Reason */}

                                    <div className="mt-5">

                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Reason
                                        </label>


                                        <textarea
                                            rows={3}
                                            required
                                            placeholder="Enter reason for leave..."
                                            value={
                                                reason
                                            }
                                            onChange={(e) =>
                                                setReason(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition resize-none"
                                        />

                                    </div>


                                    {/* Duration preview */}

                                    {startDate &&
                                        endDate &&
                                        new Date(
                                            startDate
                                        ) <=
                                            new Date(
                                                endDate
                                            ) && (

                                            <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">

                                                    <CalendarDays
                                                        size={17}
                                                    />

                                                </div>


                                                <div>

                                                    <p className="text-xs text-violet-500 font-semibold">
                                                        Leave Duration
                                                    </p>

                                                    <p className="text-sm font-bold text-violet-800">

                                                        {
                                                            calculateDays(
                                                                startDate,
                                                                endDate
                                                            )
                                                        }{" "}
                                                        {calculateDays(
                                                            startDate,
                                                            endDate
                                                        ) ===
                                                        1
                                                            ? "Day"
                                                            : "Days"}

                                                    </p>

                                                </div>

                                            </div>

                                        )}


                                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">

                                        <button
                                            type="button"
                                            onClick={() => {

                                                resetForm();
                                                setShowForm(
                                                    false
                                                );

                                            }}
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

                                            Submit Request

                                        </button>

                                    </div>

                                </form>

                            </section>

                        )}


                        {/* =================================================
                            LEAVE RECORDS
                        ================================================= */}

                        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                            {/* Section Header */}

                            <div className="p-5 sm:px-6 border-b border-slate-100">

                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <FileText
                                                size={19}
                                                className="text-violet-600"
                                            />

                                            <h2 className="text-lg font-bold text-slate-800">
                                                Leave Requests
                                            </h2>

                                        </div>


                                        <p className="text-xs text-slate-400 mt-1">
                                            Review and manage employee leave applications.
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
                                                placeholder="Search employee..."
                                                value={
                                                    searchQuery
                                                }
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target
                                                            .value
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            />

                                        </div>


                                        {/* Type */}

                                        <select
                                            value={
                                                typeFilter
                                            }
                                            onChange={(e) =>
                                                setTypeFilter(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 outline-none focus:bg-white focus:border-blue-500"
                                        >

                                            <option value="">
                                                All Types
                                            </option>


                                            {leaveTypes.map(
                                                (
                                                    type
                                                ) => (

                                                    <option
                                                        key={
                                                            type
                                                        }
                                                        value={
                                                            type
                                                        }
                                                    >
                                                        {
                                                            type
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>


                                        {/* Status */}

                                        <select
                                            value={
                                                statusFilter
                                            }
                                            onChange={(e) =>
                                                setStatusFilter(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 outline-none focus:bg-white focus:border-blue-500"
                                        >

                                            <option value="">
                                                All Status
                                            </option>

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Approved">
                                                Approved
                                            </option>

                                            <option value="Rejected">
                                                Rejected
                                            </option>

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
                                            filteredLeaves.length
                                        }
                                    </span>{" "}

                                    of{" "}

                                    <span className="text-slate-800">
                                        {
                                            leaveList.length
                                        }
                                    </span>{" "}

                                    requests

                                </p>


                                {(searchQuery ||
                                    statusFilter ||
                                    typeFilter) && (

                                    <button
                                        onClick={
                                            clearFilters
                                        }
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

                                    <div className="inline-flex w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 items-center justify-center mb-4">

                                        <RefreshCw
                                            size={22}
                                            className="animate-spin"
                                        />

                                    </div>


                                    <p className="text-sm font-semibold text-slate-700">
                                        Loading leave requests...
                                    </p>


                                    <p className="text-xs text-slate-400 mt-1">
                                        Fetching the latest applications.
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                EMPTY
                            ================================================= */}

                            {!loading &&
                                filteredLeaves.length ===
                                    0 && (

                                    <div className="p-12 sm:p-16 text-center">

                                        <div className="mx-auto w-16 h-16 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center mb-4">

                                            <CalendarDays
                                                size={28}
                                            />

                                        </div>


                                        <h3 className="text-base font-bold text-slate-700">
                                            No leave requests found
                                        </h3>


                                        <p className="text-sm text-slate-400 mt-1">
                                            {searchQuery ||
                                            statusFilter ||
                                            typeFilter
                                                ? "Try changing your search or filters."
                                                : "No leave applications have been submitted yet."}
                                        </p>


                                        {!searchQuery &&
                                            !statusFilter &&
                                            !typeFilter && (

                                                <button
                                                    onClick={() =>
                                                        setShowForm(
                                                            true
                                                        )
                                                    }
                                                    className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                                                >

                                                    <Plus
                                                        size={16}
                                                    />

                                                    Apply Leave

                                                </button>

                                            )}

                                    </div>

                                )}


                            {/* =================================================
                                DESKTOP TABLE
                            ================================================= */}

                            {!loading &&
                                filteredLeaves.length >
                                    0 && (

                                    <>

                                        <div className="hidden lg:block overflow-x-auto">

                                            <table className="w-full text-left">

                                                <thead>

                                                    <tr className="bg-slate-50 border-b border-slate-100">

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Employee
                                                        </th>

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Leave Type
                                                        </th>

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Duration
                                                        </th>

                                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            Reason
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

                                                    {filteredLeaves.map(
                                                        (
                                                            record
                                                        ) => {

                                                            const employee =
                                                                getEmployeeInfo(
                                                                    record.employee_id
                                                                );


                                                            const days =
                                                                calculateDays(
                                                                    record.start_date,
                                                                    record.end_date
                                                                );


                                                            const statusStyle =
                                                                getStatusStyle(
                                                                    record.status
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


                                                                            <div>

                                                                                <p className="text-sm font-bold text-slate-800">
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

                                                                    </td>


                                                                    {/* Type */}

                                                                    <td className="px-6 py-4">

                                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold">

                                                                            {
                                                                                record.leave_type
                                                                            }

                                                                        </span>

                                                                    </td>


                                                                    {/* Duration */}

                                                                    <td className="px-6 py-4">

                                                                        <div>

                                                                            <p className="text-sm font-semibold text-slate-700">
                                                                                {
                                                                                    formatDate(
                                                                                        record.start_date
                                                                                    )
                                                                                }
                                                                                {" - "}
                                                                                {
                                                                                    formatDate(
                                                                                        record.end_date
                                                                                    )
                                                                                }
                                                                            </p>


                                                                            <p className="text-xs text-slate-400 mt-1">

                                                                                {days}{" "}
                                                                                {days ===
                                                                                1
                                                                                    ? "day"
                                                                                    : "days"}

                                                                            </p>

                                                                        </div>

                                                                    </td>


                                                                    {/* Reason */}

                                                                    <td className="px-6 py-4 max-w-[220px]">

                                                                        <p
                                                                            title={
                                                                                record.reason
                                                                            }
                                                                            className="text-sm text-slate-500 truncate"
                                                                        >
                                                                            {
                                                                                record.reason
                                                                            }
                                                                        </p>

                                                                    </td>


                                                                    {/* Status */}

                                                                    <td className="px-6 py-4">

                                                                        <span
                                                                            className={`inline-flex items-center gap-1.5 border text-xs font-bold px-3 py-1.5 rounded-full ${statusStyle.badge}`}
                                                                        >

                                                                            <span className="w-1.5 h-1.5 rounded-full bg-current" />

                                                                            {
                                                                                record.status
                                                                            }

                                                                        </span>

                                                                    </td>


                                                                    {/* Actions */}

                                                                    <td className="px-6 py-4">

                                                                        <div className="flex justify-end items-center gap-2">

                                                                            {record.status ===
                                                                                "Pending" && (
                                                                                <>

                                                                                    <button
                                                                                        onClick={() =>
                                                                                            handleStatusChange(
                                                                                                record.id,
                                                                                                "Approved"
                                                                                            )
                                                                                        }
                                                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition active:scale-95"
                                                                                    >

                                                                                        <CheckCircle2
                                                                                            size={
                                                                                                13
                                                                                            }
                                                                                        />

                                                                                        Approve

                                                                                    </button>


                                                                                    <button
                                                                                        onClick={() =>
                                                                                            handleStatusChange(
                                                                                                record.id,
                                                                                                "Rejected"
                                                                                            )
                                                                                        }
                                                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition active:scale-95"
                                                                                    >

                                                                                        <XCircle
                                                                                            size={
                                                                                                13
                                                                                            }
                                                                                        />

                                                                                        Reject

                                                                                    </button>

                                                                                </>
                                                                            )}


                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDelete(
                                                                                        record.id
                                                                                    )
                                                                                }
                                                                                className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 flex items-center justify-center transition"
                                                                                title="Delete request"
                                                                            >

                                                                                <Trash2
                                                                                    size={
                                                                                        15
                                                                                    }
                                                                                />

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
                                            MOBILE / TABLET CARDS
                                        ================================================= */}

                                        <div className="lg:hidden p-4 sm:p-5 space-y-4">

                                            {filteredLeaves.map(
                                                (
                                                    record
                                                ) => {

                                                    const employee =
                                                        getEmployeeInfo(
                                                            record.employee_id
                                                        );


                                                    const days =
                                                        calculateDays(
                                                            record.start_date,
                                                            record.end_date
                                                        );


                                                    const statusStyle =
                                                        getStatusStyle(
                                                            record.status
                                                        );


                                                    return (

                                                        <div
                                                            key={
                                                                record.id
                                                            }
                                                            className="border border-slate-200 rounded-2xl p-4 sm:p-5 hover:shadow-sm transition"
                                                        >

                                                            {/* Card Header */}

                                                            <div className="flex items-start justify-between gap-3">

                                                                <div className="flex items-center gap-3">

                                                                    <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold shrink-0">

                                                                        {employee.name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            ?.toUpperCase() ||
                                                                            "U"}

                                                                    </div>


                                                                    <div className="min-w-0">

                                                                        <p className="font-bold text-slate-800 truncate">
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


                                                                <span
                                                                    className={`shrink-0 inline-flex items-center gap-1.5 border text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle.badge}`}
                                                                >

                                                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />

                                                                    {
                                                                        record.status
                                                                    }

                                                                </span>

                                                            </div>


                                                            {/* Leave Info */}

                                                            <div className="mt-4 grid grid-cols-2 gap-3">

                                                                <div className="bg-violet-50 rounded-xl p-3">

                                                                    <p className="text-[10px] uppercase tracking-wider font-bold text-violet-400">
                                                                        Leave Type
                                                                    </p>

                                                                    <p className="text-sm font-bold text-violet-700 mt-1">
                                                                        {
                                                                            record.leave_type
                                                                        }
                                                                    </p>

                                                                </div>


                                                                <div className="bg-blue-50 rounded-xl p-3">

                                                                    <p className="text-[10px] uppercase tracking-wider font-bold text-blue-400">
                                                                        Duration
                                                                    </p>

                                                                    <p className="text-sm font-bold text-blue-700 mt-1">
                                                                        {days}{" "}
                                                                        {days ===
                                                                        1
                                                                            ? "Day"
                                                                            : "Days"}
                                                                    </p>

                                                                </div>

                                                            </div>


                                                            {/* Dates */}

                                                            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">

                                                                <CalendarDays
                                                                    size={
                                                                        15
                                                                    }
                                                                    className="text-slate-400"
                                                                />

                                                                <span>

                                                                    {
                                                                        formatDate(
                                                                            record.start_date
                                                                        )
                                                                    }

                                                                    {" - "}

                                                                    {
                                                                        formatDate(
                                                                            record.end_date
                                                                        )
                                                                    }

                                                                </span>

                                                            </div>


                                                            {/* Reason */}

                                                            <div className="mt-3 pt-3 border-t border-slate-100">

                                                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                                                                    Reason
                                                                </p>

                                                                <p className="text-sm text-slate-600">
                                                                    {
                                                                        record.reason
                                                                    }
                                                                </p>

                                                            </div>


                                                            {/* Actions */}

                                                            <div className="mt-4 flex gap-2">

                                                                {record.status ===
                                                                    "Pending" && (
                                                                    <>

                                                                        <button
                                                                            onClick={() =>
                                                                                handleStatusChange(
                                                                                    record.id,
                                                                                    "Approved"
                                                                                )
                                                                            }
                                                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition"
                                                                        >

                                                                            <CheckCircle2
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />

                                                                            Approve

                                                                        </button>


                                                                        <button
                                                                            onClick={() =>
                                                                                handleStatusChange(
                                                                                    record.id,
                                                                                    "Rejected"
                                                                                )
                                                                            }
                                                                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition"
                                                                        >

                                                                            <XCircle
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />

                                                                            Reject

                                                                        </button>

                                                                    </>
                                                                )}


                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            record.id
                                                                        )
                                                                    }
                                                                    className="w-11 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-400 hover:text-red-600 flex items-center justify-center transition"
                                                                    title="Delete"
                                                                >

                                                                    <Trash2
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

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


export default Leave;