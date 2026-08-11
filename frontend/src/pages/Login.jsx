import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    AlertCircle,
    Loader2,
    Users,
    ShieldCheck,
} from "lucide-react";


function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/users/login",
                {
                    email: email.trim(),
                    password,
                }
            );

            if (
                response.data &&
                response.data.access_token
            ) {

                localStorage.setItem(
                    "token",
                    response.data.access_token
                );

                navigate("/dashboard");

            } else {

                setError(
                    "Login failed. No access token received."
                );

            }

        } catch (err) {

            console.error("Login error:", err);

            if (err.response?.data?.detail) {

                setError(
                    err.response.data.detail
                );

            } else {

                setError(
                    "Invalid email or password. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">


            {/* Background decoration */}

            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />


            {/* Main Container */}

            <div className="relative w-full max-w-md">


                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="text-center mb-5">


                    {/* Logo */}

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/20">

                        <span className="text-white font-extrabold text-xl">
                            EM
                        </span>

                    </div>


                    {/* Brand Name */}

                    <div className="mt-3">

                        <h1 className="text-xl font-bold text-white">
                            Employee Portal
                        </h1>

                        <p className="text-xs text-slate-500 mt-1">
                            Employee Management System
                        </p>

                    </div>


                    {/* Main Heading */}

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-6 tracking-tight">

                        Manage your{" "}

                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            workforce smarter.
                        </span>

                    </h2>

                </div>


                {/* =================================================
                    SMALL FEATURE BADGES
                ================================================= */}

                <div className="flex justify-center gap-3 mb-5">


                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">

                        <Users
                            size={15}
                            className="text-blue-400"
                        />

                        <span className="text-[11px] font-medium text-slate-300">
                            Manage Employees
                        </span>

                    </div>


                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">

                        <ShieldCheck
                            size={15}
                            className="text-indigo-400"
                        />

                        <span className="text-[11px] font-medium text-slate-300">
                            Secure Access
                        </span>

                    </div>

                </div>


                {/* =================================================
                    LOGIN CARD
                ================================================= */}

                <div className="bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden border border-slate-200">


                    {/* Top Line */}

                    <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />


                    <div className="p-6 sm:p-7">


                        {/* Login Heading */}

                        <div className="text-center mb-6">

                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 mb-3">

                                <LogIn size={19} />

                            </div>


                            <h3 className="text-xl font-bold text-slate-800">
                                Welcome Back
                            </h3>


                            <p className="text-xs text-slate-500 mt-1.5">
                                Sign in to your employee portal
                            </p>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">

                                <AlertCircle
                                    size={17}
                                    className="text-red-500 shrink-0 mt-0.5"
                                />

                                <p className="text-xs text-red-600 leading-relaxed">
                                    {error}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={handleLogin}
                            className="space-y-4"
                        >


                            {/* Email */}

                            <div>

                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Email Address
                                </label>


                                <div className="relative">

                                    <Mail
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />


                                    <input
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />

                                </div>

                            </div>


                            {/* Password */}

                            <div>

                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Password
                                </label>


                                <div className="relative">

                                    <Lock
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />


                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* Sign In Button */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-md shadow-blue-600/20 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                            >

                                {loading ? (

                                    <>
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                        Signing in...
                                    </>

                                ) : (

                                    <>
                                        <LogIn size={17} />

                                        Sign In
                                    </>

                                )}

                            </button>

                        </form>


                        {/* =================================================
                            REGISTER
                        ================================================= */}

                        <div className="flex items-center gap-3 my-5">

                            <div className="flex-1 h-px bg-slate-200" />

                            <span className="text-[11px] text-slate-400">
                                New to the portal?
                            </span>

                            <div className="flex-1 h-px bg-slate-200" />

                        </div>


                        <Link
                            to="/register"
                            className="w-full flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition"
                        >
                            Create an account
                        </Link>


                        {/* Footer */}

                        <p className="text-center text-[11px] text-slate-400 mt-5">
                            © 2026 Employee Management System
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}


export default Login;