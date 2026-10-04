import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    tone?: "teal" | "amber" | "green" | "rose";
}

const toneClasses: Record<NonNullable<StatsCardProps["tone"]>, string> = {
    teal: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
};

export default function StatsCard({ label, value, icon: Icon, tone = "teal" }: StatsCardProps) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-2 font-['Poppins',_sans-serif] text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        {typeof value === "number" ? value.toLocaleString("id-ID") : value}
                    </p>
                </div>
                <span className={`rounded-xl p-3 ${toneClasses[tone]}`} aria-hidden="true">
                    <Icon size={20} />
                </span>
            </div>
        </article>
    );
}
