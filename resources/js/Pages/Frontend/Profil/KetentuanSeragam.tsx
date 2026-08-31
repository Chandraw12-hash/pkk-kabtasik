import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Shirt,
    Award,
    HardHat,
    Scissors,
    Star,
    Shield,
    Tag,
    Palette,
    CheckCircle,
    Info,
    Check,
} from "lucide-react";

const tabs = ["Seragam Resmi", "Seragam Kota", "Seragam Lapangan"] as const;
type TabKey = (typeof tabs)[number];

const seragamData = {
    "Seragam Resmi": {
        judul: "Pedoman Seragam Resmi",
        desc: "Seragam Resmi digunakan pada acara kenegaraan, upacara hari besar nasional, pelantikan pengurus, dan acara formal lainnya yang melibatkan jajaran pimpinan daerah.",
        komponen: [
            {
                icon: Shirt,
                title: "Batik PKK",
                desc: "Menggunakan motif batik PKK nasional berwarna hijau tosca dengan logo PKK yang tercetak jelas.",
            },
            {
                icon: Award,
                title: "Atribut Pendukung",
                desc: "Lencana/pin PKK, papan nama di dada kanan, dan sepatu pantofel hitam.",
            },
            {
                icon: HardHat,
                title: "Kerudung / Headwear",
                desc: "Warna kerudung disesuaikan dengan warna tosca PKK, polos tanpa hiasan berlebihan.",
            },
            {
                icon: Scissors,
                title: "Rok / Celana",
                desc: "Rok atau celana panjang berwarna hijau tosca senada dengan batik.",
            },
        ],
        ketentuan: [
            "Digunakan pada upacara resmi kenegaraan dan hari besar nasional",
            "Wajib menggunakan lencana PKK yang sesuai tingkatan",
            "Batik yang digunakan harus bermotif PKK resmi yang telah ditentukan",
            "Sepatu berwarna hitam dengan tinggi tumit maksimal 5 cm",
        ],
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    },
    "Seragam Kota": {
        judul: "Pedoman Seragam Kota",
        desc: "Seragam Kota digunakan pada kegiatan rapat rutin, koordinasi, kunjungan kerja, serta kegiatan operasional PKK tingkat kabupaten dan kecamatan.",
        komponen: [
            {
                icon: Palette,
                title: "Kemeja PKK",
                desc: "Kemeja berwarna hijau daun PKK dengan kerah biasa, berlengan panjang untuk kegiatan formal.",
            },
            {
                icon: Tag,
                title: "Identitas Kader",
                desc: "Papan nama, nomor keanggotaan, dan lencana tingkatan kader yang terlihat jelas.",
            },
            {
                icon: Shield,
                title: "Kelengkapan",
                desc: "Topi PKK, tas PKK, dan perlengkapan pendukung lainnya sesuai ketentuan yang berlaku.",
            },
            {
                icon: Scissors,
                title: "Bawahan",
                desc: "Rok atau celana berwarna gelap (hitam/navy), tidak bermotif, dengan potongan rapi.",
            },
        ],
        ketentuan: [
            "Digunakan pada rapat, koordinasi, dan kunjungan kerja rutin",
            "Kemeja harus berwarna hijau daun sesuai standar PKK",
            "Identitas kader dan lencana wajib terpasang dengan benar",
            "Bawahan menggunakan warna gelap yang serasi dengan kemeja",
        ],
        image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80",
    },
    "Seragam Lapangan": {
        judul: "Pedoman Seragam Lapangan",
        desc: "Seragam Lapangan digunakan saat kegiatan di luar ruangan, seperti kerja bakti, penyuluhan, posyandu, serta kegiatan sosial kemasyarakatan lainnya.",
        komponen: [
            {
                icon: Shirt,
                title: "Kaos PKK",
                desc: "Kaos berkerah berwarna hijau muda dengan logo PKK di dada kiri, berbahan katun nyaman.",
            },
            {
                icon: HardHat,
                title: "Topi Lapangan",
                desc: "Topi lapangan berwarna hijau PKK dengan logo PKK di bagian depan.",
            },
            {
                icon: Star,
                title: "Rompi PKK",
                desc: "Rompi berwarna hijau PKK, dilengkapi saku depan dan logo PKK di dada kanan.",
            },
            {
                icon: Info,
                title: "Alas Kaki",
                desc: "Menggunakan sepatu atau sandal yang nyaman dan aman untuk kegiatan lapangan.",
            },
        ],
        ketentuan: [
            "Digunakan khusus untuk kegiatan luar ruangan dan kemasyarakatan",
            "Kaos dan rompi PKK harus bersih dan rapi",
            "Topi PKK wajib dikenakan sebagai perlindungan dan identitas",
            "Prioritaskan kenyamanan dan keamanan dalam memilih alas kaki",
        ],
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    },
};

export default function KetentuanSeragam() {
    const [activeTab, setActiveTab] = useState<TabKey>("Seragam Resmi");
    const current = seragamData[activeTab];

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Ketentuan Seragam PKK - PKK Kabupaten Tasikmalaya" />
            <Navbar />

            {/* ==================== TABS ==================== */}
            <section className="py-8 bg-white border-b border-slate-100">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-wrap justify-center gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-colors ${
                                    activeTab === tab
                                        ? "bg-teal-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== KONTEN ==================== */}
            <section className="py-20 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
                        {/* Kiri */}
                        <div className="w-full lg:w-7/12">
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Standar Penampilan
                            </p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                {current.judul}
                            </h2>
                            <p className="text-slate-500 text-base leading-relaxed mb-8">
                                {current.desc}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {current.komponen.map((k, i) => (
                                    <div
                                        key={i}
                                        className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                                            <k.icon
                                                size={18}
                                                className="text-teal-600"
                                            />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                                            {k.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {k.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Kanan */}
                        <div className="w-full lg:w-5/12 space-y-6">
                            {/* Gambar */}
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <img
                                    src={current.image}
                                    alt={current.judul}
                                    className="w-full h-56 object-cover"
                                />
                            </div>

                            {/* Ketentuan */}
                            <div className="border border-slate-200 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center">
                                        <CheckCircle
                                            size={18}
                                            className="text-teal-600"
                                        />
                                    </div>
                                    <h3 className="text-base font-semibold text-slate-900">
                                        Ketentuan Penggunaan
                                    </h3>
                                </div>
                                <ul className="space-y-3">
                                    {current.ketentuan.map((k, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3"
                                        >
                                            <Check
                                                size={14}
                                                className="text-teal-600 mt-1 flex-shrink-0"
                                            />
                                            <p className="text-slate-600 text-sm leading-relaxed">
                                                {k}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
