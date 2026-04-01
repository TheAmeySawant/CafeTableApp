"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  isBestseller?: boolean;
  dietary: ("eco" | "water_drop" | "psychiatry" | "local_fire_department")[];
  available: boolean;
};

const MOCK_MENU: MenuItem[] = [
  {
    id: "1",
    name: "Signature Cappuccino",
    description: "Double shot espresso, steamed milk, micro-foam.",
    category: "Hot Beverages",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200&auto=format&fit=crop",
    isBestseller: true,
    dietary: ["eco", "water_drop"],
    available: true,
  },
  {
    id: "2",
    name: "Nitro Honey Cold Brew",
    description: "12-hour steep with wildflower honey infusion.",
    category: "Cold Brews",
    price: 6.75,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=200&auto=format&fit=crop",
    dietary: ["psychiatry"],
    available: true,
  },
  {
    id: "3",
    name: "Spiced Aztec Mocha",
    description: "Dark cocoa with cinnamon and cayenne heat.",
    category: "Hot Beverages",
    price: 6.25,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=200&auto=format&fit=crop",
    dietary: ["local_fire_department"],
    available: false, // inactive
  },
  {
    id: "4",
    name: "Artisan Almond Croissant",
    description: "Twice-baked with house-made frangipane.",
    category: "Artisan Pastries",
    price: 4.95,
    image: "https://plus.unsplash.com/premium_photo-1675715893473-8a3fc13b43cb?q=80&w=200&auto=format&fit=crop",
    dietary: ["eco"],
    available: true,
  }
];

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>(MOCK_MENU);
  const [activeTab, setActiveTab] = useState("All Items");

  const toggleAvailability = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, available: !item.available } : item));
  };

  const getFilteredItems = () => {
    if (activeTab === "All Items") return items;
    return items.filter(item => item.category === activeTab);
  };

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen font-body flex transition-colors selection:bg-[#ffdcbf] selection:text-[#2d1600]">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        {/* Header Section */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <span className="text-[#894d00] font-label uppercase tracking-[0.2em] text-xs font-bold mb-2 block">Curation Hub</span>
            <h2 className="text-5xl font-headline font-bold text-[#1c1c18] leading-none">Menu Management</h2>
          </div>
          <div className="flex gap-4">
            <div className="bg-[#f1ede6] rounded-full px-6 py-3 flex items-center gap-3 focus-within:ring-2 ring-[#894d00]/20 transition-all">
              <span className="material-symbols-outlined text-[#857466]">search</span>
              <input 
                className="bg-transparent border-none focus:ring-0 text-sm font-medium w-64 placeholder:text-[#534437]/60" 
                placeholder="Search beverages or snacks..." 
                type="text"
              />
            </div>
            <button className="bg-[#ebe8e1] text-[#1c1c18] px-6 py-3 rounded-full font-medium hover:bg-[#dddad3] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">tune</span>
              Advanced Filters
            </button>
          </div>
        </header>

        {/* Category Horizontal Scroll */}
        <section className="mb-10 overflow-x-auto flex gap-3 pb-4" style={{ scrollbarWidth: 'none' }}>
          {["All Items", "Hot Beverages", "Cold Brews", "Artisan Pastries", "Seasonal Specials", "Merchandise"].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-3 rounded-full whitespace-nowrap font-medium text-sm transition-colors ${
                activeTab === cat ? "bg-[#894d00] text-white" : "bg-[#f1ede6] text-[#534437] hover:bg-[#ebe8e1]"
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Menu Table / Content */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-16">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[#f7f3ec]">
                <th className="px-8 py-5 font-headline font-bold text-sm text-[#857466] border-b border-[#f1ede6]">Item Details</th>
                <th className="px-6 py-5 font-headline font-bold text-sm text-[#857466] border-b border-[#f1ede6]">Category</th>
                <th className="px-6 py-5 font-headline font-bold text-sm text-[#857466] border-b border-[#f1ede6]">Price</th>
                <th className="px-6 py-5 font-headline font-bold text-sm text-[#857466] border-b border-[#f1ede6]">Dietary</th>
                <th className="px-6 py-5 font-headline font-bold text-sm text-[#857466] border-b border-[#f1ede6]">Availability</th>
                <th className="px-8 py-5 font-headline font-bold text-sm text-[#857466] border-b border-[#f1ede6] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1ede6]">
              {getFilteredItems().map(item => (
                <tr key={item.id} className={`group hover:bg-[#f7f3ec]/50 transition-colors ${!item.available ? "opacity-60 grayscale-[0.5]" : ""}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img alt={item.name} className="w-16 h-16 rounded-lg object-cover shadow-sm" src={item.image} />
                        {item.isBestseller && (
                          <span className="absolute -top-2 -left-2 bg-[#006579] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-headline font-bold text-lg text-[#1c1c18]">{item.name}</h4>
                        <p className="text-xs text-[#534437] opacity-70">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-xs font-medium px-3 py-1 bg-[#ebe8e1] rounded-full">{item.category}</span>
                  </td>
                  <td className="px-6 py-6" width="10%">
                    <span className="font-headline font-bold text-[#894d00]">₹{item.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex gap-2">
                      {item.dietary.map(icon => (
                        <span key={icon} className={`material-symbols-outlined text-sm ${icon === "eco" ? "text-green-700" : icon === "local_fire_department" ? "text-red-600" : "text-blue-600"}`}>
                          {icon}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={item.available} onChange={() => toggleAvailability(item.id)} />
                      <div className="w-11 h-6 bg-[#e6e2db] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#894d00] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-[#f1ede6] text-[#534437] rounded-full transition-colors"><span className="material-symbols-outlined">edit</span></button>
                      <button className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-8 py-6 flex items-center justify-between bg-[#f7f3ec] border-t border-[#f1ede6]">
            <p className="text-xs font-medium text-[#857466]">Showing 1 to {getFilteredItems().length}</p>
          </div>
        </div>
        
        {/* Asymmetric Bento-style Quick Actions */}
        <section className="mt-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 bg-[#ebe8e1] rounded-xl p-8 flex justify-between items-center relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-headline font-bold text-3xl mb-4 leading-tight">Seasonal Coffee<br/>Update Required</h3>
              <p className="text-sm text-[#534437] max-w-sm mb-6">Our Autumn Roast stock is reaching end of life. Prepare the Winter menu cards and update pricing for the "Snowy Latte".</p>
              <button className="bg-[#894d00] text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-[#a96413] transition-colors">
                Schedule Update
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="absolute right-[-40px] top-[-20px] opacity-[0.05] pointer-events-none">
              <span className="material-symbols-outlined text-[240px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 bg-[#007f99] text-white rounded-xl p-8 flex flex-col justify-between">
            <div>
              <span className="material-symbols-outlined text-4xl mb-4">analytics</span>
              <h3 className="font-headline font-bold text-2xl mb-2">Item Performance</h3>
              <p className="text-sm opacity-80">Track which brews are driving revenue this week.</p>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-4xl font-bold font-headline">+12%</span>
              <span className="text-xs uppercase tracking-widest font-bold">vs last week</span>
            </div>
          </div>
        </section>
      </main>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-50">
        <button className="bg-[#894d00] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group overflow-hidden">
          <span className="material-symbols-outlined text-2xl group-hover:hidden">add</span>
          <span className="hidden group-hover:flex items-center gap-2 px-6 font-bold text-sm whitespace-nowrap">Add New Item</span>
        </button>
      </div>

      <style jsx>{`
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
