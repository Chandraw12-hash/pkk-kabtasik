import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    Users,
    ArrowRight,
    ArrowLeft
} from "lucide-react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <Head title="Masuk - SIMPEL PKK Kabupaten Tasikmalaya" />

            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#38BDF8]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#1DA599]/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

            <div className="absolute bottom-8 right-8 opacity-5 pointer-events-none">
                <Users size={200} />
            </div>

            <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">

                <div className="hidden lg:flex flex-col">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-indigo-50/80 rounded flex items-center justify-center">
                            <img src="/assets/logo/logotasik.png" alt="Logo PKK" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        </div>
                        <div>
                            <h2 className="text-[#0F172A] font-extrabold text-xl tracking-tight leading-none">SIMPEL PKK</h2>
                            <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mt-0.5">Kabupaten Tasikmalaya</p>
                        </div>
                    </div>

                    <h1 className="text-4xl lg:text-[52px] font-extrabold text-[#0F172A] leading-[1.1] mb-6">
                        Pemberdayaan <br />
                        <span className="text-[#1DA599]">Mandiri</span> Lewat <br />
                        Digitalisasi.
                    </h1>

                    <p className="text-gray-500 text-[15px] leading-relaxed max-w-md mb-12">
                        Akses sistem informasi terpadu Tim Penggerak PKK Kabupaten Tasikmalaya untuk pengelolaan program kerja, berita terkini, dan koordinasi Pokja yang lebih efisien.
                    </p>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[#1DA599] font-bold text-sm">
                            <ShieldCheck size={18} />
                            Akses Terenkripsi
                        </div>
                        <div className="flex items-center gap-2 text-[#475569] font-bold text-sm">
                            <Users size={18} />
                            Sinergi Komunitas
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100 relative">

                        <div className="flex lg:hidden items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-indigo-50/80 rounded flex items-center justify-center">
                                <img src="/assets/logo/logotasik.png" alt="Logo PKK" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                            </div>
                            <div>
                                <h2 className="text-[#0F172A] font-extrabold text-lg tracking-tight leading-none">SIMPEL PKK</h2>
                                <p className="text-gray-500 text-[9px] font-bold tracking-widest uppercase mt-0.5">Kab. Tasikmalaya</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">Selamat Datang</h2>
                            <p className="text-gray-500 text-sm">Silakan masuk ke akun Anda</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">

                            <div>
                                <label className="block text-xs font-bold text-[#0F172A] mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-11 pr-4 py-3.5 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1DA599]/20 focus:bg-white transition-colors text-[#0F172A] font-medium"
                                        placeholder="Masukkan username"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-[#0F172A]">
                                        Password
                                    </label>
                                    <Link href="#" className="text-xs font-bold text-[#1DA599] hover:text-teal-700">
                                        Lupa Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="block w-full pl-11 pr-12 py-3.5 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1DA599]/20 focus:bg-white transition-colors text-[#0F172A] font-medium"
                                        placeholder="••••••••"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="remember_me"
                                    type="checkbox"
                                    className="w-4 h-4 text-[#1DA599] border-gray-300 rounded focus:ring-[#1DA599] bg-[#F8FAFC]"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <label htmlFor="remember_me" className="ml-2.5 text-xs font-medium text-gray-500 cursor-pointer">
                                    Ingat saya di perangkat ini
                                </label>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-slate-900/10 disabled:opacity-70"
                                >
                                    Masuk ke Dashboard
                                    <ArrowRight size={16} />
                                </button>
                            </div>

                            <div className="text-center mt-6">
                                <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#0F172A] transition-colors">
                                    <ArrowLeft size={14} />
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className="text-center mt-8 lg:mt-10">
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                            © 2024 TP PKK KABUPATEN TASIKMALAYA
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 
