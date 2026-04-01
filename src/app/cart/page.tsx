"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define Cart Item Type
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
};

// Hardcoded for demo if localStorage is empty
const DEMO_CART: CartItem[] = [
  {
    id: "1",
    name: "Classic Cappuccino",
    price: 240,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop",
    description: "Double shot espresso with velvety steamed milk foam.",
  },
  {
    id: "4",
    name: "Mocha Royale",
    price: 320,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop",
    description: "Single-origin dark chocolate blended with espresso.",
  }
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);

  useEffect(() => {
    // Attempt to load from localStorage
    const savedCart = localStorage.getItem("cafe_cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        setCartItems(DEMO_CART);
      }
    } else {
      // Use demo cart if none exists
      setCartItems(DEMO_CART);
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cafe_cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updated;
    });
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handlePlaceOrder = async () => {
    setIsPlacing(true);
    router.push("/checkout");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const serviceFee = subtotal * 0.05; // 5% service fee demo
  const total = subtotal + serviceFee;

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen flex flex-col items-center justify-center px-6">
        <span className="material-symbols-outlined text-[64px] text-[#894d00] mb-4 opacity-50">shopping_basket</span>
        <h2 className="font-headline text-3xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-[#534437] mb-8 text-center">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/menu">
          <button className="bg-[#894d00] text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-lg hover:bg-[#a96413] transition-colors">
            Explore Menu
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen font-body relative flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#fdf9f2] border-b border-[#f7f3ec]">
        <div className="flex justify-center items-center px-6 py-5 w-full">
          <h1 className="font-headline text-xl tracking-[0.2em] font-bold text-[#1c1c18] uppercase">The Roasted Bean</h1>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-32 px-6 max-w-2xl mx-auto w-full">
        {/* Editorial Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#894d00] mb-2 block">Review Selection</span>
          <h2 className="font-headline text-4xl md:text-5xl font-bold italic leading-tight">Your Cart</h2>
          <div className="w-12 h-[2px] bg-[#894d00] mt-4"></div>
        </div>

        {/* Cart Items List */}
        <div className="space-y-10">
          {cartItems.map((item) => (
            <div key={item.id} className="flex gap-6 items-start">
              <div className="relative group">
                <img 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-xl transition-all duration-500 shadow-sm" 
                  src={item.image} 
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-headline text-xl font-bold italic">{item.name}</h3>
                  <span className="text-[#1c1c18] font-semibold tracking-tight">₹{item.price}</span>
                </div>
                <p className="text-sm text-[#534437] mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-[#f1ede6] rounded-full px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center text-[#894d00] hover:bg-[#ebe8e1] rounded-full transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-lg">remove</span>
                    </button>
                    <span className="mx-3 font-medium text-sm w-4 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#894d00] hover:bg-[#ebe8e1] rounded-full transition-colors active:scale-95"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[#534437]/40 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Requests */}
        <div className="mt-12 space-y-4">
          <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#534437]" htmlFor="requests">Special Requests</label>
          <textarea 
            id="requests" 
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            className="w-full bg-[#f7f3ec] border-none rounded-xl focus:ring-1 focus:ring-[#894d00] text-[#1c1c18] placeholder:text-[#534437]/40 font-body p-4 transition-all" 
            placeholder="e.g., 'extra hot', 'no foam', 'leave room for cream'" 
            rows={3}
          ></textarea>
        </div>

        {/* Order Summary */}
        <div className="mt-12 pt-8 bg-[#f7f3ec] p-8 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-[#534437] font-medium">Subtotal</span>
            <span className="text-sm font-semibold">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-[#534437] font-medium">Service Fee (5%)</span>
            <span className="text-sm font-semibold">₹{serviceFee.toFixed(2)}</span>
          </div>
          <div className="h-[1px] bg-[#d8c3b2]/30 mb-6"></div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#894d00] block mb-1">Total Amount</span>
              <span className="font-headline text-4xl font-bold italic">₹{total.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#534437] font-medium block">Incl. VAT</span>
            </div>
          </div>
        </div>

        {/* Place Order CTA */}
        <div className="mt-10">
          <button 
            onClick={handlePlaceOrder}
            disabled={isPlacing}
            className="w-full bg-[#894d00] text-white py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(137,77,0,0.2)] hover:bg-[#a96413] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isPlacing ? "Processing..." : "Continue to Checkout"}
            {!isPlacing && <span className="material-symbols-outlined">arrow_forward</span>}
          </button>
        </div>
      </main>
    </div>
  );
}
