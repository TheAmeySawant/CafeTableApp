"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

type TableData = {
  id: string;
  name: string;
  section: string;
  qrImage: string;
  isActive: boolean;
  status: "active" | "maintenance";
};

const MOCK_TABLES: TableData[] = [
  {
    id: "1",
    name: "Table 1",
    section: "Indoor Section",
    qrImage: "https://images.unsplash.com/photo-1595054374351-ce0b91e9f1eb?q=80&w=200&auto=format&fit=crop", // placeholder for QR
    isActive: true,
    status: "active"
  },
  {
    id: "2",
    name: "Table 2",
    section: "Window Seating",
    qrImage: "https://images.unsplash.com/photo-1595054374351-ce0b91e9f1eb?q=80&w=200&auto=format&fit=crop",
    isActive: true,
    status: "active"
  },
  {
    id: "3",
    name: "Table 3",
    section: "Maintenance",
    qrImage: "https://images.unsplash.com/photo-1595054374351-ce0b91e9f1eb?q=80&w=200&auto=format&fit=crop",
    isActive: false,
    status: "maintenance"
  },
  {
    id: "4",
    name: "Table 4",
    section: "Outdoor Terrace",
    qrImage: "https://images.unsplash.com/photo-1595054374351-ce0b91e9f1eb?q=80&w=200&auto=format&fit=crop",
    isActive: true,
    status: "active"
  }
];

export default function TablesManagementPage() {
  const [tables, setTables] = useState<TableData[]>(MOCK_TABLES);

  const toggleTableStatus = (id: string) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  };

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen font-body flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        {/* Header Section */}
        <header className="flex justify-between items-end mb-16">
          <div className="max-w-2xl">
            <span className="text-[#894d00] font-label font-bold uppercase tracking-[0.2em] text-xs">Floor Management</span>
            <h2 className="font-headline text-5xl mt-4 mb-6 leading-tight font-bold">Table & QR Assets</h2>
            <p className="text-[#534437] leading-relaxed max-w-lg">
              Manage your physical café space and digital touchpoints. Generate high-resolution QR codes for contactless ordering and track table occupancy in real-time.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-[#ebe8e1] text-[#894d00] px-8 py-3 rounded-full font-label font-bold hover:bg-[#dddad3] transition-colors">
              Print All QR Tags
            </button>
            <button className="bg-[#894d00] text-white px-8 py-3 rounded-full font-label font-bold hover:bg-[#a96413] transition-colors flex items-center gap-2 shadow-lg">
              <span className="material-symbols-outlined text-lg">add</span>
              Add New Table
            </button>
          </div>
        </header>

        {/* Stats Bento Section */}
        <section className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-8 bg-[#f7f3ec] rounded-xl p-10 flex items-center justify-between overflow-hidden relative group shadow-sm">
            <div className="z-10">
              <h3 className="font-headline text-3xl mb-2 font-bold">Artisan Branding</h3>
              <p className="text-[#534437] max-w-xs">All QR codes are automatically generated with your signature caramel tint and café logo.</p>
            </div>
            <div className="relative w-48 h-48 bg-white p-4 rounded-xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500 z-10">
              <img alt="Sample QR Code" className="w-full h-full object-contain" src="https://images.unsplash.com/photo-1595054374351-ce0b91e9f1eb?q=80&w=400&auto=format&fit=crop" />
            </div>
            {/* Background Decorative Element */}
            <div className="absolute -right-10 -bottom-10 opacity-5 w-64 h-64 border-[40px] border-[#894d00] rounded-full"></div>
          </div>
          <div className="col-span-4 bg-[#007f99] text-white rounded-xl p-10 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-4xl">sensors</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Live</span>
            </div>
            <div>
              <span className="text-4xl font-headline font-bold block mb-1">
                {tables.filter(t => t.isActive).length} / {tables.length}
              </span>
              <p className="opacity-80 font-label text-sm uppercase">Active Tables</p>
            </div>
          </div>
        </section>

        {/* Table Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {tables.map(table => (
            <div key={table.id} className={`bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 ${table.status === 'maintenance' ? 'opacity-75 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-headline text-2xl font-bold">{table.name}</h4>
                  <span className={`${table.status === 'maintenance' ? 'text-[#534437]' : 'text-[#894d00]'} text-xs font-bold font-label uppercase`}>{table.section}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={table.isActive} onChange={() => toggleTableStatus(table.id)} />
                  <div className="w-11 h-6 bg-[#ebe8e1] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#894d00] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              <div className="bg-[#f7f3ec] aspect-square rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
                {table.status === 'maintenance' ? (
                  <div className="absolute inset-0 bg-red-500/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-600 text-4xl">block</span>
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[radial-gradient(#894d00_0.5px,transparent_0.5px)] [background-size:4px_4px] opacity-10"></div>
                    <div className="relative bg-white p-4 rounded-lg shadow-sm">
                      <img alt={`QR ${table.name}`} className="w-32 h-32" src={table.qrImage} />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  disabled={table.status === 'maintenance'}
                  className={`flex-1 py-3 rounded-full text-xs font-bold font-label flex items-center justify-center gap-2 transition-colors
                    ${table.status === 'maintenance' ? 'bg-[#ebe8e1] text-[#534437]/40 cursor-not-allowed' : 'bg-[#ebe8e1] text-[#1c1c18] hover:bg-[#dddad3]'}`}
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  PNG
                </button>
                <button 
                  disabled={table.status === 'maintenance'}
                  className={`flex-1 py-3 rounded-full text-xs font-bold font-label flex items-center justify-center gap-2 transition-colors
                    ${table.status === 'maintenance' ? 'bg-[#ebe8e1] text-[#534437]/40 cursor-not-allowed' : 'bg-[#ebe8e1] text-[#1c1c18] hover:bg-[#dddad3]'}`}
                >
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                  PDF
                </button>
              </div>
            </div>
          ))}

          {/* Add Table Action Card */}
          <div className="border-2 border-dashed border-[#d8c3b2] rounded-xl p-6 flex flex-col items-center justify-center gap-4 group hover:bg-[#f7f3ec] transition-colors cursor-pointer min-h-[350px]">
            <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl text-[#894d00]">add_circle</span>
            </div>
            <div className="text-center">
              <p className="font-headline text-xl font-bold mb-2">Add New Station</p>
              <p className="text-[#534437] text-sm px-4">Instantly generate a unique QR for a new table.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Contextual Status Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-[#ebe8e1] rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl">
          <div className="w-3 h-3 bg-[#007f99] rounded-full animate-pulse"></div>
          <span className="text-sm font-label font-bold text-[#1c1c18] uppercase tracking-widest">Floor Sync: Online</span>
          <div className="h-4 w-px bg-[#d8c3b2] mx-2"></div>
          <p className="text-xs font-headline italic text-[#534437]">Last updated: 2 mins ago</p>
        </div>
      </div>
    </div>
  );
}
