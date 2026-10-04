import { Head, Link } from "@inertiajs/react";
import { Droplets, Home, Recycle, ShieldAlert } from "lucide-react";
import DasawismaLayout from "@/Components/Layout/DasawismaLayout";
import Toast from "@/Components/UI/Toast";
import StatsCard from "@/Components/Dasawisma/StatsCard";

const indicators = [
    { title: "Kondisi rumah", detail: "Catat jumlah rumah kurang sehat pada kolom yang tersedia di rekap kegiatan Dasa Wisma.", icon: Home },
    { title: "Sampah rumah tangga", detail: "Periksa pencatatan ketersediaan tempat sampah sesuai kondisi dan pedoman lingkungan setempat.", icon: Recycle },
    { title: "Saluran pembuangan", detail: "Gunakan kolom SPAL untuk merangkum ketersediaan fasilitas pada wilayah.", icon: Droplets },
    { title: "Tindak lanjut", detail: "Simpan catatan kondisi dan koordinasikan verifikasi dengan petugas/instansi yang berwenang.", icon: ShieldAlert },
];

export default function TidakLayakHuni() {
    return (
        <DasawismaLayout>
            <Head title="Panduan Tidak Layak Huni" />
            <Toast />
            <main className="mx-auto w-full max-w-6xl space-y-6 p-4 font-['Poppins',_sans-serif] sm:p-6 lg:p-8">
                <nav className="text-xs font-medium text-slate-500 dark:text-slate-400" aria-label="Breadcrumb"><Link href="/dasawisma" className="hover:text-teal-700">Dasawisma</Link><span className="mx-2">/</span>Panduan<span className="mx-2">/</span><span className="text-teal-700 dark:text-teal-300">Tidak Layak Huni</span></nav>
                <header><h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">Rumah Tidak Layak Huni</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">Gunakan panduan ini untuk pencatatan awal dan tindak lanjut. Penetapan kondisi rumah harus mengikuti kriteria resmi, bukan perkiraan dari aplikasi.</p></header>
                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indikator dalam format rekap">
                    <StatsCard label="Rumah kurang sehat" value="—" icon={Home} tone="rose" />
                    <StatsCard label="Tempat sampah" value="—" icon={Recycle} />
                    <StatsCard label="SPAL" value="—" icon={Droplets} />
                    <StatsCard label="Verifikasi/tindak lanjut" value="—" icon={ShieldAlert} tone="amber" />
                </section>
                <section className="grid grid-cols-1 gap-3 md:grid-cols-2" aria-label="Panduan pencatatan">
                    {indicators.map(({ title, detail, icon: Icon }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><span className="inline-flex rounded-xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"><Icon size={19} aria-hidden="true" /></span><h2 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{detail}</p></article>)}
                </section>
                <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">Aplikasi tidak menetapkan ambang teknis kelayakan. Rujuk kriteria pemerintah/instansi terkait sebelum menandai atau mengusulkan bantuan untuk suatu rumah.</p>
            </main>
        </DasawismaLayout>
    );
}
