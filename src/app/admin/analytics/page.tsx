"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics?range=7d')
      .then(res => res.json())
      .then(json => {
        setData(json);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 opacity-50">
            <div className="w-12 h-12 border-4 border-[#894d00]/20 border-t-[#894d00] rounded-full animate-spin"></div>
            <p className="text-sm font-label uppercase tracking-widest font-bold text-[#894d00]">Crunching numbers...</p>
          </div>
        </main>
      </div>
    );
  }

  const { isDummy, notice, summary, statusBreakdown, topItems, ordersPerDay } = data || {};

  // Find max revenue for height calculation in chart
  const maxRevenue = ordersPerDay && ordersPerDay.length > 0 
    ? Math.max(...ordersPerDay.map((d: any) => d.revenue)) 
    : 100;

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen font-body flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-12">
        <header className="mb-10">
          <span className="text-[#894d00] font-label uppercase tracking-widest text-[10px] font-bold block mb-2">Metrics & Insights</span>
          <h2 className="text-4xl font-headline font-bold text-[#1c1c18] tracking-tight mb-2">Analytics Overview</h2>
        </header>

        {isDummy && notice && (
          <div className="mb-8 p-4 bg-[#e6f4f1] text-[#006579] rounded-xl border border-[#b2ebff] text-sm font-medium flex items-center gap-3 shadow-sm">
            <span className="material-symbols-outlined">info</span>
            {notice}
          </div>
        )}

        {/* Top Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-2xl border border-[#ebe8e1] shadow-sm relative overflow-hidden group hover:border-[#894d00]/30 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">payments</span>
            </div>
            <h3 className="text-xs uppercase font-label font-bold tracking-widest text-[#534437] mb-2">Total Revenue (7d)</h3>
            <p className="text-4xl font-headline font-bold text-[#894d00] mt-4">${summary?.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-[#ebe8e1] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">receipt_long</span>
            </div>
            <h3 className="text-xs uppercase font-label font-bold tracking-widest text-[#534437] mb-2">Total Orders</h3>
            <p className="text-4xl font-headline font-bold text-[#1c1c18] mt-4">{summary?.totalOrders || 0}</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-[#ebe8e1] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-6xl">monitoring</span>
            </div>
            <h3 className="text-xs uppercase font-label font-bold tracking-widest text-[#534437] mb-2">Avg Order Value</h3>
            <p className="text-4xl font-headline font-bold text-[#1c1c18] mt-4">${summary?.avgOrderValue?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 mb-16">
          {/* Chart Section */}
          <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-2xl border border-[#ebe8e1] shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm uppercase font-label font-bold tracking-widest text-[#1c1c18]">Daily Revenue Trend</h3>
            </div>
            
            <div className="flex items-end gap-3 h-64 mt-4 border-b border-[#ebe8e1] pb-2 relative">
              {/* Background horizontal lines (optional visual anchor) */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full h-px bg-[#857466]"></div>
                <div className="w-full h-px bg-[#857466]"></div>
                <div className="w-full h-px bg-[#857466]"></div>
              </div>

              {ordersPerDay && ordersPerDay.map((day: any, i: number) => {
                const heightPercent = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full">
                    <div className="w-full flex justify-center relative h-full items-end z-10">
                       <div 
                         className="w-full max-w-[48px] bg-[#f7f3ec] group-hover:bg-[#894d00] rounded-t-lg transition-all duration-300 relative"
                         style={{ height: `${Math.max(Math.min(heightPercent, 100), 2)}%` }}
                       >
                         {/* Tooltip */}
                         <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1c1c18] text-white text-[10px] font-bold px-3 py-2 rounded shadow-xl whitespace-nowrap pointer-events-none transition-opacity">
                           ${day.revenue.toFixed(2)}
                           <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1c1c18]"></div>
                         </div>
                       </div>
                    </div>
                    {/* Date Label */}
                    <span className="text-[10px] font-bold text-[#534437]">{day.date.split('-').slice(1).join('/')}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Top Items & Status Breakdown */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-2xl border border-[#ebe8e1] shadow-sm flex-1">
              <h3 className="text-sm uppercase font-label font-bold tracking-widest text-[#1c1c18] mb-6">Top Selling Items</h3>
              <ul className="space-y-5">
                {topItems?.map((item: any, i: number) => (
                  <li key={i} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="font-headline font-bold text-[#857466] text-opacity-50">{i + 1}.</span>
                      <span className="font-bold text-sm text-[#1c1c18] truncate">{item.name}</span>
                    </div>
                    <span className="text-[#894d00] font-bold text-xs bg-[#fdf9f2] px-3 py-1.5 rounded-full border border-[#ebe8e1] whitespace-nowrap shadow-sm group-hover:bg-[#894d00] group-hover:text-white transition-colors">
                      {item.orders} Sold
                    </span>
                  </li>
                ))}
                {(!topItems || topItems.length === 0) && (
                  <li className="text-sm text-[#857466] italic">No items sold yet.</li>
                )}
              </ul>
            </div>

            <div className="bg-[#1c1c18] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 text-[120px] opacity-5 pointer-events-none">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>donut_large</span>
              </div>
              <h3 className="text-sm uppercase font-label font-bold tracking-widest text-[#fdf9f2] opacity-80 mb-6">Fulfillment Overview</h3>
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-sm bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="opacity-90 font-medium text-green-50">Served</span>
                  </div>
                  <span className="font-bold text-lg">{statusBreakdown?.served || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ffb874]"></span>
                    <span className="opacity-80">Pending/Preparing</span>
                  </div>
                  <span className="font-bold">{Number(statusBreakdown?.pending || 0) + Number(statusBreakdown?.preparing || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-2 px-3 text-red-300 pt-5 mt-2 border-t border-white/10">
                  <span className="opacity-90">Cancelled</span>
                  <span className="font-bold">{statusBreakdown?.cancelled || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
