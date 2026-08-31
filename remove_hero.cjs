
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
        
        // Match the Hero section starting with the comment up to the closing </section>
        // Use [\s\S]*? to lazily match anything in between.
        // We know the hero section starts with {/* ==================== HERO ==================== */}
        // and ends with </section>
        
        const regex = /\s*\{\/\*\s*={20}\s*HERO\s*={20}\s*\*\/\}\s*<section[\s\S]*?<\/section>\s*/;
        
        const newContent = content.replace(regex, "\n\n            ");
        
        fs.writeFileSync(file, newContent);
        console.log("Removed Hero section from", file);
    } catch (err) {
        console.error("Error processing", file, err.message);
    }
});
