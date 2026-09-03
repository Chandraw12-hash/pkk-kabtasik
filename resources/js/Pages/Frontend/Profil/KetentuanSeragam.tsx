import React from "react";
import { Head } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import {
    Shirt,
    Award,
    HardHat,
    Scissors,
    CheckCircle,
    Check,
} from "lucide-react";

const seragamResmi = {
    judul: "Pedoman Seragam Resmi",
    desc: "Seragam Resmi digunakan pada acara kenegaraan, upacara hari besar nasional, pelantikan pengurus, dan acara formal lainnya yang melibatkan jajaran pimpinan daerah.",

    komponen: [
        {
            icon: Shirt,
            title: "Batik PKK",
            desc: "Menggunakan motif batik PKK nasional sesuai ketentuan yang berlaku.",
        },
        {
            icon: Award,
            title: "Atribut Pendukung",
            desc: "Menggunakan lencana atau pin PKK, papan nama, serta atribut resmi sesuai tingkatan.",
        },
        {
            icon: HardHat,
            title: "Kerudung / Headwear",
            desc: "Menggunakan kerudung yang rapi dan disesuaikan dengan ketentuan seragam PKK.",
        },
        {
            icon: Scissors,
            title: "Rok / Celana",
            desc: "Menggunakan bawahan sesuai ketentuan dan warna yang serasi dengan seragam resmi.",
        },
    ],

    ketentuan: [
        "Digunakan pada upacara resmi dan hari besar nasional",
        "Wajib menggunakan lencana PKK sesuai tingkatan",
        "Seragam yang digunakan harus sesuai dengan ketentuan resmi",
        "Penampilan harus rapi, sopan, dan mencerminkan identitas organisasi",
    ],

    image: "/assets/images/seragam.png",
};

export default function KetentuanSeragam() {
    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-slate-800 pt-14">
            <Head title="Ketentuan Seragam PKK - PKK Kabupaten Tasikmalaya" />

            <Navbar />

            {/* ==================== KONTEN ==================== */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

                        {/* ==================== KIRI ==================== */}
                        <div className="w-full lg:w-7/12">
                            <p className="text-teal-600 text-sm font-semibold tracking-wide uppercase mb-2">
                                Standar Penampilan
                            </p>

                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                {seragamResmi.judul}
                            </h2>

                            <p className="text-slate-500 text-base leading-relaxed mb-8">
                                {seragamResmi.desc}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {seragamResmi.komponen.map((k, i) => {
                                    const Icon = k.icon;

                                    return (
                                        <div
                                            key={i}
                                            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all duration-300"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center mb-3">
                                                <Icon
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
                                    );
                                })}
                            </div>
                        </div>

                        {/* ==================== KANAN ==================== */}
                        <div className="w-full lg:w-5/12 space-y-6">

                            {/* ==================== GAMBAR ==================== */}
                            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                                <div className="w-full h-[420px] flex items-center justify-center p-6 sm:p-8">
                                    <img
                                        src={seragamResmi.image}
                                        alt={seragamResmi.judul}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>

                            {/* ==================== KETENTUAN ==================== */}
                            <div className="border border-slate-200 rounded-xl p-6 bg-white">
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
                                    {seragamResmi.ketentuan.map((k, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3"
                                        >
                                            <Check
                                                size={15}
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
