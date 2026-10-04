interface StatusBadgeProps {
    status: string;
}

const statusStyles: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
    rejected: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300",
};

const labels: Record<string, string> = {
    pending: "Menunggu",
    approved: "Disetujui",
    rejected: "Perlu diperbaiki",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const normalized = status.toLowerCase();
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[normalized] ?? "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
            {labels[normalized] ?? status}
        </span>
    );
}
