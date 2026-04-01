"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

type PastOrder = {
  id: string;
  table: string;
  notes: string;
  itemsSummary: string;
  itemCount: number;
  total: number;
  status: "served" | "preparing" | "ready";
  time: string;
};

const MOCK_ORDERS: PastOrder[] = [
  {
    id: "RB-8921",
    table: "Table 04",
    notes: "Extra hot milk, no lid please.",
    itemsSummary: "1x Flat White, 2x Butter Croissant",
    itemCount: 3,
    total: 18.50,
    status: "served",
    time: "10:42 AM"
  },
  {
    id: "RB-8920",
    table: "Window Bar 2",
    notes: "—",
    itemsSummary: "1x Ethiopian Pour Over",
    itemCount: 1,
    total: 7.00,
    status: "ready",
    time: "10:38 AM"
  },
  {
    id: "RB-8919",
    table: "Table 12",
    notes: "Celebrating a birthday!",
    itemsSummary: "2x Mocha, 2x Cheesecake Slice...",
    itemCount: 5,
    total: 42.75,
    status: "preparing",
    time: "10:35 AM"
  },
  {
    id: "RB-8918",
    table: "Table 08",
    notes: "—",
    itemsSummary: "1x Iced Latte (Oat)",
    itemCount: 1,
    total: 6.50,
    status: "served",
    time: "10:22 AM"
  },
  {
    id: "RB-8917",
    table: "Table 15",
    notes: "One napkin per item please.",
    itemsSummary: "4x Cappuccino, 4x Bagel",
    itemCount: 8,
    total: 68.20,
    status: "served",
    time: "10:15 AM"
  }
];

export default function OrderHistoryPage() {
  const [orders] = useState<PastOrder[]>(MOCK_ORDERS);

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen font-body flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[#894d00] font-bold tracking-widest text-[10px] uppercase mb-2 block">Management Dashboard</span>
              <h2 className="text-4xl font-headline font-bold text-[#1c1c18] tracking-tight">Order History</h2>
            </div>
            <div className="flex items-center gap-3 bg-[#f7f3ec] p-1.5 rounded-full">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                <span className="material-symbols-outlined text-[#894d00] text-sm">calendar_today</span>
                <span className="text-xs font-bold text-[#1c1c18]">Oct 12 - Oct 19, 2023</span>
              </div>
              <button className="px-4 py-2 text-xs font-bold text-[#534437] hover:bg-[#ebe8e1] rounded-full transition-colors">
                Custom Range
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-[#f1ede6]">
            <span className="text-[10px] font-bold text-[#534437] uppercase tracking-wider">Total Orders</span>
            <div className="mt-4">
              <p className="text-3xl font-headline font-bold text-[#1c1c18]">1,284</p>
              <p className="text-xs text-[#894d00] font-medium mt-1">↑ 12% vs last week</p>
            </div>
          </div>
          
          <div className="bg-[#894d00] p-6 rounded-xl shadow-sm flex flex-col justify-between text-white">
            <span className="text-[10px] font-bold opacity-70 uppercase tracking-wider">Revenue</span>
            <div className="mt-4">
              <p className="text-3xl font-headline font-bold">$14,290.50</p>
              <p className="text-xs opacity-70 mt-1">Daily avg: $2,041</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-[#f1ede6]">
            <span className="text-[10px] font-bold text-[#534437] uppercase tracking-wider">Average Wait</span>
            <div className="mt-4">
              <p className="text-3xl font-headline font-bold text-[#1c1c18]">14m 20s</p>
              <p className="text-xs text-[#007f99] font-medium mt-1">↓ 2m Improvement</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between border border-[#f1ede6]">
            <span className="text-[10px] font-bold text-[#534437] uppercase tracking-wider">Best Seller</span>
            <div className="mt-4">
              <p className="text-xl font-headline font-bold text-[#1c1c18]">Caramel Macchiato</p>
              <p className="text-xs text-[#534437] mt-1">342 orders this week</p>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-[#f1ede6]">
          <div className="px-8 py-6 border-b border-[#f1ede6] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="font-headline font-bold text-lg text-[#1c1c18]">Detailed Logs</h3>
              <span className="bg-[#f1ede6] px-3 py-1 rounded-full text-[10px] font-bold text-[#534437]">Showing 5 of 1,284</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-[#d8c3b2] rounded-full hover:bg-[#f7f3ec] transition-colors text-[#534437]">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold border border-[#d8c3b2] rounded-full hover:bg-[#f7f3ec] transition-colors text-[#534437]">
                <span className="material-symbols-outlined text-sm">file_download</span>
                Export CSV
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7f3ec]">
                  <th className="px-8 py-4 text-[10px] font-bold text-[#534437] uppercase tracking-widest border-b border-[#f1ede6]">Order #</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#534437] uppercase tracking-widest border-b border-[#f1ede6]">Table</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#534437] uppercase tracking-widest border-b border-[#f1ede6]">Customer Notes</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#534437] uppercase tracking-widest border-b border-[#f1ede6]">Items</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#534437] uppercase tracking-widest border-b border-[#f1ede6]">Total</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#534437] uppercase tracking-widest text-center border-b border-[#f1ede6]">Status</th>
                  <th className="px-8 py-4 text-[10px] font-bold text-[#534437] uppercase tracking-widest text-right border-b border-[#f1ede6]">Placed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1ede6]">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-[#f7f3ec]/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-5 text-sm font-bold text-[#894d00]">{order.id}</td>
                    <td className="px-6 py-5 text-sm font-medium text-[#1c1c18]">{order.table}</td>
                    <td className="px-6 py-5 text-xs text-[#534437] italic max-w-xs truncate">{`"${order.notes}"`}</td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#1c1c18]">{order.itemsSummary}</span>
                        <span className="text-[10px] text-[#534437]">{order.itemCount} items total</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-[#1c1c18]">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase
                        ${order.status === 'served' ? 'bg-green-100 text-green-800' : 
                          order.status === 'ready' ? 'bg-[#ffdcbf] text-[#6b3b00]' : 
                          'bg-[#b2ebff] text-[#004e5e]'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-[#534437] text-right font-medium">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-8 py-6 bg-[#f7f3ec]/50 border-t border-[#f1ede6] flex items-center justify-between">
            <button className="text-sm font-bold text-[#534437] hover:text-[#894d00] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-base">chevron_left</span>
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-full bg-[#894d00] text-white text-xs font-bold">1</button>
              <button className="w-8 h-8 rounded-full hover:bg-[#ebe8e1] text-[#1c1c18] text-xs font-bold transition-colors">2</button>
              <button className="w-8 h-8 rounded-full hover:bg-[#ebe8e1] text-[#1c1c18] text-xs font-bold transition-colors">3</button>
              <span className="px-2 text-[#534437]">...</span>
              <button className="w-8 h-8 rounded-full hover:bg-[#ebe8e1] text-[#1c1c18] text-xs font-bold transition-colors">128</button>
            </div>
            <button className="text-sm font-bold text-[#534437] hover:text-[#894d00] transition-colors flex items-center gap-2">
              Next
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
