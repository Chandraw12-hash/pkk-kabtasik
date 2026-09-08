import React from "react";
import { Link } from "@inertiajs/react";
import {
    Facebook,
    Instagram,
    Youtube,
    Twitter,
    Mail,
    Phone,
    MapPin,
    Globe,
} from "lucide-react";
import AccessibilityWidget from "./AccessibilityWidget";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="bg-[#1a1a1a] text-slate-300 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                        {/* Brand */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <img
                                    src="/assets/logo/logotasik.png"
                                    alt="Logo Kab. Tasikmalaya"
                                    className="h-11 w-auto"
                                />
                                <div>
                                    <h3 className="text-white font-semibold text-base leading-tight">
                                        TP PKK
                                    </h3>
                                    <p className="text-teal-400 text-xs font-medium">
                                        Kabupaten Tasikmalaya
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed mb-5">
                                Pemberdayaan dan Kesejahteraan Keluarga Kabupaten
                                Tasikmalaya menuju keluarga sejahtera dan mandiri.
                            </p>
                            <div className="flex gap-2">
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-teal-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                                    aria-label="Facebook"
                                >
                                    <Facebook size={16} />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-teal-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                                    aria-label="Instagram"
                                >
                                    <Instagram size={16} />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-teal-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                                    aria-label="Youtube"
                                >
                                    <Youtube size={16} />
                                </a>
                                <a
                                    href="#"
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-teal-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                                    aria-label="Twitter"
                                >
                                    <Twitter size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Program */}
                        <div>
                            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                                Program PKK
                            </h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link
                                        href="/#"
                                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                                    >
                                        10 Program Pokok PKK
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/sekretariat"
                                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                                    >
                                        Data Umum / Sekretariat
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/pokja-1"
                                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                                    >
                                        Pokja I – IV
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/berita"
                                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                                    >
                                        Berita Terkini
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Informasi */}
                        <div>
                            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                                Informasi
                            </h4>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link
                                        href="/profil/sejarah"
                                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                                    >
                                        Sejarah
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/profil/visi-misi"
                                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                                    >
                                        Visi &amp; Misi
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/profil/struktur-organisasi"
                                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                                    >
                                        Struktur Organisasi
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/profil/tugas-fungsi"
                                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                                    >
                                        Tugas Pokok &amp; Fungsi
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Kontak */}
                        <div>
                            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                                Kontak Kami
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-slate-400">
                                    <MapPin
                                        size={16}
                                        className="text-teal-500 shrink-0 mt-0.5"
                                    />
                                    <span>
                                        Jl. Raya Singaparna, Kabupaten Tasikmalaya,
                                        Jawa Barat
                                    </span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <Phone
                                        size={16}
                                        className="text-teal-500 shrink-0"
                                    />
                                    <a
                                        href="tel:+62265123456"
                                        className="hover:text-teal-400 transition-colors"
                                    >
                                        (0265) 123456
                                    </a>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <Mail
                                        size={16}
                                        className="text-teal-500 shrink-0"
                                    />
                                    <a
                                        href="mailto:pkk@tasikmalayakab.go.id"
                                        className="hover:text-teal-400 transition-colors"
                                    >
                                        pkk@tasikmalayakab.go.id
                                    </a>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-400">
                                    <Globe
                                        size={16}
                                        className="text-teal-500 shrink-0"
                                    />
                                    <a
                                        href="https://tasikmalayakab.go.id"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-teal-400 transition-colors"
                                    >
                                        tasikmalayakab.go.id
                                    </a>
                                </li>
                            </ul>
                            <div className="mt-5 pt-5 border-t border-white/10">
                                <p className="text-xs text-slate-500">Dikelola oleh</p>
                                <p className="text-sm text-slate-300 font-medium mt-0.5">
                                    Dishubkominfo Kab. Tasikmalaya Dan anak pkl
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
                            <p>
                                &copy; {currentYear} TP PKK Kabupaten Tasikmalaya
                            </p>
                            <p>
                                Dikembangkan oleh{" "}
                                <span className="text-teal-500">
                                    Dishubkominfo Kab. Tasikmalaya
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

            <AccessibilityWidget />
        </>
    );
}
