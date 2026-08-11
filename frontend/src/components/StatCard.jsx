import { ArrowUpRight } from "lucide-react";

function StatCard({
    title,
    value,
    color = "#2563eb",
    icon: Icon,
    subtitle = "Updated just now",
}) {
    return (
        <div
            className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
            {/* Decorative background */}
            <div
                className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-300"
                style={{ backgroundColor: color }}
            />

            <div className="relative flex items-start justify-between gap-4">

                {/* Text */}
                <div className="min-w-0">

                    <p className="text-sm font-semibold text-slate-500">
                        {title}
                    </p>

                    <h2
                        className="text-3xl font-bold mt-3 tracking-tight"
                        style={{ color }}
                    >
                        {value}
                    </h2>

                    <p className="text-xs text-slate-400 mt-2">
                        {subtitle}
                    </p>

                </div>

                {/* Icon */}
                {Icon && (
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                            backgroundColor: `${color}15`,
                            color: color,
                        }}
                    >
                        <Icon size={23} strokeWidth={2.2} />
                    </div>
                )}

            </div>

            {/* Bottom indicator */}
            <div className="relative mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">

                <span
                    className="inline-flex items-center gap-1 text-xs font-semibold"
                    style={{ color }}
                >
                    <ArrowUpRight size={14} />
                    Overview
                </span>

                <div className="flex gap-1 items-end h-5">
                    <span
                        className="w-1.5 h-2 rounded-full"
                        style={{ backgroundColor: `${color}40` }}
                    />

                    <span
                        className="w-1.5 h-3 rounded-full"
                        style={{ backgroundColor: `${color}60` }}
                    />

                    <span
                        className="w-1.5 h-4 rounded-full"
                        style={{ backgroundColor: `${color}80` }}
                    />

                    <span
                        className="w-1.5 h-5 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                </div>

            </div>

        </div>
    );
}

export default StatCard;