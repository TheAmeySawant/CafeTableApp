"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    // In a real implementation this would open the camera
    // For now we simulate scanning a table and redirecting
    setScanning(true);
    setTimeout(() => {
      // Setup demo logic mapping to menu table 4
      router.push("/menu?table=4");
    }, 1500);
  };

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] font-body min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-center items-center px-6 py-4 bg-[#fdf9f2]">
        <h1 className="text-[#1c1c18] font-headline tracking-widest uppercase text-sm font-bold">The Roasted Bean</h1>
        <div className="absolute bottom-0 left-0 bg-[#f7f3ec] h-[1px] w-full"></div>
      </header>
      
      <main className="min-h-screen pt-24 pb-40 px-6 flex flex-col items-center justify-start relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#ffdcbf]/20 blur-3xl -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#fbdcd3]/20 blur-3xl -z-10"></div>
        
        {/* Editorial Hero Section */}
        <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-10">
          <div className="space-y-4">
            <span className="text-[#894d00] font-label uppercase tracking-[0.3em] text-[10px] font-bold">Current Location</span>
            <h2 className="font-headline italic text-5xl md:text-7xl tracking-tight leading-tight">
              Welcome
            </h2>
          </div>
          
          {/* Table Identity Card */}
          <div className="relative w-full aspect-[4/3] max-w-md group">
            <div className="absolute inset-0 bg-[#f1ede6] rounded-lg -rotate-2 scale-[1.02] transition-transform duration-500 group-hover:rotate-0"></div>
            <div className="relative h-full w-full overflow-hidden rounded-lg shadow-[0_20px_40px_rgba(28,28,24,0.06)]">
              <img 
                alt="Coffee Culture" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-left text-white">
                <p className="font-headline text-3xl mb-1">Your Table</p>
                <p className="font-label text-xs uppercase tracking-widest opacity-80">Reserved for your experience</p>
              </div>
            </div>
          </div>
          
          {/* Instructional Block */}
          <div className="space-y-8 bg-[#f7f3ec] p-10 rounded-lg w-full max-w-lg shadow-[0_20px_40px_rgba(28,28,24,0.06)]">
            <div className="space-y-3">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-full shadow-[0_20px_40px_rgba(28,28,24,0.06)]">
                  <span className="material-symbols-outlined text-[#894d00] text-4xl">qr_code_scanner</span>
                </div>
              </div>
              <p className="text-[#534437] font-body leading-relaxed text-lg font-medium">
                Ready for another round?
              </p>
              <p className="text-[#534437]/60 font-label text-xs uppercase tracking-widest leading-relaxed px-4">
                Scan your table QR code to view our digital menu and start ordering your favorites.
              </p>
            </div>
            
            <div className="pt-4">
              <button 
                onClick={handleScan}
                disabled={scanning}
                className="w-full py-5 px-8 bg-[#894d00] text-white rounded-full font-label font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_20px_40px_rgba(28,28,24,0.06)] hover:bg-[#a96413]"
              >
                <span>{scanning ? "Scanning..." : "Open Scanner"}</span>
                {!scanning && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
              </button>
            </div>
          </div>
          
          {/* Signature Tagline */}
          <div className="pt-8">
            <p className="font-headline italic text-[#534437] text-xl">The Digital Sommelier</p>
          </div>
        </div>
      </main>
    </div>
  );
}
