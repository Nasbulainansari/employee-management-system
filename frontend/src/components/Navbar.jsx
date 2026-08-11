import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, UserCheck } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Get page title dynamically based on path
    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes("dashboard")) return "Dashboard Overview";
        if (path.includes("employees")) return "Employees Management";
        if (path.includes("departments")) return "Departments Directory";
        if (path.includes("attendance")) return "Attendance Tracker";
        if (path.includes("salary")) return "Payroll Logs";
        if (path.includes("leave")) return "Leave Management";
        if (path.includes("profile")) return "User Profile";
        return "Employee Management Portal";
    };

    return (
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {getPageTitle()}
                </h1>
                <p className="text-gray-400 text-xs mt-0.5">
                    Welcome to your organization portal.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl text-slate-700 text-sm font-semibold">
                    <UserCheck size={16} className="text-blue-500" />
                    <span>Admin Panel</span>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-2 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 hover:border-red-300 px-4 py-2 rounded-xl transition duration-150 active:scale-[0.98] text-sm font-semibold cursor-pointer"
                >
                    <LogOut size={16} />
                    <span>Log Out</span>
                </button>
            </div>
        </header>
    );
}

export default Navbar;