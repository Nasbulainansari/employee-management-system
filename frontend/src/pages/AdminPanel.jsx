
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Building2,
    CalendarCheck,
    Wallet,
    FileText,
    RefreshCw,
    UserPlus,
    Plus,
    ArrowRight,
    Settings,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

function AdminPanel() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [salary, setSalary] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAdminData = async () => {
        try {
            setLoading(true);
            setError("");

            const results = await Promise.allSettled([
                api.get("/employees/"),
                api.get("/departments/"),
                api.get("/attendance/"),
                api.get("/salary/"),
                api.get("/leave/"),
            ]);

            const [
                employeesResult,
                departmentsResult,
                attendanceResult,
                salaryResult,
                leaveResult,
            ] = results;

            if (employeesResult.status === "fulfilled") {
                setEmployees(
                    Array.isArray(employeesResult.value.data)
                        ? employeesResult.value.data
                        : []
                );
            }

            if (departmentsResult.status === "fulfilled") {
                setDepartments(
                    Array.isArray(departmentsResult.value.data)
                        ? departmentsResult.value.data
                        : []
                );
            }

            if (attendanceResult.status === "fulfilled") {
                setAttendance(
                    Array.isArray(attendanceResult.value.data)
                        ? attendanceResult.value.data
                        : []
                );
            }

            if (salaryResult.status === "fulfilled") {
                setSalary(
                    Array.isArray(salaryResult.value.data)
                        ? salaryResult.value.data
                        : []
                );
            }

            if (leaveResult.status === "fulfilled") {
                setLeaveRequests(
                    Array.isArray(leaveResult.value.data)
                        ? leaveResult.value.data
                        : []
                );
            }

            const failedRequests = results.filter(
                (result) => result.status === "rejected"
            );

            if (failedRequests.length === results.length) {
                setError(
                    "Unable to load admin data. Please check that the backend is running."
                );
            }
        } catch (err) {
            console.error("Admin panel error:", err);

            if (err.response?.status === 401) {
                setError("Your session has expired. Please login again.");
            } else {
                setError(
                    "Failed to load admin panel data. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const getEmployeeName = (leave) => {
        if (leave.employee_name) {
            return leave.employee_name;
        }

        if (leave.employee?.name) {
            return leave.employee.name;
        }

        if (leave.employee_id) {
            return `Employee #${leave.employee_id}`;
        }

        return "Unknown Employee";
    };

    const getLeaveType = (leave) => {
        return (
            leave.leave_type ||
            leave.type ||
            leave.leaveType ||
            "Leave"
        );
    };

    const getLeaveStatus = (leave) => {
        return leave.status || "Pending";
    };

    const getStatusClass = (status) => {
        const value = String(status).toLowerCase();

        if (value === "approved") {
            return "bg-green-100 text-green-700";
        }

        if (value === "rejected") {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    return (
        <div className="flex bg-slate-50 min-h-screen">

            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">

                <Navbar />

                <main className="flex-1 p-6 md:p-8">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">

                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                                Admin Panel
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Monitor and manage your Employee Management System.
                            </p>
                        </div>

                        <button
                            onClick={loadAdminData}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-xl shadow-sm transition disabled:opacity-50"
                        >
                            <RefreshCw
                                size={17}
                                className={loading ? "animate-spin" : ""}
                            />

                            Refresh
                        </button>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Statistics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">

                        {/* Employees */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Total Employees
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {loading ? "—" : employees.length}
                                    </h2>
                                </div>

                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Users size={23} />
                                </div>

                            </div>

                        </div>

                        {/* Departments */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Departments
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {loading ? "—" : departments.length}
                                    </h2>
                                </div>

                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                                    <Building2 size={23} />
                                </div>

                            </div>

                        </div>

                        {/* Attendance */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Attendance Logs
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {loading ? "—" : attendance.length}
                                    </h2>
                                </div>

                                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                    <CalendarCheck size={23} />
                                </div>

                            </div>

                        </div>

                        {/* Salary */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Salary Records
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {loading ? "—" : salary.length}
                                    </h2>
                                </div>

                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
                                    <Wallet size={23} />
                                </div>

                            </div>

                        </div>

                        {/* Leave */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-slate-500">
                                        Leave Requests
                                    </p>

                                    <h2 className="text-3xl font-bold text-slate-800 mt-2">
                                        {loading ? "—" : leaveRequests.length}
                                    </h2>
                                </div>

                                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                    <FileText size={23} />
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-8">

                        <div className="flex items-center gap-2 mb-5">
                            <Settings size={20} className="text-blue-600" />

                            <h2 className="text-lg font-bold text-slate-800">
                                Quick Actions
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

                            <button
                                onClick={() => navigate("/employees")}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition"
                            >
                                <UserPlus size={17} />
                                Add Employee
                            </button>

                            <button
                                onClick={() => navigate("/departments")}
                                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition"
                            >
                                <Plus size={17} />
                                Department
                            </button>

                            <button
                                onClick={() => navigate("/attendance")}
                                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold text-sm transition"
                            >
                                <CalendarCheck size={17} />
                                Attendance
                            </button>

                            <button
                                onClick={() => navigate("/salary")}
                                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition"
                            >
                                <Wallet size={17} />
                                Salary
                            </button>

                            <button
                                onClick={() => navigate("/leave")}
                                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-semibold text-sm transition"
                            >
                                <FileText size={17} />
                                Leave
                            </button>

                        </div>

                    </div>

                    {/* Recent Data */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                        {/* Recent Employees */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">

                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Recent Employees
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Latest employee records
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/employees")}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                                >
                                    View All
                                    <ArrowRight size={15} />
                                </button>

                            </div>

                            <div className="overflow-x-auto">

                                {employees.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        No employees found.
                                    </div>
                                ) : (
                                    <table className="w-full text-sm">

                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                                                    Name
                                                </th>

                                                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                                                    Email
                                                </th>

                                                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                                                    Department
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {employees
                                                .slice(-5)
                                                .reverse()
                                                .map((employee) => (
                                                    <tr
                                                        key={employee.id}
                                                        className="border-t border-slate-100 hover:bg-slate-50"
                                                    >

                                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                                            {employee.name || "N/A"}
                                                        </td>

                                                        <td className="px-6 py-4 text-slate-500">
                                                            {employee.email || "N/A"}
                                                        </td>

                                                        <td className="px-6 py-4 text-slate-500">
                                                            {employee.department_name ||
                                                                employee.department?.department_name ||
                                                                (employee.department_id
                                                                    ? `Department #${employee.department_id}`
                                                                    : "N/A")}
                                                        </td>

                                                    </tr>
                                                ))}

                                        </tbody>

                                    </table>
                                )}

                            </div>

                        </div>

                        {/* Recent Leave Requests */}
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                            <div className="p-6 border-b border-slate-200 flex items-center justify-between">

                                <div>
                                    <h2 className="text-lg font-bold text-slate-800">
                                        Recent Leave Requests
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Latest employee leave applications
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/leave")}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                                >
                                    View All
                                    <ArrowRight size={15} />
                                </button>

                            </div>

                            <div className="overflow-x-auto">

                                {leaveRequests.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        No leave requests found.
                                    </div>
                                ) : (
                                    <table className="w-full text-sm">

                                        <thead className="bg-slate-50">
                                            <tr>

                                                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                                                    Employee
                                                </th>

                                                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                                                    Type
                                                </th>

                                                <th className="text-left px-6 py-3 font-semibold text-slate-600">
                                                    Status
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody>

                                            {leaveRequests
                                                .slice(-5)
                                                .reverse()
                                                .map((leave) => {

                                                    const status =
                                                        getLeaveStatus(leave);

                                                    return (
                                                        <tr
                                                            key={leave.id}
                                                            className="border-t border-slate-100 hover:bg-slate-50"
                                                        >

                                                            <td className="px-6 py-4 font-semibold text-slate-800">
                                                                {getEmployeeName(
                                                                    leave
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-4 text-slate-500">
                                                                {getLeaveType(
                                                                    leave
                                                                )}
                                                            </td>

                                                            <td className="px-6 py-4">

                                                                <span
                                                                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                                        status
                                                                    )}`}
                                                                >
                                                                    {status}
                                                                </span>

                                                            </td>

                                                        </tr>
                                                    );
                                                })}

                                        </tbody>

                                    </table>
                                )}

                            </div>

                        </div>

                    </div>

                </main>

                <Footer />

            </div>

        </div>
    );
}

export default AdminPanel;

