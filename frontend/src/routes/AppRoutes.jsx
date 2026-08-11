
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import Departments from "../pages/Departments";
import Attendance from "../pages/Attendance";
import Leave from "../pages/Leave";
import Salary from "../pages/Salary";
import Profile from "../pages/Profile";
import AdminPanel from "../pages/AdminPanel";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ================= PUBLIC ROUTES ================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* ================= PROTECTED ROUTES ================= */}

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Employees */}
                <Route
                    path="/employees"
                    element={
                        <ProtectedRoute>
                            <Employees />
                        </ProtectedRoute>
                    }
                />

                {/* Departments */}
                <Route
                    path="/departments"
                    element={
                        <ProtectedRoute>
                            <Departments />
                        </ProtectedRoute>
                    }
                />

                {/* Attendance */}
                <Route
                    path="/attendance"
                    element={
                        <ProtectedRoute>
                            <Attendance />
                        </ProtectedRoute>
                    }
                />

                {/* Leave */}
                <Route
                    path="/leave"
                    element={
                        <ProtectedRoute>
                            <Leave />
                        </ProtectedRoute>
                    }
                />

                {/* Salary */}
                <Route
                    path="/salary"
                    element={
                        <ProtectedRoute>
                            <Salary />
                        </ProtectedRoute>
                    }
                />

                {/* Profile */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Panel */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;

