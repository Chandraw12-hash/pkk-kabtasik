import React, { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import Button from "./Button";

interface ConfirmationModalProps {
    show?: boolean;
    title?: string;
    message?: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    processing?: boolean;
}

export default function ConfirmationModal({
    show = false,
    title = "Konfirmasi Hapus",
    message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
    onConfirm,
    onCancel,
    processing = false,
}: ConfirmationModalProps) {
    // animate: untuk trigger CSS transition (opacity/scale)
    const [animate, setAnimate] = useState(false);
    // isVisible: untuk mengontrol apakah komponen ada di DOM atau tidak
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            // Beri sedikit jeda agar CSS transition kepicu setelah render
            const timer = setTimeout(() => setAnimate(true), 10);
            return () => clearTimeout(timer);
        } else {
            setAnimate(false);
            // Tunggu animasi keluar selesai (300ms sesuai durasi transition Tailwind)
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 dark:bg-slate-900/40">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
                    animate ? "opacity-100" : "opacity-0"
                }`}
                onClick={processing ? undefined : onCancel}
            />

            {/* Modal Content */}
            <div
                className={`
                relative bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-700/50 
                transition-all duration-300 ease-in-out transform
                ${
                    animate
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-4"
                }
            `}
            >
                <div className="p-8">
                    {/* Icon & Close Button */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 dark:bg-rose-700 dark:text-rose-200">
                            <AlertCircle size={32} strokeWidth={2.5} />
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all active:scale-90 dark:text-slate-200 dark:hover:text-slate-400 dark:hover:bg-slate-700"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Text content */}
                    <h3 className="text-xl font-bold text-slate-800 mb-2 dark:text-slate-200">
                        {title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed dark:text-slate-400">
                        {message}
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        disabled={processing}
                        className="flex-1 py-3 text-[13px]"
                    >
                        Batalkan
                    </Button>
                    <Button
                        variant="danger"
                        onClick={onConfirm}
                        disabled={processing}
                        className="flex-1 py-3 text-[13px]"
                    >
                        {processing ? "Menghapus..." : "Ya, Hapus"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
