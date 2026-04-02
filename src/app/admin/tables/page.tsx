"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/components/ui/ToastProvider";
import { Skeleton } from "@/components/ui/Skeleton";
import QRCode from "qrcode";

type TableData = {
  id: string;
  cafeId: string;
  tableNumber: number;
  qrCodeUrl: string | null;
  isActive: boolean;
  qrDataUrl?: string; // Generated client-side
};

export default function TablesManagementPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const { showToast } = useToast();

  const fetchTables = async () => {
    try {
      const res = await fetch("/api/admin/tables");
      if (!res.ok) throw new Error("Failed to fetch tables");
      
      const data = await res.json();
      
      // Generate QR codes for each table
      const processedTables = await Promise.all(
        (data.tables || []).map(async (t: TableData) => {
          if (t.qrCodeUrl) {
            try {
              t.qrDataUrl = await QRCode.toDataURL(t.qrCodeUrl, {
                color: { dark: '#894d00', light: '#ffffff' },
                margin: 2
              });
            } catch (e) {}
          }
          return t;
        })
      );
      
      setTables(processedTables);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const addTable = async () => {
    setIsAdding(true);
    try {
      // Find the next available table number
      const nextNumber = tables.length > 0 
        ? Math.max(...tables.map(t => t.tableNumber)) + 1 
        : 1;

      // In a real multi-tenant app, cafeId comes from the session/context
      // We hardcode a dummy one for now, or let the API use the user's cafeId
      const res = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cafeId: "default", tableNumber: nextNumber }),
      });

      if (!res.ok) throw new Error("Failed to create table");
      showToast(`Table ${nextNumber} created successfully`, "success");
      fetchTables();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTableStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setTables(prev => prev.map(t => t.id === id ? { ...t, isActive: !currentStatus } : t));
      
      const res = await fetch(`/api/admin/tables/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      showToast("Table status updated", "success");
    } catch (err: any) {
      // Revert on error
      setTables(prev => prev.map(t => t.id === id ? { ...t, isActive: currentStatus } : t));
      showToast(err.message, "error");
    }
  };

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen font-body flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <header className="flex justify-between items-end mb-16">
          <div className="max-w-2xl">
            <span className="text-[#894d00] font-label font-bold uppercase tracking-[0.2em] text-xs">Floor Management</span>
            <h2 className="font-headline text-5xl mt-4 mb-6 leading-tight font-bold">Table & QR Assets</h2>
            <p className="text-[#534437] leading-relaxed max-w-lg">
              Manage your physical café space and digital touchpoints. Generate high-resolution QR codes for contactless ordering and track table occupancy.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="bg-[#ebe8e1] text-[#894d00] px-8 py-3 rounded-full font-label font-bold hover:bg-[#dddad3] transition-colors">
              Print All QR Tags
            </button>
            <button 
              onClick={addTable}
              disabled={isAdding}
              className="bg-[#894d00] text-white px-8 py-3 rounded-full font-label font-bold hover:bg-[#a96413] transition-colors flex items-center gap-2 shadow-lg disabled:opacity-70"
            >
              <span className="material-symbols-outlined text-lg">{isAdding ? 'hourglass_empty' : 'add'}</span>
              Add New Table
            </button>
          </div>
        </header>

        <section className="grid grid-cols-12 gap-8 mb-16">
          <div className="col-span-8 bg-[#f7f3ec] rounded-xl p-10 flex items-center justify-between overflow-hidden relative group shadow-sm">
            <div className="z-10">
              <h3 className="font-headline text-3xl mb-2 font-bold">Artisan Branding</h3>
              <p className="text-[#534437] max-w-xs">All QR codes are automatically generated with your signature caramel tint and café logo.</p>
            </div>
            <div className="relative w-48 h-48 bg-white p-4 rounded-xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500 z-10 flex items-center justify-center">
               <span className="material-symbols-outlined text-[#894d00] text-6xl">qr_code_2</span>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-5 w-64 h-64 border-[40px] border-[#894d00] rounded-full"></div>
          </div>
          <div className="col-span-4 bg-[#007f99] text-white rounded-xl p-10 flex flex-col justify-between shadow-sm">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-4xl">sensors</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Live</span>
            </div>
            <div>
              <span className="text-4xl font-headline font-bold block mb-1">
                {loading ? <Skeleton width={60} height={40} className="bg-white/20" /> : `${tables.filter(t => t.isActive).length} / ${tables.length}`}
              </span>
              <p className="opacity-80 font-label text-sm uppercase">Active Tables</p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-6">
                <Skeleton height={24} width="60%" className="mb-2" />
                <Skeleton height={16} width="30%" className="mb-6" />
                <Skeleton height={300} width="100%" className="rounded-xl mb-6" />
                <div className="flex gap-2">
                  <Skeleton height={40} width="50%" className="rounded-full" />
                  <Skeleton height={40} width="50%" className="rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {tables.map(table => (
              <div key={table.id} className={`bg-white rounded-xl p-6 group hover:shadow-xl transition-all duration-300 ${!table.isActive ? 'opacity-75 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-headline text-2xl font-bold">Table {table.tableNumber}</h4>
                    <span className={`${!table.isActive ? 'text-[#534437]' : 'text-[#894d00]'} text-xs font-bold font-label uppercase`}>
                      {table.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={table.isActive} onChange={() => toggleTableStatus(table.id, table.isActive)} />
                    <div className="w-11 h-6 bg-[#ebe8e1] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#894d00] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>

                <div className="bg-[#f7f3ec] aspect-square rounded-xl flex items-center justify-center mb-6 relative overflow-hidden">
                  {!table.isActive ? (
                    <div className="absolute inset-0 bg-red-500/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-red-600 text-4xl">block</span>
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(#894d00_0.5px,transparent_0.5px)] [background-size:4px_4px] opacity-10"></div>
                      <div className="relative bg-white p-4 rounded-lg shadow-sm">
                        {table.qrDataUrl ? (
                          <img alt={`QR Table ${table.tableNumber}`} className="w-32 h-32" src={table.qrDataUrl} />
                        ) : (
                           <span className="material-symbols-outlined text-[#894d00] text-4xl animate-pulse">qr_code</span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button 
                    disabled={!table.isActive}
                    className={`flex-1 py-3 rounded-full text-xs font-bold font-label flex items-center justify-center gap-2 transition-colors
                      ${!table.isActive ? 'bg-[#ebe8e1] text-[#534437]/40 cursor-not-allowed' : 'bg-[#ebe8e1] text-[#1c1c18] hover:bg-[#dddad3]'}`}
                  >
                    <span className="material-symbols-outlined text-sm">download</span> PNG
                  </button>
                  <button 
                    disabled={!table.isActive}
                    className={`flex-1 py-3 rounded-full text-xs font-bold font-label flex items-center justify-center gap-2 transition-colors
                      ${!table.isActive ? 'bg-[#ebe8e1] text-[#534437]/40 cursor-not-allowed' : 'bg-[#ebe8e1] text-[#1c1c18] hover:bg-[#dddad3]'}`}
                  >
                    <span className="material-symbols-outlined text-sm">link</span> URL
                  </button>
                </div>
              </div>
            ))}

            <div 
              onClick={addTable}
              className={`border-2 border-dashed border-[#d8c3b2] rounded-xl p-6 flex flex-col items-center justify-center gap-4 group hover:bg-[#f7f3ec] transition-colors min-h-[350px] ${isAdding ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}>
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-[#894d00]">
                  {isAdding ? 'hourglass_empty' : 'add_circle'}
                </span>
              </div>
              <div className="text-center">
                <p className="font-headline text-xl font-bold mb-2">Add New Station</p>
                <p className="text-[#534437] text-sm px-4">Instantly generate a unique QR for a new table.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
