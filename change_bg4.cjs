
const fs = require("fs");

const files = [
    "resources/js/Pages/Frontend/Beranda.tsx"
];

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, "utf8");
        
        // 1. Change root wrapper background and text color
        content = content.replace(/className="min-h-screen flex flex-col bg-white(.*?)text-slate-800(.*?)">/g, 
            `className="min-h-screen flex flex-col bg-[#0A9A9A] text-white$2">`);
        
        // 2. Change section backgrounds (white -> #0A9A9A, slate-50 -> #088282)
        // Only sections that have bg-white or bg-slate-50
        content = content.replace(/<section(.*?)bg-white(.*?border-slate-100)?"/g, `<section$1bg-[#0A9A9A] border-white/10"`);
        content = content.replace(/<section(.*?)bg-slate-50(.*?border-slate-100)?"/g, `<section$1bg-[#088282] border-white/10"`);
        
        // 3. Fix text colors on the dark background
        content = content.replace(/text-slate-900/g, "text-white");
        content = content.replace(/text-slate-800/g, "text-white");
        content = content.replace(/text-slate-700/g, "text-slate-100");
        content = content.replace(/text-slate-600/g, "text-slate-200");
        content = content.replace(/text-slate-500/g, "text-slate-300");
        content = content.replace(/text-slate-400/g, "text-slate-300");
        
        // 4. Change cards to glassmorphism
        content = content.replace(/className="(.*?)bg-white(.*?)border-slate-200(.*?)"/g, `className="$1bg-white/10 backdrop-blur-md border-white/20$3"`);
        content = content.replace(/className="(.*?)bg-slate-50(.*?)rounded(.*?)"/g, `className="$1bg-white/5 backdrop-blur-md rounded$3"`);
        
        // For Beranda, there might be other bg-white things like pagination buttons or forms.
        // Let us just apply the standard replacements for now.
        
        fs.writeFileSync(file, content);
        console.log("Processed", file);
    } catch (err) {
        console.error("Error processing", file, err.message);
    }
});
