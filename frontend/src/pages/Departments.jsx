import { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
    Plus,
    Edit2,
    Trash2,
    Building2,
    Save,
    X,
    AlertCircle,
    Search,
    RefreshCw,
    Users,
    CheckCircle2,
    FolderKanban,
} from "lucide-react";


function Departments() {

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    const [searchQuery, setSearchQuery] = useState("");

    const [showForm, setShowForm] = useState(false);


    // Form states

    const [name, setName] = useState("");

    const [description, setDescription] = useState("");

    const [editId, setEditId] = useState(null);


    /* ============================================================
       LOAD DEPARTMENTS
    ============================================================ */

    useEffect(() => {
        loadDepartments();
    }, []);


    const loadDepartments = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/departments/");

            setDepartments(response.data);

        } catch (err) {

            console.error(
                "Error loading departments:",
                err
            );

            setError(
                "Failed to fetch departments from server."
            );

        } finally {

            setLoading(false);

        }

    };


    /* ============================================================
       FILTER DEPARTMENTS
    ============================================================ */

    const filteredDepartments = useMemo(() => {

        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return departments;
        }

        return departments.filter((department) => {

            const departmentName =
                department.department_name?.toLowerCase() || "";

            const departmentDescription =
                department.description?.toLowerCase() || "";

            return (
                departmentName.includes(query) ||
                departmentDescription.includes(query)
            );

        });

    }, [departments, searchQuery]);


    /* ============================================================
       RESET FORM
    ============================================================ */

    const resetForm = () => {

        setName("");

        setDescription("");

        setEditId(null);

        setError("");

    };


    /* ============================================================
       OPEN CREATE FORM
    ============================================================ */

    const handleCreateClick = () => {

        resetForm();

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


        if (!name.trim()) {

            setError(
                "Department name is required."
            );

            return;

        }


        try {

            if (editId) {

                /* ============================
                   UPDATE
                ============================ */

                const response = await api.put(
                    `/departments/${editId}`,
                    {
                        department_name: name.trim(),
                        description: description.trim(),
                    }
                );


                setSuccessMessage(
                    "Department updated successfully!"
                );


                setDepartments((previous) =>
                    previous.map((department) =>
                        department.id === editId
                            ? response.data
                            : department
                    )
                );

            } else {

                /* ============================
                   CREATE
                ============================ */

                const response = await api.post(
                    "/departments/",
                    {
                        department_name: name.trim(),
                        description: description.trim(),
                    }
                );


                setSuccessMessage(
                    "Department created successfully!"
                );


                setDepartments((previous) => [
                    ...previous,
                    response.data,
                ]);

            }


            resetForm();

            setShowForm(false);

        } catch (err) {

            console.error(
                "Error saving department:",
                err
            );


            if (
                err.response &&
                err.response.data &&
                err.response.data.detail
            ) {

                setError(
                    err.response.data.detail
                );

            } else {

                setError(
                    "Something went wrong while saving the department."
                );

            }

        }

    };


    /* ============================================================
       EDIT DEPARTMENT
    ============================================================ */

    const handleEdit = (department) => {

        setEditId(department.id);

        setName(
            department.department_name || ""
        );

        setDescription(
            department.description || ""
        );

        setError("");

        setSuccessMessage("");

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    };


    /* ============================================================
       CANCEL EDIT / CREATE
    ============================================================ */

    const handleCancel = () => {

        resetForm();

        setShowForm(false);

    };


    /* ============================================================
       DELETE DEPARTMENT
    ============================================================ */

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this department? Doing so may delete all employees associated with this department."
        );


        if (!confirmed) {
            return;
        }


        setError("");

        setSuccessMessage("");


        try {

            await api.delete(
                `/departments/${id}`
            );


            setDepartments((previous) =>
                previous.filter(
                    (department) =>
                        department.id !== id
                )
            );


            setSuccessMessage(
                "Department deleted successfully."
            );


            if (editId === id) {
                resetForm();
                setShowForm(false);
            }

        } catch (err) {

            console.error(
                "Error deleting department:",
                err
            );


            setError(
                "Could not delete department."
            );

        }

    };


    /* ============================================================
       DEPARTMENT COLOR
    ============================================================ */

    const getDepartmentStyle = (index) => {

        const styles = [
            {
                icon:
                    "bg-blue-100 text-blue-600",
                badge:
                    "bg-blue-50 text-blue-700 border-blue-100",
                border:
                    "border-l-blue-500",
            },
            {
                icon:
                    "bg-violet-100 text-violet-600",
                badge:
                    "bg-violet-50 text-violet-700 border-violet-100",
                border:
                    "border-l-violet-500",
            },
            {
                icon:
                    "bg-emerald-100 text-emerald-600",
                badge:
                    "bg-emerald-50 text-emerald-700 border-emerald-100",
                border:
                    "border-l-emerald-500",
            },
            {
                icon:
                    "bg-orange-100 text-orange-600",
                badge:
                    "bg-orange-50 text-orange-700 border-orange-100",
                border:
                    "border-l-orange-500",
            },
        ];

        return styles[index % styles.length];

    };


    return (

        <div className="min-h-screen flex bg-slate-50">

            {/* ====================================================
                SIDEBAR
            ==================================================== */}

            <Sidebar />


            {/* ====================================================
                MAIN APPLICATION
            ==================================================== */}

            <div className="flex-1 min-w-0 flex flex-col">

                <Navbar />


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">

                    <div className="max-w-6xl mx-auto">


                        {/* =================================================
                            PAGE HEADER
                        ================================================= */}

                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-7">

                            <div>

                                <div className="flex items-center gap-2 mb-2">

                                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                        <Building2 size={19} />

                                    </div>

                                    <span className="text-sm font-semibold text-blue-600">
                                        Organization
                                    </span>

                                </div>


                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">

                                    Departments

                                </h1>


                                <p className="text-sm text-slate-500 mt-1">

                                    Manage departments, teams, and organization structure.

                                </p>

                            </div>


                            {/* Header Actions */}

                            <div className="flex items-center gap-2">

                                <button
                                    onClick={loadDepartments}
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
                                    onClick={handleCreateClick}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition active:scale-95"
                                >

                                    <Plus size={17} />

                                    Add Department

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            SUCCESS MESSAGE
                        ================================================= */}

                        {successMessage && (

                            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">

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


                        {/* =================================================
                            ERROR MESSAGE
                        ================================================= */}

                        {error && (

                            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">

                                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">

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
                            OVERVIEW CARDS
                        ================================================= */}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">


                            {/* Total Departments */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Total Departments
                                        </p>

                                        <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                            {departments.length}
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Organization units
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                        <Building2 size={21} />

                                    </div>

                                </div>

                            </div>


                            {/* Teams */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Teams
                                        </p>

                                        <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                            {departments.length}
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Managed teams
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

                                        <Users size={21} />

                                    </div>

                                </div>

                            </div>


                            {/* Active */}

                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Active
                                        </p>

                                        <h2 className="text-3xl font-bold text-emerald-600 mt-2">
                                            {departments.length}
                                        </h2>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Current departments
                                        </p>

                                    </div>


                                    <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                        <CheckCircle2 size={21} />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            CREATE / EDIT FORM
                        ================================================= */}

                        {showForm && (

                            <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-6">

                                {/* Form Header */}

                                <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                            {editId ? (
                                                <Edit2 size={19} />
                                            ) : (
                                                <Plus size={20} />
                                            )}

                                        </div>


                                        <div>

                                            <h2 className="font-bold text-slate-800">

                                                {editId
                                                    ? "Edit Department"
                                                    : "Create Department"}

                                            </h2>

                                            <p className="text-xs text-slate-400 mt-0.5">

                                                {editId
                                                    ? "Update department information."
                                                    : "Add a new department to your organization."}

                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                                    >

                                        <X size={18} />

                                    </button>

                                </div>


                                {/* Form */}

                                <form
                                    onSubmit={handleSubmit}
                                    className="p-5 sm:p-6"
                                >

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">


                                        {/* Department Name */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">

                                                Department Name

                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>

                                            </label>


                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                placeholder="e.g. Engineering"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            />

                                        </div>


                                        {/* Description */}

                                        <div>

                                            <label className="block text-sm font-semibold text-slate-700 mb-2">

                                                Description

                                                <span className="text-xs text-slate-400 font-normal ml-1">
                                                    Optional
                                                </span>

                                            </label>


                                            <input
                                                type="text"
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(e.target.value)
                                                }
                                                placeholder="Brief description of the department"
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                            />

                                        </div>

                                    </div>


                                    {/* Buttons */}

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
                                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition active:scale-95"
                                        >

                                            {editId ? (
                                                <Save size={16} />
                                            ) : (
                                                <Plus size={16} />
                                            )}

                                            {editId
                                                ? "Update Department"
                                                : "Create Department"}

                                        </button>

                                    </div>

                                </form>

                            </section>

                        )}


                        {/* =================================================
                            SEARCH + DIRECTORY HEADER
                        ================================================= */}

                        <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                            {/* Header */}

                            <div className="p-5 sm:px-6 border-b border-slate-100">

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">


                                    <div>

                                        <div className="flex items-center gap-2">

                                            <FolderKanban
                                                size={19}
                                                className="text-blue-600"
                                            />

                                            <h2 className="text-lg font-bold text-slate-800">
                                                Department Directory
                                            </h2>

                                        </div>

                                        <p className="text-xs text-slate-400 mt-1">
                                            View and manage your organization departments.
                                        </p>

                                    </div>


                                    {/* Search */}

                                    <div className="relative w-full md:w-72">

                                        <Search
                                            size={17}
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
                                            placeholder="Search departments..."
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* Total Bar */}

                            <div className="px-5 sm:px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">

                                <p className="text-xs font-semibold text-slate-500">

                                    Showing{" "}

                                    <span className="text-slate-800">
                                        {filteredDepartments.length}
                                    </span>{" "}

                                    of{" "}

                                    <span className="text-slate-800">
                                        {departments.length}
                                    </span>{" "}

                                    departments

                                </p>


                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">

                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />

                                    Active

                                </span>

                            </div>


                            {/* =================================================
                                LOADING
                            ================================================= */}

                            {loading && (

                                <div className="p-12 text-center">

                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-4">

                                        <RefreshCw
                                            size={22}
                                            className="animate-spin"
                                        />

                                    </div>

                                    <p className="text-sm font-semibold text-slate-700">
                                        Loading departments...
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Please wait while we fetch your department directory.
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                EMPTY STATE
                            ================================================= */}

                            {!loading &&
                                filteredDepartments.length === 0 && (

                                    <div className="p-12 sm:p-16 text-center">

                                        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">

                                            <Building2 size={28} />

                                        </div>


                                        <h3 className="text-base font-bold text-slate-700">

                                            {searchQuery
                                                ? "No departments found"
                                                : "No departments yet"}

                                        </h3>


                                        <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">

                                            {searchQuery
                                                ? "Try another department name or clear your search."
                                                : "Create your first department to start organizing your employees."}

                                        </p>


                                        {!searchQuery && (

                                            <button
                                                onClick={handleCreateClick}
                                                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition"
                                            >

                                                <Plus size={16} />

                                                Create Department

                                            </button>

                                        )}

                                    </div>

                                )}


                            {/* =================================================
                                DEPARTMENT LIST
                            ================================================= */}

                            {!loading &&
                                filteredDepartments.length > 0 && (

                                    <div className="p-4 sm:p-5 space-y-3">

                                        {filteredDepartments.map(
                                            (department, index) => {

                                                const style =
                                                    getDepartmentStyle(
                                                        index
                                                    );


                                                return (

                                                    <div
                                                        key={department.id}
                                                        className={`group border border-slate-200 border-l-4 ${style.border} rounded-2xl p-4 sm:p-5 hover:shadow-md hover:border-slate-300 transition bg-white`}
                                                    >

                                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">


                                                            {/* Department Icon */}

                                                            <div
                                                                className={`w-12 h-12 rounded-xl ${style.icon} flex items-center justify-center shrink-0`}
                                                            >

                                                                <Building2
                                                                    size={22}
                                                                />

                                                            </div>


                                                            {/* Department Details */}

                                                            <div className="flex-1 min-w-0">

                                                                <div className="flex flex-wrap items-center gap-2">

                                                                    <h3 className="text-base sm:text-lg font-bold text-slate-800 break-words">

                                                                        {
                                                                            department.department_name
                                                                        }

                                                                    </h3>


                                                                    <span
                                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${style.badge}`}
                                                                    >

                                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                                                                        Active

                                                                    </span>

                                                                </div>


                                                                <p className="text-sm text-slate-500 mt-1 break-words">

                                                                    {department.description ||
                                                                        "No description provided for this department."}

                                                                </p>


                                                                {/* Meta */}

                                                                <div className="flex flex-wrap items-center gap-4 mt-3">

                                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">

                                                                        <Users
                                                                            size={14}
                                                                            className="text-blue-500"
                                                                        />

                                                                        Employees

                                                                    </div>


                                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">

                                                                        <HashIcon />

                                                                        ID #{department.id}

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            {/* Actions */}

                                                            <div className="flex items-center gap-2 lg:self-center">


                                                                {/* Edit */}

                                                                <button
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            department
                                                                        )
                                                                    }
                                                                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-bold transition active:scale-95"
                                                                >

                                                                    <Edit2
                                                                        size={14}
                                                                    />

                                                                    Edit

                                                                </button>


                                                                {/* Delete */}

                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            department.id
                                                                        )
                                                                    }
                                                                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition active:scale-95"
                                                                >

                                                                    <Trash2
                                                                        size={14}
                                                                    />

                                                                    Delete

                                                                </button>

                                                            </div>

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                )}

                        </section>

                    </div>

                </main>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <Footer />

            </div>

        </div>
    );
}


/* ================================================================
   SMALL ID ICON
================================================================ */

function HashIcon() {

    return (

        <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded border border-slate-300 text-[8px] font-bold text-slate-400">
            #
        </span>

    );

}


export default Departments;