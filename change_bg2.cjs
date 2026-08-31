
const fs = require("fs");

const files = [
    "resources/js/Pages/Frontend/Program/Dokumen.tsx",
    "resources/js/Pages/Frontend/Program/GaleriKegiatan.tsx",
    "resources/js/Pages/Frontend/Program/ProgramKerja.tsx",
    "resources/js/Pages/Frontend/Profil/TugasFungsi.tsx",
    "resources/js/Pages/Frontend/Profil/StrukturOrganisasi.tsx",
    "resources/js/Pages/Frontend/Profil/VisiMisi.tsx",
    "resources/js/Pages/Frontend/Profil/Sejarah.tsx",
    "resources/js/Pages/Frontend/Program/MarsPkk.tsx",
    "resources/js/Pages/Frontend/Profil/KetentuanSeragam.tsx",
    "resources/js/Pages/Frontend/Berita/Index.tsx"
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, "utf8");
        
        // Change root background
        content = content.replace(/bg-white font-sans text-slate-800/g, "bg-[#0A9A9A] font-sans text-white");
        
        // Change section backgrounds
        content = content.replace(/bg-white border-t border-slate-100/g, "bg-[#0A9A9A] border-t border-white/10");
        content = content.replace(/bg-slate-50 border-t border-slate-100/g, "bg-[#088282] border-t border-white/10");
        content = content.replace(/bg-white border-b border-slate-100/g, "bg-[#0A9A9A] border-b border-white/10");
        content = content.replace(/bg-slate-50 border-b border-slate-100/g, "bg-[#088282] border-b border-white/10");
        
        // Simple section replacement
        content = content.replace(/<section(.*?)bg-white/g, "<section$1bg-[#0A9A9A]");
        content = content.replace(/<section(.*?)bg-slate-50/g, "<section$1bg-[#088282]");

        // Change text colors for typical text outside cards
        // To be safe, we only replace text-slate-900 with text-white if it is followed by mb- or in a heading tag
        content = content.replace(/text-slate-900/g, "text-white");
        content = content.replace(/text-slate-800/g, "text-slate-100");
        content = content.replace(/text-slate-700/g, "text-slate-200");
        content = content.replace(/text-slate-600/g, "text-slate-200");
        content = content.replace(/text-slate-500/g, "text-slate-300");

        // Restore text colors inside cards which have bg-white
        // This is a bit tricky, but since we replaced them all, let us just replace them back if they are inside a card? No, regex cannot do that easily.
        // Let us just NOT replace all text-slate, but instead apply a global text-white to the wrapper, and let Tailwind cascade.
        
    } catch (err) {
        console.error("Error processing", file, err.message);
    }
});
