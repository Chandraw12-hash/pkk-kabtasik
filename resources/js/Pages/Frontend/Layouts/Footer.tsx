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
    ArrowUpRight,
} from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/assets/logo/logotasik.png"
                                alt="Logo Kab. Tasikmalaya"
                                className="h-12 w-auto"
                            />
                            <div>
                                <h3 className="text-white font-bold text-lg leading-tight">
                                    PKK
                                </h3>
                                <p className="text-teal-400 text-xs font-medium">
                                    Kabupaten Tasikmalaya
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed mb-6">
                            Pemberdayaan dan Kesejahteraan Keluarga Kabupaten Tasikmalaya.
                            Sinergi pemberdayaan masyarakat menuju kemajuan berbasis kearifan lokal.
                        </p>
                        <div className="flex gap-3">
                            {/* PERBAIKAN: Tag <a> ditambahkan kembali */}
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-teal-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-teal-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-teal-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="YouTube"
                            >
                                <Youtube size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-teal-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                            Program PKK
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                                    <span>10 Program Pokok PKK</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                                    <span>Pokja I - IV</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                                    <span>Kegiatan PKK</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                                    <span>Berita Terkini</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Informasi */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                            Informasi
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                                    <span>Tentang PKK</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                                    <span>Visi & Misi</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                                    <span>Struktur Organisasi</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1 group">
                                    <span>Kontak</span>
                                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kontak & Dinas */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                            Kontak Kami
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-slate-400">
                                <MapPin size={18} className="text-teal-400 flex-shrink-0 mt-0.5" />
                                <span>Jl. Raya Singaparna, Kabupaten Tasikmalaya, Jawa Barat</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Phone size={18} className="text-teal-400 flex-shrink-0" />
                                <a href="tel:+628123456789" className="hover:text-teal-400 transition-colors">
                                    (0265) 123456
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Mail size={18} className="text-teal-400 flex-shrink-0" />
                                <a href="mailto:pkk@tasikmalayakab.go.id" className="hover:text-teal-400 transition-colors">
                                    pkk@tasikmalayakab.go.id
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400">
                                <Globe size={18} className="text-teal-400 flex-shrink-0" />
                                <a href="#" className="hover:text-teal-400 transition-colors">
                                    www.pkk.tasikmalayakab.go.id
                                </a>
                            </li>
                        </ul>

                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Dikelola oleh:
                            </p>
                            <p className="text-sm text-slate-400 font-medium">
                                Dinas Perhubungan Komunikasi dan Informatika
                            </p>
                            <p className="text-xs text-slate-500">
                                Kabupaten Tasikmalaya
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>&copy; {currentYear}</span>
                            <span className="text-slate-700">|</span>
                            <span>PKK Kabupaten Tasikmalaya</span>
                            <span className="text-slate-700">|</span>
                            <span className="text-slate-400 text-xs">Sejahtera &amp; Mandiri</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                            <Link href="#" className="hover:text-teal-400 transition-colors">
                                Kebijakan Privasi
                            </Link>
                            <span className="text-slate-700">|</span>
                            <Link href="#" className="hover:text-teal-400 transition-colors">
                                Syarat &amp; Ketentuan
                            </Link>
                            <span className="text-slate-700">|</span>
                            <Link href="#" className="hover:text-teal-400 transition-colors">
                                Sitemap
                            </Link>
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-[10px] text-slate-600">
                            Dikembangkan oleh <span className="text-teal-400 font-medium">Dinas Perhubungan Komunikasi dan Informatika</span> Kabupaten Tasikmalaya
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
