import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
    Users,
    Building2,
    CalendarCheck,
    Landmark,
    AlertCircle,
    RefreshCw,
    UserPlus,
    ClipboardCheck,
    Wallet,
    ArrowUpRight,
    Activity,
} from "lucide-react";


function Dashboard() {
    const [stats, setStats] = useState({
        total_users: 0,
        total_departments: 0,
        total_employees: 0,
        total_attendance: 0,
        total_salary_records: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        fetchDashboardStats();
    }, []);


    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/dashboard/");

            setStats(response.data);
        } catch (err) {
            console.error(
                "Error fetching dashboard statistics:",
                err
            );

            setError(
                "Could not retrieve dashboard statistics. Ensure backend is running."
            );
        } finally {
            setLoading(false);
        }
    };


    const statCards = [
        {
            title: "Total Employees",
            value: stats.total_employees,
            description: "Active team members",
            icon: Users,
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            valueColor: "text-blue-700",
            bar: "bg-blue-500",
        },
        {
            title: "Departments",
            value: stats.total_departments,
            description: "Organization units",
            icon: Building2,
            bg: "bg-emerald-50",
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            valueColor: "text-emerald-700",
            bar: "bg-emerald-500",
        },
        {
            title: "Attendance",
            value: stats.total_attendance,
            description: "Attendance records",
            icon: CalendarCheck,
            bg: "bg-violet-50",
            iconBg: "bg-violet-100",
            iconColor: "text-violet-600",
            valueColor: "text-violet-700",
            bar: "bg-violet-500",
        },
        {
            title: "Salary Records",
            value: stats.total_salary_records,
            description: "Payroll records",
            icon: Landmark,
            bg: "bg-orange-50",
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            valueColor: "text-orange-700",
            bar: "bg-orange-500",
        },
    ];


    const quickActions = [
        {
            title: "Add Employee",
            description: "Create employee record",
            path: "/employees",
            icon: UserPlus,
            bg: "bg-blue-600",
            hover: "hover:bg-blue-700",
        },
        {
            title: "Mark Attendance",
            description: "Record today's attendance",
            path: "/attendance",
            icon: ClipboardCheck,
            bg: "bg-emerald-600",
            hover: "hover:bg-emerald-700",
        },
        {
            title: "Process Salary",
            description: "Manage payroll records",
            path: "/salary",
            icon: Wallet,
            bg: "bg-violet-600",
            hover: "hover:bg-violet-700",
        },
        {
            title: "Departments",
            description: "Manage organization teams",
            path: "/departments",
            icon: Building2,
            bg: "bg-orange-500",
            hover: "hover:bg-orange-600",
        },
    ];


    return (
        <div className="flex min-h-screen bg-slate-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1 min-w-0">

                <Navbar />

                <main className="flex-1 p-5 sm:p-6 lg:p-8">

                    {/* ================================================= */}
                    {/* Dashboard Header */}
                    {/* ================================================= */}

                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-6 sm:p-8 mb-8 shadow-xl">

                        {/* Decorative Shapes */}
                        <div className="absolute -right-16 -top-20 w-56 h-56 rounded-full bg-blue-400/10" />

                        <div className="absolute right-20 -bottom-24 w-48 h-48 rounded-full bg-indigo-400/10" />

                        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                            <div>

                                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">

                                    <Activity size={14} />

                                    Organization Overview

                                </div>

                                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                    Welcome back! 👋
                                </h1>

                                <p className="text-blue-100/80 mt-2 max-w-xl text-sm sm:text-base">
                                    Here's a quick overview of your employee
                                    management system and organization activity.
                                </p>

                            </div>

                            <button
                                onClick={fetchDashboardStats}
                                disabled={loading}
                                className="self-start lg:self-center inline-flex items-center justify-center gap-2 bg-white text-slate-800 hover:bg-blue-50 px-5 py-3 rounded-xl font-semibold text-sm shadow-lg transition active:scale-95 disabled:opacity-60"
                            >

                                <RefreshCw
                                    size={17}
                                    className={
                                        loading
                                            ? "animate-spin"
                                            : ""
                                    }
                                />

                                Refresh

                            </button>

                        </div>

                    </section>


                    {/* ================================================= */}
                    {/* Error Message */}
                    {/* ================================================= */}

                    {error && (
                        <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-2xl">

                            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">

                                <AlertCircle
                                    size={19}
                                    className="text-amber-600"
                                />

                            </div>

                            <p className="text-sm font-medium">
                                {error}
                            </p>

                        </div>
                    )}


                    {/* ================================================= */}
                    {/* Statistics Cards */}
                    {/* ================================================= */}

                    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

                        {statCards.map((card) => {

                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.title}
                                    className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
                                >

                                    {/* Top Color Line */}
                                    <div
                                        className={`absolute top-0 left-0 right-0 h-1 ${card.bar}`}
                                    />

                                    <div className="flex items-start justify-between gap-4">

                                        <div>

                                            <p className="text-sm font-semibold text-slate-500">
                                                {card.title}
                                            </p>

                                            <h2
                                                className={`text-4xl font-extrabold mt-3 tracking-tight ${card.valueColor}`}
                                            >
                                                {loading
                                                    ? "—"
                                                    : card.value}
                                            </h2>

                                            <p className="text-xs text-slate-400 mt-2">
                                                {card.description}
                                            </p>

                                        </div>

                                        <div
                                            className={`w-12 h-12 rounded-2xl ${card.iconBg} ${card.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                        >

                                            <Icon
                                                size={23}
                                                strokeWidth={2.2}
                                            />

                                        </div>

                                    </div>

                                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">

                                        <span
                                            className={`text-xs font-semibold ${card.iconColor}`}
                                        >
                                            View overview
                                        </span>

                                        <div
                                            className={`w-7 h-7 rounded-full ${card.bg} ${card.iconColor} flex items-center justify-center`}
                                        >

                                            <ArrowUpRight size={14} />

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </section>


                    {/* ================================================= */}
                    {/* Organization Overview */}
                    {/* ================================================= */}

                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">

                        <div className="p-6 border-b border-slate-100">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-lg font-bold text-slate-800">
                                        Organization Overview
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Current system statistics
                                    </p>

                                </div>

                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

                                    <Activity size={19} />

                                </div>

                            </div>

                        </div>


                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Employees */}
                            <div>

                                <div className="flex justify-between mb-2">

                                    <span className="text-sm font-semibold text-slate-700">
                                        Employees
                                    </span>

                                    <span className="text-sm font-bold text-blue-600">
                                        {stats.total_employees}
                                    </span>

                                </div>

                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                                        style={{
                                            width: `${Math.min(
                                                stats.total_employees * 10,
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>

                            </div>


                            {/* Departments */}
                            <div>

                                <div className="flex justify-between mb-2">

                                    <span className="text-sm font-semibold text-slate-700">
                                        Departments
                                    </span>

                                    <span className="text-sm font-bold text-emerald-600">
                                        {stats.total_departments}
                                    </span>

                                </div>

                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                                        style={{
                                            width: `${Math.min(
                                                stats.total_departments * 10,
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>

                            </div>


                            {/* Attendance */}
                            <div>

                                <div className="flex justify-between mb-2">

                                    <span className="text-sm font-semibold text-slate-700">
                                        Attendance Records
                                    </span>

                                    <span className="text-sm font-bold text-violet-600">
                                        {stats.total_attendance}
                                    </span>

                                </div>

                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-700"
                                        style={{
                                            width: `${Math.min(
                                                stats.total_attendance * 10,
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>

                            </div>


                            {/* Salary */}
                            <div>

                                <div className="flex justify-between mb-2">

                                    <span className="text-sm font-semibold text-slate-700">
                                        Salary Records
                                    </span>

                                    <span className="text-sm font-bold text-orange-600">
                                        {stats.total_salary_records}
                                    </span>

                                </div>

                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700"
                                        style={{
                                            width: `${Math.min(
                                                stats.total_salary_records * 10,
                                                100
                                            )}%`,
                                        }}
                                    />

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ================================================= */}
                    {/* Quick Actions */}
                    {/* ================================================= */}

                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">

                        <div className="mb-6">

                            <h2 className="text-lg font-bold text-slate-800">
                                Quick Actions
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Frequently used management operations
                            </p>

                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                            {quickActions.map((action) => {

                                const Icon = action.icon;

                                return (
                                    <Link
                                        key={action.title}
                                        to={action.path}
                                        className={`group flex items-center gap-4 p-4 rounded-2xl text-white ${action.bg} ${action.hover} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
                                    >

                                        <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center shrink-0">

                                            <Icon size={21} />

                                        </div>

                                        <div className="flex-1 min-w-0">

                                            <p className="font-bold text-sm">
                                                {action.title}
                                            </p>

                                            <p className="text-xs text-white/70 mt-1 truncate">
                                                {action.description}
                                            </p>

                                        </div>

                                        <ArrowUpRight
                                            size={17}
                                            className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition"
                                        />

                                    </Link>
                                );
                            })}

                        </div>

                    </section>

                </main>


                <Footer />

            </div>

        </div>
    );
}


export default Dashboard;