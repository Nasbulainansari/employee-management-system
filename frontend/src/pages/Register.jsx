import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    AlertCircle,
    Loader2,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";


function Register() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    /* ============================================================
       REGISTER
    ============================================================ */

    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        /* Password validation */

        if (password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;

        }


        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;

        }


        setLoading(true);


        try {

            const response =
                await api.post(
                    "/users/register",
                    {
                        full_name:
                            fullName.trim(),

                        email:
                            email.trim(),

                        password,
                    }
                );


            if (response.data) {

                setSuccess(
                    "Account created successfully! Redirecting to login..."
                );


                setFullName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");


                setTimeout(() => {

                    navigate("/");

                }, 1200);

            }

        } catch (err) {

            console.error(
                "Registration error:",
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
                    "Unable to create account. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">


            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />


            {/* =====================================================
                MAIN CONTAINER
            ===================================================== */}

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


                    <div className="mt-3">

                        <h1 className="text-xl font-bold text-white">
                            Employee Portal
                        </h1>

                        <p className="text-xs text-slate-500 mt-1">
                            Employee Management System
                        </p>

                    </div>


                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-6 tracking-tight">

                        Join the{" "}

                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            employee portal.
                        </span>

                    </h2>

                </div>


                {/* =================================================
                    SECURITY BADGE
                ================================================= */}

                <div className="flex justify-center mb-5">

                    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">

                        <ShieldCheck
                            size={15}
                            className="text-emerald-400"
                        />

                        <span className="text-[11px] font-medium text-slate-300">
                            Secure account registration
                        </span>

                    </div>

                </div>


                {/* =================================================
                    REGISTER CARD
                ================================================= */}

                <div className="bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden border border-slate-200">


                    {/* Gradient top */}

                    <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />


                    <div className="p-6 sm:p-7">


                        {/* Card Header */}

                        <div className="text-center mb-6">

                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600 mb-3">

                                <UserPlus
                                    size={19}
                                />

                            </div>


                            <h3 className="text-xl font-bold text-slate-800">
                                Create Account
                            </h3>


                            <p className="text-xs text-slate-500 mt-1.5">
                                Create your employee portal account
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
                            SUCCESS
                        ================================================= */}

                        {success && (

                            <div className="mb-5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">

                                <CheckCircle2
                                    size={17}
                                    className="text-emerald-500 shrink-0 mt-0.5"
                                />

                                <p className="text-xs text-emerald-700 leading-relaxed">
                                    {success}
                                </p>

                            </div>

                        )}


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={
                                handleRegister
                            }
                            className="space-y-4"
                        >


                            {/* Full Name */}

                            <div>

                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Full Name
                                </label>


                                <div className="relative">

                                    <User
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />


                                    <input
                                        type="text"
                                        required
                                        autoComplete="name"
                                        placeholder="Enter your full name"
                                        value={
                                            fullName
                                        }
                                        onChange={(e) =>
                                            setFullName(
                                                e.target.value
                                            )
                                        }
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />

                                </div>

                            </div>


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
                                        value={
                                            email
                                        }
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
                                        autoComplete="new-password"
                                        placeholder="Create a password"
                                        value={
                                            password
                                        }
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
                                    >

                                        {showPassword ? (
                                            <EyeOff
                                                size={16}
                                            />
                                        ) : (
                                            <Eye
                                                size={16}
                                            />
                                        )}

                                    </button>

                                </div>


                                <p className="text-[10px] text-slate-400 mt-1.5">
                                    Minimum 6 characters
                                </p>

                            </div>


                            {/* Confirm Password */}

                            <div>

                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Confirm Password
                                </label>


                                <div className="relative">

                                    <Lock
                                        size={17}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />


                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        required
                                        autoComplete="new-password"
                                        placeholder="Confirm your password"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
                                    >

                                        {showConfirmPassword ? (
                                            <EyeOff
                                                size={16}
                                            />
                                        ) : (
                                            <Eye
                                                size={16}
                                            />
                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* Create Account Button */}

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

                                        Creating account...
                                    </>

                                ) : (

                                    <>
                                        <UserPlus
                                            size={17}
                                        />

                                        Create Account
                                    </>

                                )}

                            </button>

                        </form>


                        {/* =================================================
                            LOGIN LINK
                        ================================================= */}

                        <div className="flex items-center gap-3 my-5">

                            <div className="flex-1 h-px bg-slate-200" />

                            <span className="text-[11px] text-slate-400">
                                Already have an account?
                            </span>

                            <div className="flex-1 h-px bg-slate-200" />

                        </div>


                        <Link
                            to="/"
                            className="w-full flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition"
                        >
                            Back to Sign In
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


export default Register;