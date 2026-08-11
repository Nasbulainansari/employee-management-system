import { Link, useNavigate, useLocation } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    Building2,
    CalendarRange,
    Landmark,
    User,
    LogOut,
    FileText,
    Settings
} from "lucide-react";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const navItems = [
        {
            path: "/dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            path: "/employees",
            label: "Employees",
            icon: Users
        },
        {
            path: "/departments",
            label: "Departments",
            icon: Building2
        },
        {
            path: "/attendance",
            label: "Attendance",
            icon: CalendarRange
        },
        {
            path: "/salary",
            label: "Salary",
            icon: Landmark
        },
        {
            path: "/leave",
            label: "Leave Requests",
            icon: FileText
        },
        {
            path: "/profile",
            label: "My Profile",
            icon: User
        }
    ];

    const isAdminActive = location.pathname === "/admin";

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen flex flex-col justify-between p-6">

            {/* Logo / Header */}
            <div>

                <div className="flex items-center gap-3 mb-10 px-2">

                    <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-lg leading-none shadow-md shadow-blue-500/20">
                        EM
                    </div>

                    <span className="text-xl font-bold text-white tracking-wider">
                        Portal
                    </span>

                </div>

                {/* Navigation */}
                <nav className="space-y-1.5">

                    {navItems.map((item) => {

                        const Icon = item.icon;

                        const isActive =
                            location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition duration-150 font-medium text-sm ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10"
                                        : "hover:bg-slate-800/60 hover:text-slate-100"
                                }`}
                            >

                                <Icon
                                    size={18}
                                    className={
                                        isActive
                                            ? "text-white"
                                            : "text-slate-400"
                                    }
                                />

                                <span>
                                    {item.label}
                                </span>

                            </Link>
                        );
                    })}

                </nav>

            </div>

            {/* Bottom Section */}
            <div className="pt-6 border-t border-slate-800 space-y-3">

                {/* Admin Panel */}
                <Link
                    to="/admin"
                    className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl w-full transition font-semibold text-sm border ${
                        isAdminActive
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/10"
                            : "bg-slate-800 text-slate-300 border-slate-700/50 hover:bg-slate-700 hover:text-white"
                    }`}
                >

                    <Settings size={16} />

                    <span>
                        Admin Panel
                    </span>

                </Link>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/30 border border-slate-700/50 text-slate-300 px-4 py-3 rounded-xl w-full transition font-semibold text-sm cursor-pointer"
                >

                    <LogOut size={16} />

                    <span>
                        Log Out
                    </span>

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;