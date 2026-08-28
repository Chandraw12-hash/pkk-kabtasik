import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import Navbar from "../Layouts/Navbar";
import Footer from "../Layouts/Footer";
import { 
    ClipboardList, 
    Send, 
    CheckCircle, 
    Smile, 
    Frown, 
    Meh,
    Heart,
    Star
} from "lucide-react";
import Swal from "sweetalert2";

export default function SurveyKepuasan() {
    const [rating, setRating] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        saran: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!rating) {
            Swal.fire({
                icon: "warning",
                title: "Opps!",
                text: "Silakan pilih tingkat kepuasan terlebih dahulu.",
                confirmButtonColor: "#0f766e",
            });
            return;
        }

        setIsSubmitting(true);
        
        // Simulasi submit data
        setTimeout(() => {
            setIsSubmitting(false);
            Swal.fire({
                icon: "success",
                title: "Terima Kasih!",
                text: "Survey Anda telah berhasil dikirimkan.",
                confirmButtonColor: "#0f766e",
            }).then(() => {
                // Reset form
                setRating(null);
                setFormData({
                    saran: "",
                });
            });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const ratingOptions = [
        { value: 1, label: "Sangat Kurang", icon: Frown, color: "text-red-500", bg: "bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-500", activeBg: "bg-red-100 border-red-500 ring-2 ring-red-200" },
        { value: 2, label: "Kurang", icon: Meh, color: "text-orange-500", bg: "bg-orange-50 hover:bg-orange-100 border-orange-200 hover:border-orange-500", activeBg: "bg-orange-100 border-orange-500 ring-2 ring-orange-200" },
        { value: 3, label: "Cukup", icon: Smile, color: "text-yellow-500", bg: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200 hover:border-yellow-500", activeBg: "bg-yellow-100 border-yellow-500 ring-2 ring-yellow-200" },
        { value: 4, label: "Baik", icon: Heart, color: "text-green-500", bg: "bg-green-50 hover:bg-green-100 border-green-200 hover:border-green-500", activeBg: "bg-green-100 border-green-500 ring-2 ring-green-200" },
        { value: 5, label: "Sangat Baik", icon: Star, color: "text-teal-500", bg: "bg-teal-50 hover:bg-teal-100 border-teal-200 hover:border-teal-500", activeBg: "bg-teal-100 border-teal-500 ring-2 ring-teal-200" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 pt-14 font-['Poppins',_sans-serif]">
            <Head title="Survey Kepuasan Masyarakat - TP PKK Kab. Tasikmalaya" />
            <Navbar />

            {/* Header Section */}
            <div className="relative bg-teal-700 py-16 md:py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-yellow-400 rounded-full blur-3xl mix-blend-multiply" />
                    <div className="absolute top-1/2 left-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl mix-blend-multiply" />
                </div>
                
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                        <ClipboardList className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                        Survey Kepuasan Masyarakat
                    </h1>
                    <p className="text-teal-50 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Pendapat dan masukan Anda sangat berharga bagi kami untuk terus meningkatkan 
                        pelayanan dan program kerja Tim Penggerak PKK Kabupaten Tasikmalaya.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-20 relative z-20">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-1 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-yellow-400" />
                    
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-10">
                        
                        {/* Rating Section */}
                        <div className="mb-10 text-center">
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Seberapa puas Anda dengan program/kegiatan TP PKK?</h3>
                            <p className="text-sm text-slate-500 mb-6">Pilih salah satu ikon di bawah ini yang paling mewakili penilaian Anda.</p>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4">
                                {ratingOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setRating(opt.value)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                                            rating === opt.value ? opt.activeBg : opt.bg
                                        }`}
                                    >
                                        <opt.icon 
                                            size={32} 
                                            className={`${rating === opt.value ? opt.color : 'text-slate-400'} mb-3 transition-colors`} 
                                            strokeWidth={rating === opt.value ? 2.5 : 2}
                                        />
                                        <span className={`text-xs font-semibold ${rating === opt.value ? opt.color : 'text-slate-500'}`}>
                                            {opt.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Kritik & Saran */}
                        <h3 className="text-lg font-semibold text-slate-800 mb-6">
                            Kritik & Saran
                        </h3>

                        <div className="mb-10">
                            <label htmlFor="saran" className="block text-sm font-medium text-slate-700 mb-2">Pesan, Kritik, atau Saran Anda <span className="text-red-500">*</span></label>
                            <textarea
                                id="saran"
                                name="saran"
                                value={formData.saran}
                                onChange={handleChange}
                                required
                                rows={5}
                                placeholder="Tuliskan masukan Anda terkait kinerja dan program TP PKK..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors outline-none resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold shadow-lg transition-all ${
                                    isSubmitting 
                                        ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                                        : 'bg-teal-600 hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Kirim Survey
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </div>
    );
}
