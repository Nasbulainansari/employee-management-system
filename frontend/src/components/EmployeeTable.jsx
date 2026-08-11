import { useRef, useState } from "react";
import api from "../services/api";

import {
    Edit2,
    Trash2,
    FileText,
    Upload,
    User,
    Eye,
    Mail,
    Phone,
    CalendarDays,
    IndianRupee,
    Building2,
    Loader2,
} from "lucide-react";


function EmployeeTable({
    employees,
    departments,
    onEdit,
    onDelete,
    loadEmployees,
}) {

    const fileInputRefs = useRef({});
    const resumeInputRefs = useRef({});

    const [uploadingId, setUploadingId] = useState(null);


    /* ============================================================
       Department Name
       ============================================================ */

    const getDepartmentName = (deptId) => {

        const dept = departments.find(
            (d) => d.id === deptId
        );

        return dept
            ? dept.department_name
            : `Department #${deptId}`;

    };


    /* ============================================================
       Media URL
       ============================================================ */

    const getMediaUrl = (path) => {

        if (!path) return null;

        const cleanPath = path.replace(
            /^app[/\\]/,
            ""
        );

        return `http://127.0.0.1:8000/${cleanPath.replace(
            /\\/g,
            "/"
        )}`;

    };


    /* ============================================================
       Profile Upload
       ============================================================ */

    const handleProfileUpload = async (
        employeeId,
        file
    ) => {

        if (!file) return;


        const formData = new FormData();

        formData.append(
            "file",
            file
        );


        try {

            setUploadingId(
                `profile-${employeeId}`
            );


            await api.post(
                `/employees/upload-profile/${employeeId}`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );


            alert(
                "Profile image uploaded successfully!"
            );


            await loadEmployees();


        } catch (error) {

            console.error(
                "Profile upload failed:",
                error
            );


            alert(
                error.response?.data?.detail ||
                "Profile upload failed."
            );

        } finally {

            setUploadingId(null);

        }

    };


    /* ============================================================
       Resume Upload
       ============================================================ */

    const handleResumeUpload = async (
        employeeId,
        file
    ) => {

        if (!file) return;


        const formData = new FormData();

        formData.append(
            "file",
            file
        );


        try {

            setUploadingId(
                `resume-${employeeId}`
            );


            await api.post(
                `/employees/upload-resume/${employeeId}`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );


            alert(
                "Resume PDF uploaded successfully!"
            );


            await loadEmployees();


        } catch (error) {

            console.error(
                "Resume upload failed:",
                error
            );


            alert(
                error.response?.data?.detail ||
                "Resume upload failed."
            );

        } finally {

            setUploadingId(null);

        }

    };


    /* ============================================================
       Trigger Profile Input
       ============================================================ */

    const triggerProfileInput = (id) => {

        fileInputRefs.current[id]?.click();

    };


    /* ============================================================
       Trigger Resume Input
       ============================================================ */

    const triggerResumeInput = (id) => {

        resumeInputRefs.current[id]?.click();

    };


    /* ============================================================
       Format Salary
       ============================================================ */

    const formatSalary = (salary) => {

        if (
            salary === null ||
            salary === undefined ||
            salary === ""
        ) {
            return "—";
        }


        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(Number(salary));

    };


    /* ============================================================
       Format Date
       ============================================================ */

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "—";
        }


        const date = new Date(dateValue);


        if (Number.isNaN(date.getTime())) {
            return "—";
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    return (

        <div className="w-full">


            {/* ================================================= */}
            {/* Desktop Table */}
            {/* ================================================= */}

            <div className="hidden xl:block overflow-x-auto">

                <table className="w-full text-left border-collapse">


                    {/* ================================================= */}
                    {/* Table Header */}
                    {/* ================================================= */}

                    <thead>

                        <tr className="bg-slate-50 border-b border-slate-200">

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Employee
                            </th>

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Contact
                            </th>

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Department
                            </th>

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Salary
                            </th>

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Joining Date
                            </th>

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                Resume
                            </th>

                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                                Actions
                            </th>

                        </tr>

                    </thead>


                    {/* ================================================= */}
                    {/* Table Body */}
                    {/* ================================================= */}

                    <tbody className="divide-y divide-slate-100">


                        {employees.map((emp) => (

                            <tr
                                key={emp.id}
                                className="group hover:bg-blue-50/40 transition duration-200"
                            >


                                {/* ===================================== */}
                                {/* Employee */}
                                {/* ===================================== */}

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-3">


                                        {/* Avatar */}

                                        <div
                                            onClick={() =>
                                                triggerProfileInput(
                                                    emp.id
                                                )
                                            }
                                            className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center overflow-hidden cursor-pointer group/avatar shrink-0"
                                            title="Click to upload profile photo"
                                        >

                                            {emp.profile_image ? (

                                                <img
                                                    src={getMediaUrl(
                                                        emp.profile_image
                                                    )}
                                                    alt={emp.name}
                                                    className="w-full h-full object-cover"
                                                />

                                            ) : (

                                                <User
                                                    size={20}
                                                    className="text-blue-500"
                                                />

                                            )}


                                            {/* Upload Overlay */}

                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition">

                                                {uploadingId ===
                                                `profile-${emp.id}` ? (

                                                    <Loader2
                                                        size={15}
                                                        className="text-white animate-spin"
                                                    />

                                                ) : (

                                                    <Upload
                                                        size={15}
                                                        className="text-white"
                                                    />

                                                )}

                                            </div>

                                        </div>


                                        {/* Hidden Profile Input */}

                                        <input
                                            type="file"
                                            ref={(el) =>
                                                (fileInputRefs.current[
                                                    emp.id
                                                ] = el)
                                            }
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {

                                                handleProfileUpload(
                                                    emp.id,
                                                    e.target.files?.[0]
                                                );

                                                e.target.value = "";

                                            }}
                                        />


                                        {/* Employee Name */}

                                        <div className="min-w-0">

                                            <p className="font-bold text-slate-800 truncate max-w-[170px]">

                                                {emp.name}

                                            </p>

                                            <p className="text-xs text-slate-400 mt-0.5">

                                                Employee #{emp.id}

                                            </p>

                                        </div>

                                    </div>

                                </td>


                                {/* ===================================== */}
                                {/* Contact */}
                                {/* ===================================== */}

                                <td className="px-6 py-5">

                                    <div className="space-y-1.5">


                                        <div className="flex items-center gap-2 text-sm text-slate-700">

                                            <Mail
                                                size={14}
                                                className="text-slate-400 shrink-0"
                                            />

                                            <span className="truncate max-w-[190px]">
                                                {emp.email}
                                            </span>

                                        </div>


                                        <div className="flex items-center gap-2 text-xs text-slate-400">

                                            <Phone
                                                size={13}
                                                className="shrink-0"
                                            />

                                            <span>
                                                {emp.phone}
                                            </span>

                                        </div>

                                    </div>

                                </td>


                                {/* ===================================== */}
                                {/* Department */}
                                {/* ===================================== */}

                                <td className="px-6 py-5">

                                    <span className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-100 text-violet-700 px-3 py-1.5 rounded-lg text-xs font-bold">

                                        <Building2
                                            size={13}
                                        />

                                        {getDepartmentName(
                                            emp.department_id
                                        )}

                                    </span>

                                </td>


                                {/* ===================================== */}
                                {/* Salary */}
                                {/* ===================================== */}

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-1 text-emerald-700 font-bold">

                                        <IndianRupee
                                            size={15}
                                        />

                                        <span>
                                            {Number(
                                                emp.salary || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </span>

                                    </div>

                                </td>


                                {/* ===================================== */}
                                {/* Joining Date */}
                                {/* ===================================== */}

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-2 text-sm text-slate-600">

                                        <CalendarDays
                                            size={15}
                                            className="text-blue-500"
                                        />

                                        {formatDate(
                                            emp.joining_date
                                        )}

                                    </div>

                                </td>


                                {/* ===================================== */}
                                {/* Resume */}
                                {/* ===================================== */}

                                <td className="px-6 py-5">

                                    <input
                                        type="file"
                                        ref={(el) =>
                                            (resumeInputRefs.current[
                                                emp.id
                                            ] = el)
                                        }
                                        className="hidden"
                                        accept=".pdf,application/pdf"
                                        onChange={(e) => {

                                            handleResumeUpload(
                                                emp.id,
                                                e.target.files?.[0]
                                            );

                                            e.target.value = "";

                                        }}
                                    />


                                    {emp.resume ? (

                                        <div className="flex items-center gap-2">

                                            <a
                                                href={getMediaUrl(
                                                    emp.resume
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                            >

                                                <Eye size={13} />

                                                View

                                            </a>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    triggerResumeInput(
                                                        emp.id
                                                    )
                                                }
                                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
                                                title="Update resume"
                                            >

                                                {uploadingId ===
                                                `resume-${emp.id}` ? (

                                                    <Loader2
                                                        size={14}
                                                        className="animate-spin"
                                                    />

                                                ) : (

                                                    <Upload
                                                        size={14}
                                                    />

                                                )}

                                            </button>

                                        </div>

                                    ) : (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                triggerResumeInput(
                                                    emp.id
                                                )
                                            }
                                            disabled={
                                                uploadingId ===
                                                `resume-${emp.id}`
                                            }
                                            className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50"
                                        >

                                            {uploadingId ===
                                            `resume-${emp.id}` ? (

                                                <Loader2
                                                    size={13}
                                                    className="animate-spin"
                                                />

                                            ) : (

                                                <FileText
                                                    size={13}
                                                />

                                            )}

                                            {uploadingId ===
                                            `resume-${emp.id}`
                                                ? "Uploading..."
                                                : "Upload PDF"}

                                        </button>

                                    )}

                                </td>


                                {/* ===================================== */}
                                {/* Actions */}
                                {/* ===================================== */}

                                <td className="px-6 py-5">

                                    <div className="flex items-center justify-end gap-2">


                                        <button
                                            type="button"
                                            onClick={() =>
                                                onEdit(emp)
                                            }
                                            className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-3 py-2 rounded-lg text-xs font-bold transition active:scale-95"
                                        >

                                            <Edit2 size={14} />

                                            Edit

                                        </button>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                onDelete(emp.id)
                                            }
                                            className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-bold transition active:scale-95"
                                        >

                                            <Trash2 size={14} />

                                            Delete

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>


            {/* ================================================= */}
            {/* Tablet / Mobile Cards */}
            {/* ================================================= */}

            <div className="xl:hidden divide-y divide-slate-100">

                {employees.map((emp) => (

                    <div
                        key={emp.id}
                        className="p-5 hover:bg-slate-50 transition"
                    >


                        {/* Employee Header */}

                        <div className="flex items-start justify-between gap-4">


                            <div className="flex items-center gap-3 min-w-0">


                                <div
                                    onClick={() =>
                                        triggerProfileInput(
                                            emp.id
                                        )
                                    }
                                    className="relative w-12 h-12 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden cursor-pointer shrink-0"
                                >

                                    {emp.profile_image ? (

                                        <img
                                            src={getMediaUrl(
                                                emp.profile_image
                                            )}
                                            alt={emp.name}
                                            className="w-full h-full object-cover"
                                        />

                                    ) : (

                                        <User
                                            size={21}
                                            className="text-blue-500"
                                        />

                                    )}

                                </div>


                                <div className="min-w-0">

                                    <h3 className="font-bold text-slate-800 truncate">

                                        {emp.name}

                                    </h3>

                                    <p className="text-xs text-slate-400">

                                        Employee #{emp.id}

                                    </p>

                                </div>

                            </div>


                            {/* Department */}

                            <span className="hidden sm:inline-flex items-center gap-1.5 bg-violet-50 border border-violet-100 text-violet-700 px-2.5 py-1 rounded-lg text-xs font-bold">

                                <Building2 size={12} />

                                {getDepartmentName(
                                    emp.department_id
                                )}

                            </span>

                        </div>


                        {/* Contact */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">


                            <div className="bg-slate-50 rounded-xl p-3">

                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">

                                    <Mail size={13} />

                                    Email

                                </div>

                                <p className="text-sm font-semibold text-slate-700 truncate">

                                    {emp.email}

                                </p>

                            </div>


                            <div className="bg-slate-50 rounded-xl p-3">

                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">

                                    <Phone size={13} />

                                    Phone

                                </div>

                                <p className="text-sm font-semibold text-slate-700">

                                    {emp.phone}

                                </p>

                            </div>


                            <div className="bg-emerald-50 rounded-xl p-3">

                                <div className="flex items-center gap-2 text-xs text-emerald-600 mb-1">

                                    <IndianRupee size={13} />

                                    Salary

                                </div>

                                <p className="text-sm font-bold text-emerald-700">

                                    {formatSalary(
                                        emp.salary
                                    )}

                                </p>

                            </div>


                            <div className="bg-blue-50 rounded-xl p-3">

                                <div className="flex items-center gap-2 text-xs text-blue-600 mb-1">

                                    <CalendarDays size={13} />

                                    Joining Date

                                </div>

                                <p className="text-sm font-semibold text-blue-700">

                                    {formatDate(
                                        emp.joining_date
                                    )}

                                </p>

                            </div>

                        </div>


                        {/* Department mobile */}

                        <div className="sm:hidden mt-3">

                            <span className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-100 text-violet-700 px-3 py-1.5 rounded-lg text-xs font-bold">

                                <Building2 size={13} />

                                {getDepartmentName(
                                    emp.department_id
                                )}

                            </span>

                        </div>


                        {/* Resume + Actions */}

                        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">


                            {/* Resume */}

                            <input
                                type="file"
                                ref={(el) =>
                                    (resumeInputRefs.current[
                                        emp.id
                                    ] = el)
                                }
                                className="hidden"
                                accept=".pdf,application/pdf"
                                onChange={(e) => {

                                    handleResumeUpload(
                                        emp.id,
                                        e.target.files?.[0]
                                    );

                                    e.target.value = "";

                                }}
                            />


                            <div>

                                {emp.resume ? (

                                    <div className="flex items-center gap-2">

                                        <a
                                            href={getMediaUrl(
                                                emp.resume
                                            )}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-xs font-bold transition"
                                        >

                                            <Eye size={14} />

                                            View Resume

                                        </a>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                triggerResumeInput(
                                                    emp.id
                                                )
                                            }
                                            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
                                        >

                                            <Upload
                                                size={14}
                                            />

                                        </button>

                                    </div>

                                ) : (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            triggerResumeInput(
                                                emp.id
                                            )
                                        }
                                        className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold"
                                    >

                                        <Upload size={14} />

                                        Upload Resume

                                    </button>

                                )}

                            </div>


                            {/* Actions */}

                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(emp)
                                    }
                                    className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-3 py-2 rounded-lg text-xs font-bold transition active:scale-95"
                                >

                                    <Edit2 size={14} />

                                    Edit

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        onDelete(emp.id)
                                    }
                                    className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-bold transition active:scale-95"
                                >

                                    <Trash2 size={14} />

                                    Delete

                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}


export default EmployeeTable;