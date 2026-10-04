import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteProps {
    open: boolean;
    label: string;
    processing: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function ConfirmDelete({ open, label, processing, onCancel, onConfirm }: ConfirmDeleteProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4" role="presentation">
            <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
                <span className="inline-flex rounded-xl bg-rose-50 p-3 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"><AlertTriangle size={21} aria-hidden="true" /></span>
                <h2 id="delete-title" className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Hapus data ini?</h2>
                <p id="delete-description" className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Data “{label}” akan dihapus. Tindakan ini dapat dipulihkan oleh administrator basis data.</p>
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button type="button" onClick={onCancel} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Batal</button>
                    <button type="button" disabled={processing} onClick={onConfirm} className="min-h-11 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600">{processing ? "Menghapus..." : "Ya, hapus"}</button>
                </div>
            </section>
        </div>
    );
}
