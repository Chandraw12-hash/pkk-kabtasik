
const fs = require("fs");

const files = [
    "resources/js/Pages/Frontend/Beranda.tsx",
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
        
        // ONLY REPLACE bg-white and bg-slate-50 with the green color in className
        content = content.replace(/bg-white/g, "bg-[#0A9A9A]");
        content = content.replace(/bg-slate-50/g, "bg-[#0A9A9A]");
        
        fs.writeFileSync(file, content);
        console.log("Processed", file);
    } catch (err) {
        console.error("Error processing", file, err.message);
    }
});
