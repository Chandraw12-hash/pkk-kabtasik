import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    Users,
    ArrowRight,
    AlertCircle,
    Building2,
    ArrowLeft,
} from "lucide-react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    // ✅ FIX: Paksa html & body gak bisa scroll
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        const prevHtmlOverflow = html.style.overflow;
        const prevBodyOverflow = body.style.overflow;
        const prevBodyHeight = body.style.height;

        html.style.overflow = "hidden";
        body.style.overflow = "hidden";
        body.style.height = "100vh";

        return () => {
            html.style.overflow = prevHtmlOverflow;
            body.style.overflow = prevBodyOverflow;
            body.style.height = prevBodyHeight;
        };
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <div className="w-screen h-screen overflow-hidden bg-slate-50 flex font-['Poppins',_sans-serif] relative">
            <Head>
                <title>Masuk — Sistem Informasi TP PKK Kabupaten Tasikmalaya</title>
                <meta
                    name="description"
                    content="Login Sistem Informasi TP PKK Kabupaten Tasikmalaya"
                />
                <meta name="robots" content="noindex, nofollow" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>

            {/* ============================================================
                BACKGROUND DEKORATIF
            ============================================================ */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                }}
                aria-hidden="true"
            />
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-cyan-100/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            {/* ============================================================
                KONTEN UTAMA
            ============================================================ */}
            <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-6 py-4">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">

                    {/* ============================================
                        KIRI: BRANDING
                    ============================================ */}
                    <div className="hidden lg:flex flex-col max-h-full">
                        {/* Logo + Nama */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                <img
                                    src="/assets/logo/logotasik.png"
                                    alt="Logo PKK Kabupaten Tasikmalaya"
                                    className="w-7 h-7 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                    }}
                                />
                            </div>
                            <div className="leading-tight">
                                <p className="text-[13px] font-extrabold text-slate-900 tracking-tight">
                                    TP PKK Kabupaten Tasikmalaya
                                </p>
                                <p className="text-[9px] font-semibold text-slate-500 tracking-widest uppercase mt-0.5">
                                    Sistem Informasi Terpadu
                                </p>
                            </div>
                        </div>

                        {/* Badge */}
                        <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-teal-50 border border-teal-100 text-[9px] font-bold tracking-wider uppercase text-teal-700 mb-4">
                            <ShieldCheck size={11} />
                            Sistem Resmi Pemerintah
                        </span>

                        {/* Headline */}
                        <h1 className="text-3xl lg:text-[38px] font-extrabold text-slate-900 leading-[1.15] mb-4 tracking-tight">
                            Pemberdayaan Keluarga
                            <br />
                            <span className="text-teal-600">Menuju Tasikmalaya</span>
                            <br />
                            Sejahtera &amp; Mandiri
                        </h1>

                        <p className="text-slate-600 text-[13px] leading-relaxed max-w-md mb-6">
                            Sistem informasi terpadu TP PKK Kabupaten
                            Tasikmalaya untuk pengelolaan data program kerja,
                            pelaporan Pokja, dan koordinasi kader.
                        </p>

                        {/* Fitur */}
                        <div className="space-y-3 mb-5">
                            <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck size={15} className="text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-slate-900">
                                        Akses Terenkripsi
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                        Dilindungi SSL & autentikasi berlapis.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                                    <Users size={15} className="text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-slate-900">
                                        Sinergi Kader &amp; Pengurus
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                        Koordinasi Pokja I–IV & kader Dasawisma.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                                    <Building2 size={15} className="text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-bold text-slate-900">
                                        Terintegrasi Pemkab
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                        Terhubung sistem Pemkab Tasikmalaya.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Info bantuan */}
                        <div className="pt-4 border-t border-slate-200">
                            <p className="text-[10px] text-slate-500 mb-0.5">
                                Butuh bantuan akses?
                            </p>
                            <p className="text-[12px] font-semibold text-slate-800">
                                Hubungi Sekretariat PKK:{" "}
                                <a
                                    href="mailto:sekretariat@pkk.tasikmalayakab.go.id"
                                    className="text-teal-600 hover:text-teal-700"
                                >
                                    sekretariat@pkk.tasikmalayakab.go.id
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* ============================================
                        KANAN: FORM LOGIN
                    ============================================ */}
                    <div className="w-full max-w-[400px] mx-auto lg:mx-0">
                        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] border border-slate-200">

                            {/* Mobile logo */}
                            <div className="flex lg:hidden items-center gap-2.5 mb-4 pb-4 border-b border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
                                    <img
                                        src="/assets/logo/logotasik.png"
                                        alt="Logo PKK"
                                        className="w-5 h-5 object-contain"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-slate-900 font-extrabold text-[12px] tracking-tight leading-none">
                                        TP PKK Kab. Tasikmalaya
                                    </h2>
                                    <p className="text-slate-500 text-[8px] font-bold tracking-widest uppercase mt-0.5">
                                        Sistem Informasi
                                    </p>
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="mb-4">
                                <h2 className="text-lg font-extrabold text-slate-900 mb-1 tracking-tight">
                                    Masuk ke Akun
                                </h2>
                                <p className="text-slate-500 text-[11px]">
                                    Gunakan username dan password resmi Anda
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-3">
                                {/* Username */}
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-[10px] font-bold text-slate-800 mb-1"
                                    >
                                        Username / NIP
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User size={15} className="text-slate-400" />
                                        </div>
                                        <input
                                            id="username"
                                            type="text"
                                            autoComplete="username"
                                            className={`block w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg text-[12px] text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-teal-500/20 focus:bg-white focus:border-teal-500 transition-colors outline-none ${
                                                errors.username
                                                    ? "border-red-300 bg-red-50/50"
                                                    : "border-slate-200"
                                            }`}
                                            placeholder="Masukkan username Anda"
                                            value={data.username}
                                            onChange={(e) =>
                                                setData("username", e.target.value)
                                            }
                                            required
                                            autoFocus
                                        />
                                    </div>
                                    {errors.username && (
                                        <div className="flex items-center gap-1 mt-1 text-red-600 text-[10px] font-medium">
                                            <AlertCircle size={10} />
                                            {errors.username}
                                        </div>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label
                                            htmlFor="password"
                                            className="block text-[10px] font-bold text-slate-800"
                                        >
                                            Password
                                        </label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-[10px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                                        >
                                            Lupa Password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock size={15} className="text-slate-400" />
                                        </div>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            className={`block w-full pl-9 pr-10 py-2 bg-slate-50 border rounded-lg text-[12px] text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-teal-500/20 focus:bg-white focus:border-teal-500 transition-colors outline-none ${
                                                errors.password
                                                    ? "border-red-300 bg-red-50/50"
                                                    : "border-slate-200"
                                            }`}
                                            placeholder="Masukkan password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData("password", e.target.value)
                                            }
                                            required
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={
                                                showPassword
                                                    ? "Sembunyikan password"
                                                    : "Tampilkan password"
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={14} />
                                            ) : (
                                                <Eye size={14} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div className="flex items-center gap-1 mt-1 text-red-600 text-[10px] font-medium">
                                            <AlertCircle size={10} />
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                {/* Remember me */}
                                <div className="flex items-center pt-0.5">
                                    <input
                                        id="remember_me"
                                        type="checkbox"
                                        className="w-3.5 h-3.5 text-teal-600 border-slate-300 rounded focus:ring-teal-500 focus:ring-2 cursor-pointer"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData("remember", e.target.checked)
                                        }
                                    />
                                    <label
                                        htmlFor="remember_me"
                                        className="ml-2 text-[10px] font-medium text-slate-600 cursor-pointer select-none"
                                    >
                                        Ingat saya di perangkat ini
                                    </label>
                                </div>

                                {/* Submit */}
                                <div className="pt-0.5">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold py-2.5 rounded-lg transition-all text-[12px] shadow-lg shadow-slate-900/10 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                                    >
                                        {processing ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-3 w-3 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                Masuk ke Dashboard
                                                <ArrowRight size={13} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Info keamanan */}
                            <div className="mt-3 pt-3 border-t border-slate-100">
                                <div className="flex items-start gap-1.5 text-[9px] text-slate-500 leading-relaxed">
                                    <ShieldCheck
                                        size={11}
                                        className="text-teal-600 flex-shrink-0 mt-0.5"
                                    />
                                    <p>
                                        Koneksi Anda dilindungi enkripsi SSL.
                                        Jangan bagikan kredensial Anda.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Link kebijakan + back */}
                        <div className="text-center mt-3 space-y-2">
                            <div className="flex items-center justify-center gap-2 text-[9px] text-slate-500">
                                <Link
                                    href="/kebijakan-privasi"
                                    className="hover:text-teal-600 transition-colors"
                                >
                                    Kebijakan Privasi
                                </Link>
                                <span className="text-slate-300">•</span>
                                <Link
                                    href="/syarat-ketentuan"
                                    className="hover:text-teal-600 transition-colors"
                                >
                                    Syarat &amp; Ketentuan
                                </Link>
                            </div>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                <ArrowLeft size={11} />
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
