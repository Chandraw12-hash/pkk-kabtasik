import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Download,
    Phone,
    BookOpen,
    ChevronRight,
    Users,
    Crown,
    Briefcase,
    DollarSign,
    Heart,
    GraduationCap,
    Utensils,
    Stethoscope,
    ArrowRight,
    X,
} from "lucide-react";

const pokjaList = [
    {
        nama: "Pokja I",
        label: "POKJA I",
        program: "Penghayatan & Pengamalan Pancasila",
        desc: "Fokus pada pembinaan mental spiritual, penguatan karakter, gotong royong, dan kehidupan bermasyarakat.",
        icon: Heart,
        accent: "#3B82F6",
        ketua: "Suci Tarini, S.STP., MM.",
        wakil: "Rossi Hermawaty, S.",
        sekretaris: "Priliana Susanti, ST., M.Si.",
        poin: [
            "Eni Nur’aeni, S.Pd.I",
            "Ustadzah Aroh Siti Saharah",
            "Nining Cahyaningsih, SH., M.H",
            "Eva Tita Maesaroh, SE",
            "Hj. Iyen Nuryanah, S.ST,M., M.Si.",
        ],
    },
    {
        nama: "Pokja II",
        label: "POKJA II",
        program: "Pendidikan, Keterampilan & Koperasi",
        desc: "Peningkatan pendidikan keluarga, keterampilan ekonomi, dan pengembangan kehidupan berkoperasi.",
        icon: GraduationCap,
        accent: "#10B981",
        ketua: "Dr. Depon Nurul Aida, S.Ag, M.Pd.",
        wakil: "Hj. Elin Karilna Sahroni, S.IP.",
        sekretaris: "Hj. Rade Maulida",
        poin: [
            "Nuraeni",
            "Ipa Sunarti",
            "Eva Sri Sugiarti, S.KM., M.Si",
            "Ati Suciati, SH",
            "Ela Susilawati",
        ],
    },
    {
        nama: "Pokja III",
        label: "POKJA III",
        program: "Pangan, Sandang & Tata Laksana RT",
        desc: "Pemenuhan kebutuhan pangan bergizi, sandang layak, perumahan sehat, dan tata laksana rumah tangga.",
        icon: Utensils,
        accent: "#F97316",
        ketua: "Ida Rosida, S.P.",
        wakil: "Wiwik Hikmawati, S.P., M.P.",
        sekretaris: "Dewi Sartika, S.I.Kom.",
        poin: [
            "Nengsih Siti Aisah, S.Pd",
            "Ai Nurfadilah, S.Pd",
            "Yani Suryani, S.P",
            "Irman Hirdasah",
        ],
    },
    {
        nama: "Pokja IV",
        label: "POKJA IV",
        program: "Kesehatan, Lingkungan & Perencanaan Sehat",
        desc: "Pembinaan kesehatan keluarga, pelestarian lingkungan hidup dan perencanaan keluarga sehat.",
        icon: Stethoscope,
        accent: "#14B8A6",
        ketua: "Mutiarawati",
        wakil: "Lilis Herlinawati, SE.",
        sekretaris: "Nando Bangkit Muhamad, SE., MM.",
        poin: [
            "dr. Nia Nuraeni SPKJ",
            "Candrawati PD. S.IP",
            "Desti Anggraeni",
            "Sri Handayani",
        ],
    },
];

const pimpinanInti = [
    {
        jabatan: "Ketua I (Pembinaan Karakter)",
        nama: "Khifayati Nursetiana, S.Pd.",
        icon: Users,
    },
    {
        jabatan: "Ketua II (Pendidikan & Ekonomi)",
        nama: "Hj. Ridda Dentin Rosidatin, SE.",
        icon: BookOpen,
    },
    {
        jabatan: "Ketua III (Ketahanan Keluarga)",
        nama: "Dra. Hj. Ratna Djuwita, M.Si.",
        icon: Heart,
    },
    {
        jabatan: "Ketua IV (Kesehatan & Lingkungan)",
        nama: "Hj. Ane Rochmawati, S.IP., S.TP, MM.",
        icon: Stethoscope,
    },
    {
        jabatan: "Sekretaris",
        nama: "Yanti Permayanti, S.KM., MM.",
        icon: Briefcase,
    },
    {
        jabatan: "Wakil Sekretaris I",
        nama: "Ita Agustia, S.IP.",
        icon: Briefcase,
    },
    {
        jabatan: "Wakil Sekretaris II",
        nama: "Kaka Alien Tutanis",
        icon: Briefcase,
    },
    {
        jabatan: "Bendahara",
        nama: "Hj. Leni Nuraeni HR., S.Kep.",
        icon: DollarSign,
    },
    {
        jabatan: "Wakil Bendahara I",
        nama: "Teni Mulyateni, S.IP.",
        icon: DollarSign,
    },
];

export default function StrukturOrganisasi() {
    const [selectedProgram, setSelectedProgram] = useState(null);

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Struktur Organisasi - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== PIMPINAN UTAMA ==================== */}
            <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                        <div className="w-full lg:w-5/12">
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <img
                                    src="/assets/images/ketuapkk.png"
                                    alt="Hj. Retno Widyastuti, S.E."
                                    className="w-full h-[420px] md:h-[480px] object-cover object-top"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80";
                                    }}
                                />
                            </div>
                            <div className="mt-4">
                                <p className="text-lg font-bold text-slate-900">
                                    Hj. Retno Widyastuti, S.E.
                                </p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Ketua TP PKK Kabupaten Tasikmalaya
                                </p>
                            </div>
                        </div>

                        <div className="w-full lg:w-7/12">
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Pimpinan Utama
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                                Hj. Retno Widyastuti, S.E.
                            </h2>
                            <div className="space-y-4 text-slate-600 text-[15px] leading-relaxed">
                                <p className="italic text-slate-700">
                                    &ldquo;Pemberdayaan keluarga adalah pondasi
                                    utama dalam membangun Tasikmalaya yang lebih
                                    baik, sehat, dan berdaya saing tinggi.&rdquo;
                                </p>
                                <p>
                                    Selaku Ketua TP PKK Kabupaten Tasikmalaya,
                                    beliau memimpin kepengurusan Masa Bakti
                                    2025–2030 bersama jajaran pengurus lengkap
                                    untuk kesejahteraan masyarakat.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== HIERARKI ==================== */}
            <section
                id="hierarki"
                className="py-20 lg:py-24 bg-white border-t border-slate-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
                        <div>
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Bagan Kepengurusan
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                                Hierarki Organisasi
                            </h2>
                        </div>
                        <a
                            href="#"
                            className="inline-flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            <Download size={15} />
                            Unduh PDF
                        </a>
                    </div>

                    {/* Ketua */}
                    <div className="flex justify-center mb-10">
                        <div className="bg-white border border-slate-200 rounded-xl px-8 py-6 text-center min-w-[260px]">
                            <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                                <Crown size={20} className="text-teal-600" />
                            </div>
                            <p className="text-xs font-semibold text-teal-600 tracking-wide uppercase mb-1">
                                Ketua TP PKK
                            </p>
                            <p className="font-bold text-slate-900">
                                Hj. Retno Widyastuti, S.E.
                            </p>
                        </div>
                    </div>

                    {/* Jajaran Pengurus Inti Lengkap */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                        {pimpinanInti.map((p, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm"
                            >
                                <div className="w-11 h-11 rounded-lg bg-teal-50 flex items-center justify-center mx-auto mb-3">
                                    <p.icon
                                        size={18}
                                        className="text-teal-600"
                                    />
                                </div>
                                <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase mb-1">
                                    {p.jabatan}
                                </p>
                                <p className="font-semibold text-slate-900 text-sm">
                                    {p.nama}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pokja Header */}
                    <div className="mb-6 text-center">
                        <p className="text-sm font-semibold text-slate-500 tracking-wide uppercase mb-2">
                            Kelompok Kerja (POKJA)
                        </p>
                        <p className="text-xs text-slate-400">
                            Klik &quot;Lihat Pengurus Pokja&quot; untuk melihat rincian pengurus dari setiap POKJA.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {pokjaList.map((pokja, i) => (
                            <div
                                key={i}
                                className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col hover:border-slate-300 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-11 h-11 rounded-lg flex items-center justify-center text-white"
                                        style={{
                                            backgroundColor: pokja.accent,
                                        }}
                                    >
                                        <pokja.icon size={18} />
                                    </div>
                                    <span className="text-[10px] font-semibold tracking-wide uppercase text-slate-400 bg-white px-2.5 py-1 rounded">
                                        {pokja.label}
                                    </span>
                                </div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug">
                                    {pokja.program}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-4">
                                    {pokja.desc}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setSelectedProgram(pokja)}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors text-left"
                                >
                                    Lihat Pengurus Pokja
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MODAL POPUP DETAIL POKJA & ANGGOTA LENGKAP */}
            {selectedProgram && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40"
                    role="dialog"
                    aria-modal="true"
                >
                    <button
                        type="button"
                        className="absolute inset-0"
                        aria-label="Tutup"
                        onClick={() => setSelectedProgram(null)}
                    />
                    <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setSelectedProgram(null)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700"
                            aria-label="Tutup"
                        >
                            <X size={16} />
                        </button>
                        <div className="flex flex-col items-center text-center mb-6">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center mb-3 text-white"
                                style={{
                                    backgroundColor: selectedProgram.accent,
                                }}
                            >
                                <selectedProgram.icon size={26} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                {selectedProgram.nama}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">
                                {selectedProgram.program}
                            </p>
                        </div>

                        <div className="space-y-4 text-sm text-slate-700 border-t border-slate-100 pt-4">
                            <div className="bg-white p-3 rounded-lg space-y-1">
                                <p>
                                    <strong className="text-slate-900">
                                        Ketua:
                                    </strong>{" "}
                                    {selectedProgram.ketua}
                                </p>
                                <p>
                                    <strong className="text-slate-900">
                                        Wakil Ketua:
                                    </strong>{" "}
                                    {selectedProgram.wakil}
                                </p>
                                <p>
                                    <strong className="text-slate-900">
                                        Sekretaris:
                                    </strong>{" "}
                                    {selectedProgram.sekretaris}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-slate-900 mb-2">
                                    Anggota:
                                </p>
                                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                                    {selectedProgram.poin.map((p, i) => (
                                        <li key={i}>{p}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
