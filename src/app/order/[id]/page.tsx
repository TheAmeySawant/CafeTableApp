"use client";

import { useEffect, useState } from "react";
import { getPusherClient } from "@/lib/pusher";

// Note: we're using a hardcoded order for demo display purposes based on UI design
export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const orderId = params.id;
  const [status, setStatus] = useState<"pending" | "preparing" | "ready" | "served">("preparing");

  useEffect(() => {
    // Connect to Pusher for real-time order updates
    const pusher = getPusherClient();
    if (!pusher) return;

    const channel = pusher.subscribe(`order-${orderId}`);
    channel.bind("status.changed", (data: { status: "pending" | "preparing" | "ready" | "served" }) => {
      setStatus(data.status);
    });

    return () => {
      pusher.unsubscribe(`order-${orderId}`);
    };
  }, [orderId]);

  // UI Helper for active step styling
  const stepStatus = (step: "pending" | "preparing" | "ready" | "served") => {
    const states = ["pending", "preparing", "ready", "served"];
    const currentIndex = states.indexOf(status);
    const stepIndex = states.indexOf(step);
    
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen pb-32 font-body">
      <nav className="fixed top-0 w-full z-50 bg-[#fdf9f2] border-b border-[#f7f3ec] flex justify-center items-center px-6 py-4">
        <h1 className="font-headline text-lg tracking-[0.2em] uppercase font-bold text-[#1c1c18]">The Roasted Bean</h1>
      </nav>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <header className="mb-12 text-center">
          <div className="inline-block px-4 py-1 mb-4 rounded-full bg-[#007f99] text-[#fafdff] text-xs font-label font-bold tracking-widest uppercase">
            Order #{orderId}
          </div>
          <h2 className="font-headline text-4xl lg:text-5xl font-bold mb-2">
            {status === "pending" && "Order Received"}
            {status === "preparing" && "Brewing in Progress"}
            {status === "ready" && "✅ Your order is ready!"}
            {status === "served" && "Enjoy your Coffee"}
          </h2>
          <p className="text-[#534437] opacity-80">
            {status === "ready" ? "Head to the pickup counter to collect your brew." : "We'll notify you when it's ready."}
          </p>
        </header>

        {/* Live Status Stepper */}
        <section className="mb-16 relative">
          <div className="flex justify-between items-center relative z-10 w-full">
            
            {/* Placed */}
            <div className={`flex flex-col items-center gap-3 ${stepStatus('pending') !== 'upcoming' ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${stepStatus('pending') === 'completed' ? 'bg-[#894d00] text-white' : 'border-4 border-[#894d00] text-[#894d00]'}`}>
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className={`font-label text-[10px] uppercase font-bold 
                ${stepStatus('pending') === 'active' ? 'text-[#894d00]' : 'text-[#534437]'}`}>Placed</span>
            </div>

            <div className={`flex-1 h-[2px] mx-2 self-start mt-5 ${stepStatus('preparing') !== 'upcoming' ? 'bg-[#894d00]' : 'bg-[#e6e2db]'}`}></div>

            {/* Preparing */}
            <div className={`flex flex-col items-center gap-3 ${stepStatus('preparing') !== 'upcoming' ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${stepStatus('preparing') === 'completed' ? 'bg-[#894d00] text-white' : 
                  stepStatus('preparing') === 'active' ? 'border-4 border-[#894d00] text-[#894d00]' : 'bg-[#ebe8e1] text-[#534437]'}`}>
                {stepStatus('preparing') === 'completed' ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : (
                  <span className="material-symbols-outlined text-sm">cookie</span>
                )}
              </div>
              <span className={`font-label text-[10px] uppercase font-bold 
                ${stepStatus('preparing') === 'active' ? 'text-[#894d00]' : 'text-[#534437]'}`}>Preparing</span>
            </div>

            <div className={`flex-1 h-[2px] mx-2 self-start mt-5 ${stepStatus('ready') !== 'upcoming' ? 'bg-[#894d00]' : 'bg-[#e6e2db]'}`}></div>

            {/* Ready */}
            <div className={`flex flex-col items-center gap-3 ${stepStatus('ready') !== 'upcoming' ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${stepStatus('ready') === 'completed' ? 'bg-[#894d00] text-white' : 
                  stepStatus('ready') === 'active' ? 'border-4 border-[#894d00] text-[#894d00] ring-4 ring-[#894d00]/10 w-12 h-12' : 'bg-[#ebe8e1] text-[#534437]'}`}>
                {stepStatus('ready') === 'completed' ? (
                  <span className="material-symbols-outlined text-sm">check</span>
                ) : (
                  <span className="material-symbols-outlined">local_cafe</span>
                )}
              </div>
              <span className={`font-label text-[10px] uppercase font-bold 
                ${stepStatus('ready') === 'active' ? 'text-[#894d00]' : 'text-[#534437]'}`}>Ready</span>
            </div>

            <div className={`flex-1 h-[2px] mx-2 self-start mt-5 ${stepStatus('served') !== 'upcoming' ? 'bg-[#894d00]' : 'bg-[#e6e2db]'}`}></div>

            {/* Served */}
            <div className={`flex flex-col items-center gap-3 ${stepStatus('served') !== 'upcoming' ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${stepStatus('served') === 'active' ? 'bg-[#894d00] text-white' : 'bg-[#ebe8e1] text-[#534437]'}`}>
                <span className="material-symbols-outlined text-sm">celebration</span>
              </div>
              <span className={`font-label text-[10px] uppercase font-bold 
                ${stepStatus('served') === 'active' ? 'text-[#894d00]' : 'text-[#534437]'}`}>Served</span>
            </div>
            
          </div>
        </section>

        {/* Order Visualization Hero */}
        <section className="mb-12 rounded-xl overflow-hidden relative h-64 shadow-lg">
          <img 
            alt="Coffee pickup" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
            <span className="text-white/80 font-label text-xs uppercase tracking-[0.2em] mb-1">Pick up at</span>
            <span className="text-white font-headline text-2xl font-bold">Main Bar • Station 02</span>
          </div>
        </section>

        {/* Order Summary */}
        <section className="bg-[#f7f3ec] rounded-lg p-8">
          <h3 className="font-headline text-2xl mb-8 font-bold">Order Summary</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=200&auto=format&fit=crop" alt="Mocha Royale" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-headline text-lg font-bold">Mocha Royale (x2)</h4>
                  <span className="font-semibold text-[#1c1c18]">₹640</span>
                </div>
                <p className="text-sm text-[#534437] italic">Special request: Extra hot</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#d8c3b2]/50 space-y-2">
            <div className="flex justify-between text-[#534437] font-body">
              <span>Subtotal</span>
              <span>₹640.00</span>
            </div>
            <div className="flex justify-between text-[#534437] font-body">
              <span>Service Fee (5%)</span>
              <span>₹32.00</span>
            </div>
            <div className="flex justify-between text-[#1c1c18] font-body font-bold text-xl pt-2">
              <span>Total</span>
              <span className="font-headline text-2xl italic text-[#894d00]">₹672.00</span>
            </div>
          </div>
        </section>

        {/* Help / Support */}
        <div className="mt-8 flex justify-center">
          <button className="bg-[#e6e2db] text-[#894d00] px-8 py-3 rounded-full font-label text-sm uppercase tracking-widest font-bold transition-all duration-300 hover:bg-[#dddad3] active:scale-95">
            Need Help?
          </button>
        </div>
      </main>
    </div>
  );
}
