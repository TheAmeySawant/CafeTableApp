"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [subtotal, setSubtotal] = useState(0);
  const [itemsList, setItemsList] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cafe_cart");
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setItemsList(items);
        const st = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        setSubtotal(st);
      } catch (e) {
        // Handle err
      }
    }
  }, []);

  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  const handlePayment = (method: "ONLINE" | "CASH") => {
    setIsProcessing(true);
    // Simulate order processing API
    setTimeout(() => {
      localStorage.removeItem("cafe_cart");
      // Hardcoded order ID for demo
      router.push("/order/RB-88291");
    }, 2000);
  };

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen pb-40 font-body">
      <header className="fixed top-0 w-full z-50 bg-[#fdf9f2] flex justify-center items-center px-6 py-6 border-b border-[#f7f3ec]">
        <h1 className="font-headline uppercase tracking-[0.2em] text-lg font-bold text-[#894d00]">The Roasted Bean</h1>
      </header>

      <main className="pt-28 px-6 max-w-2xl mx-auto">
        {/* Brand Greeting */}
        <section className="mb-12 text-center">
          <h2 className="font-headline text-4xl mb-4 leading-tight italic font-bold">Checkout</h2>
          <p className="text-[#534437] font-medium tracking-wide text-sm uppercase">Table 4</p>
        </section>

        {/* Order Summary Card */}
        <section className="mb-10 bg-[#f7f3ec] rounded-lg p-8">
          <h3 className="font-headline text-xl mb-6 font-bold">Order Breakdown</h3>
          <div className="space-y-6">
            {itemsList.map(item => (
              <div key={item.id} className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-[#534437] italic line-clamp-1">{item.description}</p>
                </div>
                <p className="font-medium">₹{item.price * item.quantity}</p>
              </div>
            ))}

            <div className="pt-6 mt-6 bg-[#e6e2db] h-[1px] w-full"></div>

            <div className="space-y-2">
              <div className="flex justify-between text-[#534437]">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#534437]">
                <span>Service Fee (5%)</span>
                <span>₹{serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-headline font-bold pt-2 text-[#894d00]">
                <span>Total Amount</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Options Header */}
        <section className="mb-6">
          <p className="uppercase tracking-widest font-bold text-xs text-[#534437]">Choose Payment Method</p>
        </section>

        {/* Bento Grid Payment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {/* Pay Online Option */}
          <button 
            onClick={() => handlePayment("ONLINE")}
            disabled={isProcessing}
            className="group flex flex-col items-start p-6 bg-[#894d00] text-white rounded-lg text-left transition-all hover:bg-[#a96413] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            <div className="bg-white/20 p-3 rounded-full mb-8">
              <span className="material-symbols-outlined text-3xl">payments</span>
            </div>
            <h4 className="font-headline text-2xl mb-2 font-bold">{isProcessing ? "Processing..." : "Pay Online"}</h4>
            <p className="text-sm opacity-80 mb-6">UPI, Credit/Debit Cards, or Netbanking. Secure & instant.</p>
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-xl opacity-70">credit_card</span>
              <span className="material-symbols-outlined text-xl opacity-70">account_balance</span>
              <span className="material-symbols-outlined text-xl opacity-70">qr_code_2</span>
            </div>
          </button>

          {/* Pay by Cash Option */}
          <button 
            onClick={() => handlePayment("CASH")}
            disabled={isProcessing || subtotal === 0}
            className="group flex flex-col items-start p-6 bg-[#ebe8e1] text-[#1c1c18] rounded-lg text-left transition-all hover:bg-[#e6e2db] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
          >
            <div className="bg-[#894d00]/10 p-3 rounded-full mb-8">
              <span className="material-symbols-outlined text-3xl text-[#894d00]">hail</span>
            </div>
            <h4 className="font-headline text-2xl mb-2 font-bold">Pay by Cash</h4>
            <p className="text-sm text-[#534437] mb-6">Call a server to your table to settle the bill manually.</p>
            <div className="flex items-center gap-2 text-[#894d00] font-semibold text-sm">
              <span>CALL SERVER</span>
              <span className="material-symbols-outlined text-lg">notifications_active</span>
            </div>
          </button>
        </div>

        {/* Visual Anchor: Experience Image */}
        <div className="relative h-64 rounded-lg overflow-hidden mb-12 shadow-lg">
          <img 
            alt="Artisan Roast Experience" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
            <p className="text-white italic font-headline text-lg">"The perfect cup is a journey from soil to soul."</p>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="text-center text-[#534437] text-xs px-8 leading-relaxed">
          <p>The Roasted Bean • Est. 2014</p>
          <p className="mt-1">By proceeding, you agree to our Terms of Service & Privacy Policy.</p>
        </footer>
      </main>
    </div>
  );
}
