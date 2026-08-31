
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
        
        // 1. Change main wrapper background
        content = content.replace(/bg-white font-sans text-slate-800/g, "bg-[#0A9A9A] font-sans text-white");
        
        // 2. Change section backgrounds
        content = content.replace(/className="(.*?)bg-white(.*?)border-slate-100"/g, `className="$1bg-[#0A9A9A]$2border-white/10"`);
        content = content.replace(/className="(.*?)bg-slate-50(.*?)border-slate-100"/g, `className="$1bg-[#088282]$2border-white/10"`);
        
        content = content.replace(/className="(.*?)bg-white(.*?)"/g, (match, p1, p2) => {
            // Only replace if it is a section
            if (p1.includes("py-") || p1.includes("pt-")) {
                return `className="${p1}bg-[#0A9A9A]${p2}"`;
            }
            return match;
        });

        // 3. We have to adjust text colors for headers and paragraphs that are not in cards.
        // It is hard to know if they are in cards. But we can assume typical section headers:
        // text-slate-900 -> text-white
        // text-slate-600 -> text-slate-100
        // text-slate-500 -> text-slate-200
        // We will just do a global replace for the text colors that are typically used for section headers/text, 
        // but wait, if we do global replace, cards will be ruined.
        
        fs.writeFileSync(file, content);
        console.log("Processed", file);
    } catch (err) {
        console.error("Error processing", file, err.message);
    }
});
