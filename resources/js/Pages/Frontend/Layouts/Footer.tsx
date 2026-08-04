import React from "react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/assets/logo/logotasik.png"
                            alt="Logo Kab. Tasikmalaya"
                            className="h-8 w-auto transition-all"
                        />
                        <span className="text-sm font-semibold text-slate-500">
                            SPBE Kabupaten Tasikmalaya
                        </span>
                    </div>
                    <div className="text-slate-400 text-sm text-center md:text-right">
                        &copy; {new Date().getFullYear()} Dinas Perhubungan
                        Komunikasi dan Informatika Kabupaten Tasikmalaya. <br />
                        All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
