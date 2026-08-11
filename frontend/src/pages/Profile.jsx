import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import {
    User,
    Mail,
    Shield,
    ShieldCheck,
    Hash,
    CheckCircle2,
    LockKeyhole,
    RefreshCw,
    AlertCircle,
} from "lucide-react";


function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* ============================================================
       Fetch Profile
    ============================================================ */

    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/users/profile");

            setProfile(response.data);

        } catch (err) {

            console.error(
                "Error loading profile:",
                err
            );

            setError(
                "Could not load your profile. Please make sure you are logged in."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen flex bg-slate-50">

            {/* ====================================================
                SIDEBAR
            ==================================================== */}

            <Sidebar />


            {/* ====================================================
                MAIN APPLICATION AREA
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

                                <p className="text-sm font-semibold text-blue-600 mb-1">
                                    Account
                                </p>

                                <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                                    My Profile
                                </h1>

                                <p className="text-sm text-slate-500 mt-1">
                                    View your personal and account information.
                                </p>

                            </div>


                            {/* Refresh */}

                            <button
                                onClick={fetchProfile}
                                disabled={loading}
                                className="self-start sm:self-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition shadow-sm disabled:opacity-60"
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

                        </div>


                        {/* =================================================
                            ERROR MESSAGE
                        ================================================= */}

                        {error && (

                            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">

                                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">

                                    <AlertCircle size={19} />

                                </div>


                                <div>

                                    <p className="text-sm font-bold text-red-800">
                                        Profile Error
                                    </p>

                                    <p className="text-xs text-red-600 mt-0.5">
                                        {error}
                                    </p>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            LOADING SKELETON
                        ================================================= */}

                        {loading && (

                            <div className="space-y-5">

                                {/* Hero Skeleton */}

                                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

                                    <div className="h-32 sm:h-36 bg-slate-200 animate-pulse" />

                                    <div className="p-6">

                                        <div className="flex items-center gap-5">

                                            <div className="w-24 h-24 rounded-full bg-slate-200 animate-pulse" />

                                            <div className="flex-1 space-y-3">

                                                <div className="h-7 bg-slate-200 rounded-lg w-48 animate-pulse" />

                                                <div className="h-4 bg-slate-200 rounded w-64 animate-pulse" />

                                                <div className="h-6 bg-slate-200 rounded w-24 animate-pulse" />

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* Cards Skeleton */}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                                    <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />

                                    <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />

                                </div>


                                <div className="h-28 bg-slate-200 rounded-2xl animate-pulse" />

                            </div>

                        )}


                        {/* =================================================
                            PROFILE CONTENT
                        ================================================= */}

                        {!loading && profile && (

                            <div className="space-y-5">


                                {/* =================================================
                                    PROFILE HERO
                                ================================================= */}

                                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">


                                    {/* -----------------------------------------
                                        COVER
                                    ------------------------------------------ */}

                                    <div className="relative h-32 sm:h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 overflow-hidden">


                                        {/* Decorative Circle */}

                                        <div className="absolute -right-12 -top-24 w-60 h-60 rounded-full bg-white/10" />

                                        <div className="absolute right-32 -bottom-28 w-52 h-52 rounded-full bg-white/5" />

                                        <div className="absolute -left-10 top-12 w-24 h-24 rounded-full bg-white/5" />


                                        {/* Dot Pattern */}

                                        <div
                                            className="absolute inset-0 opacity-10"
                                            style={{
                                                backgroundImage:
                                                    "radial-gradient(circle, white 1px, transparent 1px)",
                                                backgroundSize:
                                                    "20px 20px",
                                            }}
                                        />

                                    </div>


                                    {/* -----------------------------------------
                                        USER INFORMATION
                                    ------------------------------------------ */}

                                    <div className="px-5 sm:px-7 py-6">

                                        <div className="flex flex-col sm:flex-row sm:items-center gap-5">


                                            {/* =================================
                                                PROFILE AVATAR
                                            ================================= */}

                                            <div className="relative shrink-0">

                                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-1.5 shadow-lg border border-slate-100">

                                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-100 flex items-center justify-center">

                                                        <User
                                                            size={42}
                                                            className="text-blue-500"
                                                            strokeWidth={1.7}
                                                        />

                                                    </div>

                                                </div>


                                                {/* Active Dot */}

                                                <div className="absolute right-0 bottom-1 w-7 h-7 rounded-full bg-white p-1 shadow-sm">

                                                    <div className="w-full h-full rounded-full bg-emerald-500" />

                                                </div>

                                            </div>


                                            {/* =================================
                                                USER DETAILS
                                            ================================= */}

                                            <div className="min-w-0 flex-1">


                                                {/* Name + Role */}

                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">

                                                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 break-words">

                                                        {profile.full_name}

                                                    </h2>


                                                    {/* Role */}

                                                    <span className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase whitespace-nowrap">

                                                        <ShieldCheck size={13} />

                                                        {profile.role}

                                                    </span>

                                                </div>


                                                {/* Email */}

                                                <div className="flex items-start gap-2 text-sm text-slate-500 mt-2">

                                                    <Mail
                                                        size={15}
                                                        className="mt-0.5 shrink-0"
                                                    />

                                                    <span className="break-all">

                                                        {profile.email}

                                                    </span>

                                                </div>


                                                {/* User ID + Status */}

                                                <div className="flex flex-wrap items-center gap-2 mt-3">


                                                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">

                                                        <Hash size={12} />

                                                        User #{profile.id}

                                                    </span>


                                                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-semibold">

                                                        <CheckCircle2 size={12} />

                                                        Active

                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </section>


                                {/* =================================================
                                    INFORMATION GRID
                                ================================================= */}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">


                                    {/* =================================================
                                        PERSONAL INFORMATION
                                    ================================================= */}

                                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                                        {/* Header */}

                                        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

                                                <User size={19} />

                                            </div>


                                            <div>

                                                <h2 className="font-bold text-slate-800">
                                                    Personal Information
                                                </h2>

                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Basic account details
                                                </p>

                                            </div>

                                        </div>


                                        {/* Content */}

                                        <div className="p-5 space-y-4">


                                            {/* Full Name */}

                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">

                                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">

                                                    <User size={17} />

                                                </div>


                                                <div className="min-w-0">

                                                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">

                                                        Full Name

                                                    </p>

                                                    <p className="text-sm font-semibold text-slate-700 mt-1 break-words">

                                                        {profile.full_name}

                                                    </p>

                                                </div>

                                            </div>


                                            {/* Email */}

                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">

                                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">

                                                    <Mail size={17} />

                                                </div>


                                                <div className="min-w-0 flex-1">

                                                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">

                                                        Email Address

                                                    </p>

                                                    <p className="text-sm font-semibold text-slate-700 mt-1 break-all">

                                                        {profile.email}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </section>


                                    {/* =================================================
                                        ACCOUNT OVERVIEW
                                    ================================================= */}

                                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                                        {/* Header */}

                                        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">

                                                <Shield size={19} />

                                            </div>


                                            <div>

                                                <h2 className="font-bold text-slate-800">
                                                    Account Overview
                                                </h2>

                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Status and access information
                                                </p>

                                            </div>

                                        </div>


                                        {/* Content */}

                                        <div className="p-5 space-y-4">


                                            {/* Status */}

                                            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">

                                                <div className="flex items-center gap-3 min-w-0">

                                                    <div className="w-10 h-10 rounded-lg bg-white text-emerald-600 flex items-center justify-center shrink-0">

                                                        <CheckCircle2 size={18} />

                                                    </div>


                                                    <div>

                                                        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-600">

                                                            Account Status

                                                        </p>

                                                        <p className="text-sm font-bold text-emerald-800 mt-1">

                                                            Active

                                                        </p>

                                                    </div>

                                                </div>


                                                <span className="shrink-0 text-xs font-bold text-emerald-600 bg-white px-2.5 py-1 rounded-full">

                                                    Active

                                                </span>

                                            </div>


                                            {/* Role */}

                                            <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-violet-50 border border-violet-100">

                                                <div className="flex items-center gap-3 min-w-0">

                                                    <div className="w-10 h-10 rounded-lg bg-white text-violet-600 flex items-center justify-center shrink-0">

                                                        <Shield size={18} />

                                                    </div>


                                                    <div>

                                                        <p className="text-[11px] font-bold uppercase tracking-wide text-violet-600">

                                                            Account Role

                                                        </p>

                                                        <p className="text-sm font-bold text-violet-800 mt-1 capitalize">

                                                            {profile.role}

                                                        </p>

                                                    </div>

                                                </div>


                                                <span className="shrink-0 text-xs font-bold text-violet-600 bg-white px-2.5 py-1 rounded-full capitalize">

                                                    {profile.role}

                                                </span>

                                            </div>


                                            {/* User ID */}

                                            <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">

                                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 text-slate-500 flex items-center justify-center shrink-0">

                                                    <Hash size={18} />

                                                </div>


                                                <div>

                                                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">

                                                        User ID

                                                    </p>

                                                    <p className="text-sm font-bold text-slate-700 mt-1">

                                                        #{profile.id}

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </section>

                                </div>


                                {/* =================================================
                                    SECURITY CARD
                                ================================================= */}

                                <section className="relative overflow-hidden bg-slate-900 rounded-2xl p-5 sm:p-6 shadow-md">


                                    {/* Background decoration */}

                                    <div className="absolute -right-16 -top-20 w-48 h-48 rounded-full bg-blue-500/10" />

                                    <div className="absolute -left-16 -bottom-20 w-40 h-40 rounded-full bg-indigo-500/10" />


                                    <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">


                                        {/* Security Info */}

                                        <div className="flex items-center gap-3.5">

                                            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 text-blue-300 flex items-center justify-center shrink-0">

                                                <LockKeyhole size={20} />

                                            </div>


                                            <div>

                                                <h2 className="text-sm font-bold text-white">

                                                    Account Security

                                                </h2>

                                                <p className="text-xs text-slate-400 mt-1">

                                                    Your account is protected with secure authentication.

                                                </p>

                                            </div>

                                        </div>


                                        {/* Protected */}

                                        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">

                                            <CheckCircle2 size={14} />

                                            Protected

                                        </div>

                                    </div>

                                </section>

                            </div>

                        )}

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


export default Profile;