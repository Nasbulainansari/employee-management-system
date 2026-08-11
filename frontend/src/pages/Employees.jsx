import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";
import api from "../services/api";

import {
    Plus,
    Users,
    Search,
    RefreshCw,
    Building2,
    UserCheck,
    UserPlus,
    Filter,
    X,
} from "lucide-react";


function Employees() {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDeptId, setSelectedDeptId] = useState("");

    const [editEmployee, setEditEmployee] = useState(null);
    const [showForm, setShowForm] = useState(false);


    useEffect(() => {
        loadData();
    }, []);


    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [empRes, deptRes] = await Promise.all([
                api.get("/employees/"),
                api.get("/departments/"),
            ]);

            setEmployees(empRes.data);
            setDepartments(deptRes.data);

        } catch (err) {
            console.error(
                "Error loading employees/departments data:",
                err
            );

            setError(
                "Failed to fetch employee directories. Ensure backend is running."
            );

        } finally {
            setLoading(false);
        }
    };


    const handleDeleteEmployee = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this employee?"
            )
        ) {
            return;
        }

        try {
            await api.delete(`/employees/${id}`);

            alert("Employee deleted successfully!");

            loadData();

            if (editEmployee?.id === id) {
                setEditEmployee(null);
                setShowForm(false);
            }

        } catch (err) {
            console.error(
                "Delete employee failed:",
                err
            );

            alert(
                "Could not delete employee record."
            );
        }
    };


    const handleEditClick = (employee) => {
        setEditEmployee(employee);
        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    const handleAddEmployee = () => {
        setEditEmployee(null);
        setShowForm(true);

        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }, 100);
    };


    const handleCloseForm = () => {
        setEditEmployee(null);
        setShowForm(false);
    };


    const clearSearch = () => {
        setSearchQuery("");
        setSelectedDeptId("");
    };


    const filteredEmployees = employees.filter((emp) => {
        const name = emp.name?.toLowerCase() || "";
        const email = emp.email?.toLowerCase() || "";
        const phone = emp.phone?.toLowerCase() || "";

        const query = searchQuery.toLowerCase();

        const matchesSearch =
            name.includes(query) ||
            email.includes(query) ||
            phone.includes(query);

        const matchesDept =
            selectedDeptId === "" ||
            emp.department_id === Number(selectedDeptId);

        return matchesSearch && matchesDept;
    });


    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* ===================================================== */}
            {/* Sidebar */}
            {/* ===================================================== */}

            <Sidebar />


            {/* ===================================================== */}
            {/* Main Content */}
            {/* ===================================================== */}

            <div className="flex-1 flex flex-col min-w-0">

                <Navbar />


                <main className="flex-1 p-5 sm:p-6 lg:p-8">


                    {/* ================================================= */}
                    {/* Page Header */}
                    {/* ================================================= */}

                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-6 sm:p-8 mb-8 shadow-xl">

                        {/* Decorative shapes */}

                        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10" />

                        <div className="absolute right-32 -bottom-32 w-56 h-56 rounded-full bg-white/5" />


                        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                            <div>

                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">

                                    <Users size={14} />

                                    Employee Management

                                </div>


                                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">

                                    Employees Directory

                                </h1>


                                <p className="text-blue-100/80 mt-2 max-w-2xl text-sm sm:text-base">

                                    Add, update, search, and manage your
                                    organization's employee records.

                                </p>

                            </div>


                            <button
                                onClick={
                                    showForm
                                        ? handleCloseForm
                                        : handleAddEmployee
                                }
                                className="self-start lg:self-center inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition active:scale-95"
                            >

                                {showForm ? (
                                    <>
                                        <X size={18} />

                                        Close Form
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} />

                                        Add Employee
                                    </>
                                )}

                            </button>

                        </div>

                    </section>


                    {/* ================================================= */}
                    {/* Error */}
                    {/* ================================================= */}

                    {error && (

                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3">

                            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">

                                <X size={18} />

                            </div>

                            <p className="text-sm font-medium">
                                {error}
                            </p>

                        </div>

                    )}


                    {/* ================================================= */}
                    {/* Summary Cards */}
                    {/* ================================================= */}

                    <section className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">


                        {/* Total Employees */}

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-semibold text-slate-500">
                                        Total Employees
                                    </p>

                                    <h2 className="text-3xl font-extrabold text-blue-700 mt-2">
                                        {loading ? "—" : employees.length}
                                    </h2>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Employee records
                                    </p>

                                </div>


                                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                    <Users size={23} />

                                </div>

                            </div>

                        </div>


                        {/* Active Employees */}

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-semibold text-slate-500">
                                        Employee Directory
                                    </p>

                                    <h2 className="text-3xl font-extrabold text-emerald-600 mt-2">
                                        {loading
                                            ? "—"
                                            : filteredEmployees.length}
                                    </h2>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Matching records
                                    </p>

                                </div>


                                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">

                                    <UserCheck size={23} />

                                </div>

                            </div>

                        </div>


                        {/* Departments */}

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-semibold text-slate-500">
                                        Departments
                                    </p>

                                    <h2 className="text-3xl font-extrabold text-violet-600 mt-2">
                                        {loading ? "—" : departments.length}
                                    </h2>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Available departments
                                    </p>

                                </div>


                                <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">

                                    <Building2 size={23} />

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ================================================= */}
                    {/* Add / Edit Employee Form */}
                    {/* ================================================= */}

                    {showForm && (

                        <section className="mb-8">

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-1">

                                <EmployeeForm
                                    loadEmployees={loadData}
                                    editEmployee={editEmployee}
                                    setEditEmployee={(value) => {

                                        setEditEmployee(value);

                                        if (value === null) {
                                            setShowForm(false);
                                        }

                                    }}
                                />

                            </div>

                        </section>

                    )}


                    {/* ================================================= */}
                    {/* Employee Directory */}
                    {/* ================================================= */}

                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                        {/* Section Header */}

                        <div className="p-6 border-b border-slate-100">

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                                <div>

                                    <h2 className="text-xl font-bold text-slate-800">
                                        Employee Directory
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Browse and manage all employee records.
                                    </p>

                                </div>


                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />

                                    {filteredEmployees.length} records found

                                </div>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* Search & Filters */}
                        {/* ================================================= */}

                        <div className="p-5 bg-slate-50/70 border-b border-slate-100">

                            <div className="flex flex-col lg:flex-row gap-3">


                                {/* Search */}

                                <div className="relative flex-1">

                                    <Search
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={19}
                                    />

                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or phone..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm transition"
                                    />


                                    {searchQuery && (

                                        <button
                                            onClick={() =>
                                                setSearchQuery("")
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                        >

                                            <X size={17} />

                                        </button>

                                    )}

                                </div>


                                {/* Department Filter */}

                                <div className="relative">

                                    <Filter
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                        size={17}
                                    />

                                    <select
                                        value={selectedDeptId}
                                        onChange={(e) =>
                                            setSelectedDeptId(e.target.value)
                                        }
                                        className="w-full lg:w-56 appearance-none bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition cursor-pointer"
                                    >

                                        <option value="">
                                            All Departments
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


                                {/* Refresh */}

                                <button
                                    onClick={loadData}
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-semibold text-sm transition active:scale-95 disabled:opacity-60"
                                    title="Refresh employee list"
                                >

                                    <RefreshCw
                                        size={18}
                                        className={
                                            loading
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    <span className="lg:hidden">
                                        Refresh
                                    </span>

                                </button>


                                {/* Clear Filters */}

                                {(searchQuery || selectedDeptId) && (

                                    <button
                                        onClick={clearSearch}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 font-semibold text-sm transition"
                                    >

                                        <X size={17} />

                                        Clear

                                    </button>

                                )}

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* Employee Table */}
                        {/* ================================================= */}

                        <div className="overflow-x-auto">


                            {loading ? (

                                <div className="p-16 text-center">

                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-4">

                                        <RefreshCw
                                            size={23}
                                            className="text-blue-600 animate-spin"
                                        />

                                    </div>

                                    <p className="text-sm font-semibold text-slate-600">
                                        Loading employees...
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Please wait while we retrieve the employee directory.
                                    </p>

                                </div>

                            ) : filteredEmployees.length === 0 ? (

                                <div className="p-16 text-center">

                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">

                                        <UserPlus size={28} />

                                    </div>

                                    <h3 className="text-base font-bold text-slate-700">
                                        No employees found
                                    </h3>

                                    <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                                        No employee records match your current
                                        search or department filter.
                                    </p>


                                    {(searchQuery || selectedDeptId) ? (

                                        <button
                                            onClick={clearSearch}
                                            className="mt-5 inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                                        >

                                            <X size={16} />

                                            Clear Filters

                                        </button>

                                    ) : (

                                        <button
                                            onClick={handleAddEmployee}
                                            className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition"
                                        >

                                            <Plus size={16} />

                                            Add First Employee

                                        </button>

                                    )}

                                </div>

                            ) : (

                                <EmployeeTable
                                    employees={filteredEmployees}
                                    departments={departments}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteEmployee}
                                    loadEmployees={loadData}
                                />

                            )}

                        </div>

                    </section>

                </main>


                <Footer />

            </div>

        </div>
    );
}


export default Employees;