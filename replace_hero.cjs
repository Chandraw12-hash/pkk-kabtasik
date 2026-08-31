
const fs = require("fs");
const path = require("path");

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
    let content = fs.readFileSync(file, "utf8");
    
    // Replace the block containing the hero image in the absolute inset-0 div
    // We want to turn:
    // <div className="absolute inset-0">
    //     <img ... />
    //     <div className="absolute inset-0 bg-black/55" />
    // </div>
    // Into:
    // <div className="absolute inset-0 bg-teal-800" />
    
    // Use regex to match the outer div
    content = content.replace(/<div className="absolute inset-0">\s*<img[\s\S]*?src="\/assets\/images\/hero\.jpg"[\s\S]*?\/>\s*<div className="absolute inset-0 bg-black\/55" \/>\s*<\/div>/g, 
        `<div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900" />`);
        
    fs.writeFileSync(file, content);
    console.log("Updated", file);
});
