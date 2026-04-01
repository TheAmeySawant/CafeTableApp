"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = ["Hot Beverages", "Cold Brews", "Espresso Bar", "House Specials", "Small Bites"];

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isSpecial?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Classic Cappuccino",
    description: "Double shot espresso with velvety steamed milk foam.",
    price: 240,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop",
    category: "Hot Beverages"
  },
  {
    id: "2",
    name: "Vanilla Latte",
    description: "Infused with organic Madagascar vanilla beans.",
    price: 280,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=600&auto=format&fit=crop",
    category: "Hot Beverages"
  },
  {
    id: "3",
    name: "Cortado",
    description: "Equal parts espresso and warm milk for a bold finish.",
    price: 210,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop",
    category: "Espresso Bar"
  },
  {
    id: "4",
    name: "Mocha Royale",
    description: "Single-origin dark chocolate blended with espresso.",
    price: 320,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop",
    category: "House Specials"
  },
  {
    id: "5",
    name: "Artisan Tasting Flight",
    description: "A trio of different coffee roasts in glass tasters.",
    price: 450,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop",
    category: "House Specials",
    isSpecial: true
  }
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("Hot Beverages");
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const handleAddToCart = (item: MenuItem) => {
    setCartCount(prev => prev + 1);
    setCartTotal(prev => prev + item.price);
    // In a real app we'd save to local storage or context here
  };

  const filteredItems = activeCategory === "All" || !activeCategory
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen font-body relative">
      <header className="fixed top-0 w-full z-50 bg-[#fdf9f2] flex justify-between items-center px-6 py-4 border-b border-[#f7f3ec]">
        <h1 className="w-full text-center font-headline uppercase tracking-[0.2em] text-sm font-bold text-[#1c1c18]">The Roasted Bean</h1>
      </header>

      <main className="pt-24 pb-32 px-4 max-w-screen-xl mx-auto">
        {/* Hero Section */}
        <section className="mb-8">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[#894d00] mb-2 font-bold">Artisan Selection</p>
          <h2 className="font-headline text-4xl leading-tight text-[#1c1c18] mb-4">
            Curated Brews for the <span className="italic">Connoisseur</span>
          </h2>
          <div className="h-1 w-12 bg-[#894d00] rounded-full"></div>
        </section>

        {/* Horizontal Scroll Categories */}
        <nav className="sticky top-[60px] z-30 bg-[#fdf9f2]/95 backdrop-blur-md -mx-4 px-4 py-4 mb-6 overflow-x-auto flex space-x-6 hide-scrollbar shadow-sm">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 font-label text-sm font-semibold transition-opacity pb-1 border-b-2
                ${activeCategory === cat ? "text-[#894d00] border-[#894d00] opacity-100" : "text-[#534437] border-transparent opacity-60 hover:opacity-100"}`}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
          {filteredItems.map(item => (
            item.isSpecial ? (
              <div key={item.id} className="col-span-2 group mt-4">
                <div className="relative h-48 rounded-xl overflow-hidden bg-[#e6e2db] shadow-sm transition-transform duration-500 group-hover:scale-[1.01]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-6">
                    <span className="bg-[#894d00] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mb-2 inline-block">Staff Pick</span>
                    <h3 className="font-headline text-2xl text-white">{item.name}</h3>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="absolute bottom-4 right-6 bg-white text-[#894d00] px-4 py-2 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform"
                  >
                    + ₹{item.price}
                  </button>
                </div>
              </div>
            ) : (
              <div key={item.id} className="group">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3 bg-[#e6e2db] shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="absolute bottom-3 right-3 bg-[#894d00] text-white p-2 rounded-full shadow-lg active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>
                <h3 className="font-headline text-lg mb-1 group-hover:text-[#894d00] transition-colors">{item.name}</h3>
                <p className="font-body text-xs text-[#534437] mb-2 line-clamp-2 leading-relaxed">{item.description}</p>
                <p className="font-label font-bold text-[#1c1c18]">₹{item.price}</p>
              </div>
            )
          ))}
        </div>
      </main>

      {/* Floating View Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md animate-fade-in-up">
          <Link href="/cart">
            <button className="w-full bg-[#894d00] text-white py-4 px-6 rounded-full flex items-center justify-between shadow-xl shadow-[#894d00]/30 active:scale-95 transition-all">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">shopping_basket</span>
                <span className="font-label font-bold tracking-wide text-sm">View Cart · {cartCount} Items</span>
              </div>
              <span className="font-label font-bold text-sm">₹{cartTotal}</span>
            </button>
          </Link>
        </div>
      )}
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate3d(-50%, 20px, 0); }
          to { opacity: 1; transform: translate3d(-50%, 0, 0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
