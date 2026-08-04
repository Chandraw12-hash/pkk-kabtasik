import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import TextInput from "@/Components/Form/TextInput";
import Button from "@/Components/UI/Button";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    Share2
} from "lucide-react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div
            className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center p-6 lg:p-12"
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
        >
            <style>{`
                ::-webkit-scrollbar { display: none; }

                /* Efek border hitam tebal untuk input saat di-focus */
                .input-clean:focus {
                    border-color: #0f172a !important;
                    box-shadow: 0 0 0 2px #0f172a !important;
                }
            `}</style>

            <Head title="Masuk" />

            {/* Container Utama - Lebih lebar agar ruang kosong berkurang */}
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* KIRI: Branding & Teks Pemberdayaan */}
                <div className="flex flex-col justify-center space-y-10 px-2 lg:px-0">

                    {/* Logo & Nama */}
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm p-1.5">
                            <img
                                src="/assets/logo/logotasik.png"
                                alt="Logo"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-extrabold text-slate-900 tracking-wide">
                                PKK
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">
                                Kabupaten Tasikmalaya
                            </span>
                        </div>
                    </div>

                    {/* Judul Besar */}
                    <div className="space-y-5">
                        <h1 className="text-[2.5rem] lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                            Pemberdayaan<br />
                            <span className="text-[#008080]">Mandiri</span> Lewat<br />
                            Digitalisasi.
                        </h1>
                        <p className="text-slate-500 text-[15px] lg:text-base leading-relaxed max-w-md font-medium">
                            Akses sistem informasi terpadu Tim Penggerak PKK Kabupaten Tasikmalaya untuk pengelolaan program kerja yang lebih efisien.
                        </p>
                    </div>

                    {/* Dua Poin Utama di bawah teks */}
                    <div className="flex flex-wrap gap-8">
                        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                            <ShieldCheck size={20} className="text-[#008080]" />
                            Akses Terenkripsi
                        </div>
                        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                            <Share2 size={20} className="text-[#008080]" />
                            Sinergi Komunitas
                        </div>
                    </div>
                </div>

                {/* KANAN: Form Login */}
                <div className="flex justify-center lg:justify-end lg:pr-4">
                    <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100/80 p-8">

                        {/* Header Form */}
                        <div className="mb-7">
                            <h2 className="text-2xl font-bold text-slate-900">Selamat Datang</h2>
                            <p className="text-slate-500 text-sm mt-1.5">Silakan masuk ke akun Anda</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Username */}
                            <div>
                                <label className="text-sm font-bold text-slate-700 block mb-1.5">Username</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <User size={18} className="text-slate-400" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        placeholder="Masukkan username"
                                        value={data.username}
                                        onChange={(e) => setData("username", e.target.value)}
                                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl input-clean outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.username && (
                                    <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.username}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-sm font-bold text-slate-700">Password</label>
                                    <Link href="#" className="text-xs font-semibold text-[#008080] hover:text-[#006666] transition-colors">
                                        Lupa Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-slate-400" />
                                    </div>
                                    <TextInput
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        className="w-full pl-11 pr-11 py-3.5 bg-white border border-slate-200 rounded-xl input-clean outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-2.5">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                    className="w-4 h-4 rounded border-slate-300 text-[#008080] focus:ring-[#008080]"
                                />
                                <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer select-none">
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#008080] hover:bg-[#006666] text-white font-bold rounded-xl py-3.5 shadow-lg shadow-teal-900/20 transition-all duration-200 flex justify-center items-center gap-2 mt-2"
                            >
                                {processing ? "Memproses..." : "Masuk ke Dashboard"}
                                <ArrowRight size={18} />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Copyright - di bawah tengah halaman */}
            <div className="mt-16 text-center text-slate-400 text-[11px] font-medium tracking-wide leading-relaxed">
                <p>&copy; {new Date().getFullYear()} Dinas Perhubungan Komunikasi dan Informatika</p>
                <p>Kabupaten Tasikmalaya</p>
            </div>
        </div>
    );
}
