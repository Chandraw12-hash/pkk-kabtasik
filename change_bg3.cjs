
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
        
        // 1. Change root wrapper background and text color
        content = content.replace(/className="min-h-screen flex flex-col bg-white font-sans text-slate-800(.*?)">/g, 
            `className="min-h-screen flex flex-col bg-[#0A9A9A] font-sans text-white$1">`);
        
        // 2. Change section backgrounds (white -> #0A9A9A, slate-50 -> #088282)
        content = content.replace(/<section(.*?)bg-white(.*?border-slate-100)?"/g, `<section$1bg-[#0A9A9A] border-white/10"`);
        content = content.replace(/<section(.*?)bg-slate-50(.*?border-slate-100)?"/g, `<section$1bg-[#088282] border-white/10"`);
        
        // 3. To fix text colors on the dark background without breaking cards:
        // We will replace text-slate-900, text-slate-800, text-slate-700, text-slate-600, text-slate-500, text-slate-400
        // with text-white and text-slate-200 everywhere...
        content = content.replace(/text-slate-900/g, "text-white");
        content = content.replace(/text-slate-800/g, "text-white");
        content = content.replace(/text-slate-700/g, "text-slate-100");
        content = content.replace(/text-slate-600/g, "text-slate-200");
        content = content.replace(/text-slate-500/g, "text-slate-300");
        content = content.replace(/text-slate-400/g, "text-slate-300");
        
        // 4. ...BUT we need to restore them for elements inside cards!
        // Cards typically have bg-white. If a div has bg-white, we inject a class "text-slate-800" so its children can inherit, 
        // OR we just change the background of cards to a semi-transparent white (glassmorphism) which looks premium!
        // The user asked for "Prioritize Visual Excellence: ... glassmorphism".
        // Let us change bg-white on divs (cards) to bg-white/10 backdrop-blur-md border-white/20!
        content = content.replace(/className="(.*?)bg-white(.*?)border-slate-200(.*?)"/g, `className="$1bg-white/10 backdrop-blur-md border-white/20$3"`);
        content = content.replace(/className="(.*?)bg-slate-50(.*?)rounded(.*?)"/g, `className="$1bg-white/5 backdrop-blur-md rounded$3"`);
        
        fs.writeFileSync(file, content);
        console.log("Processed", file);
    } catch (err) {
        console.error("Error processing", file, err.message);
    }
});
