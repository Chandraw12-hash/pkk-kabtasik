import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { LogIn, LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const { auth } = usePage().props as any;
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href={route("fe.beranda")}>
                        <div className="flex items-center gap-3">
                            <img
                                src="/assets/logo/logotasik.png"
                                alt="Logo Kab. Tasikmalaya"
                                className="h-10 w-auto drop-shadow-sm"
                            />
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-slate-800 leading-tight">
                                    SPBE
                                </span>
                                <span className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                                    Kabupaten Tasikmalaya
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* Login/Dashboard Button */}
                    <div>
                        {auth.user ? (
                            <Link
                                href={route("be.dashboard")}
                                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href={route("login")}
                                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-blue-700 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-lg shadow-blue-700/30 hover:shadow-blue-700/40"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
