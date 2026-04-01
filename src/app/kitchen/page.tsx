"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Pusher from "pusher-js";

// Mock Order Data Structure
type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  notes?: string[];
};

type Order = {
  id: string;
  table: string;
  status: "pending" | "preparing" | "ready" | "served";
  timePlaced: Date;
  items: OrderItem[];
};

const MOCK_ORDERS: Order[] = [
  {
    id: "842",
    table: "Table 14",
    status: "pending",
    timePlaced: new Date(Date.now() - 2 * 60000), // 2 mins ago
    items: [
      { id: "1", name: "Artisan Flat White", quantity: 2, notes: ["no sugar", "oat milk"] },
      { id: "2", name: "Smashed Avocado Toast", quantity: 1, notes: ["extra chili flakes"] }
    ]
  },
  {
    id: "841",
    table: "Pickup - Sarah",
    status: "preparing",
    timePlaced: new Date(Date.now() - 6 * 60000),
    items: [
      { id: "3", name: "Ethiopian Pour Over", quantity: 1, notes: ["V60 Method", "Light Roast"] },
      { id: "4", name: "Cinnamon Swirl Bun", quantity: 1, notes: ["warmed"] }
    ]
  },
  {
    id: "839",
    table: "Table 08",
    status: "ready",
    timePlaced: new Date(Date.now() - 14 * 60000),
    items: [
      { id: "5", name: "Cappuccino", quantity: 1 },
      { id: "6", name: "Dark Chocolate Cookie", quantity: 1 }
    ]
  }
];

export default function KitchenDisplayPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  // In a real app we'd setup Pusher to listen for new orders and status updates
  useEffect(() => {
    // Demo real-time Pusher listener logic
    const pusher = process.env.NEXT_PUBLIC_PUSHER_APP_KEY ? 
      new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, { cluster: "ap2" }) : null;

    if (pusher) {
      const channel = pusher.subscribe('kitchen');
      channel.bind('new_order', (data: Order) => {
        setOrders(prev => [data, ...prev]);
      });
      return () => {
        pusher.unsubscribe('kitchen');
      };
    }
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // Real implementation would make an API call here to update Postgres using Drizzle
    // which then triggers a Pusher push to the specific order channel to notify the user!
  };

  const getElapsedTime = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 60000); // in minutes
    return `${diff} min${diff !== 1 ? 's' : ''} ago`;
  };

  const getFormatElapsedMinSec = (date: Date) => {
    const start = date.getTime();
    const now = Date.now();
    const diffS = Math.floor((now - start) / 1000);
    const m = Math.floor(diffS / 60);
    const s = diffS % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Force re-render periodically to update timers
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen font-body flex">
      <Sidebar />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* TopNavBar */}
        <nav className="sticky top-0 z-40 bg-[#fdf9f2]/90 backdrop-blur-md flex justify-between items-center px-8 py-4 border-b border-[#ebe8e1]">
          <div className="flex items-center gap-6">
            <span className="text-xl font-headline italic font-bold text-[#1c1c18]">Kitchen Display</span>
            <div className="flex gap-8 ml-8">
              <span className="font-headline font-bold uppercase tracking-wide text-sm text-[#894d00] border-b-2 border-[#894d00] pb-1">Active Orders</span>
              <span className="font-headline font-bold uppercase tracking-wide text-sm text-[#534437] opacity-70 cursor-pointer hover:opacity-100 transition-opacity">Completed</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-[#f1ede6] px-4 py-2 rounded-full">
              <span className="material-symbols-outlined text-[#894d00]">schedule</span>
              <span className="font-medium font-mono text-[#1c1c18]">
                {mounted ? new Date().toLocaleTimeString([], { hour12: false }) : '--:--:--'}
              </span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-headline font-bold text-[#1c1c18] mb-2">Live Orders</h1>
              <p className="text-[#534437] font-bold uppercase tracking-[0.2em] text-xs">Rush Hour: {orders.filter(o => o.status !== "served").length} Active Tickets</p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#894d00] text-white rounded-full text-sm font-bold shadow-lg hover:bg-[#a96413] transition-all">
                <span className="material-symbols-outlined text-lg">pause</span> Pause Kitchen
              </button>
            </div>
          </header>

          {/* KDS Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {orders.filter(o => o.status !== "served").map(order => (
              <div key={order.id} className={`bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border-t-8 
                ${order.status === 'pending' ? 'border-[#ffb874]' : order.status === 'preparing' ? 'border-[#007f99]' : 'border-[#4caf50]'}`}>
                
                {/* Header */}
                <div className="p-5 border-b border-[#f1ede6] bg-[#fdf9f2]/50">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${order.status === 'pending' ? 'bg-[#ffdcbf] text-[#6b3b00]' : 
                        order.status === 'preparing' ? 'bg-[#b2ebff] text-[#004e5e]' : 
                        'bg-green-100 text-green-800'}`}>
                      {order.status}
                    </span>
                    <div className={`flex items-center gap-1 font-bold font-mono text-sm
                      ${order.status === 'pending' && Date.now() - order.timePlaced.getTime() > 300000 ? 'text-[#ba1a1a]' : 'text-[#534437]'}`}>
                      <span className="material-symbols-outlined text-sm">timer</span>
                      {getFormatElapsedMinSec(order.timePlaced)}
                    </div>
                  </div>
                  <h3 className="text-2xl font-headline font-bold text-[#1c1c18]">{order.table}</h3>
                  <p className="text-xs text-[#534437]">Order #{order.id} • {getElapsedTime(order.timePlaced)}</p>
                </div>

                {/* Items */}
                <div className="p-5 flex-1 space-y-4">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className={`flex gap-3 ${order.status === 'ready' ? 'opacity-50 line-through' : ''}`}>
                        <span className="font-bold text-[#894d00]">{item.quantity}x</span>
                        <div>
                          <p className="font-bold text-[#1c1c18]">{item.name}</p>
                          {item.notes && item.notes.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.notes.map(note => (
                                <span key={note} className="text-xs text-[#894d00] bg-[#ffdcbf]/50 px-2 py-0.5 rounded font-bold">
                                  {note}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      {order.status === 'preparing' && <div className="w-5 h-5 rounded-full border-2 border-[#d8c3b2]"></div>}
                      {order.status === 'ready' && <span className="material-symbols-outlined text-green-600">check_circle</span>}
                    </div>
                  ))}
                </div>

                {/* Action Footer */}
                <div className="p-4 bg-[#f7f3ec] mt-auto">
                  {order.status === 'pending' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="w-full py-3 bg-[#894d00] text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#a96413] transition-colors"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, "ready")}
                      className="w-full py-3 bg-[#007f99] text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-colors"
                    >
                      Mark Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button 
                      onClick={() => updateOrderStatus(order.id, "served")}
                      className="w-full py-3 border-2 border-green-600 text-green-700 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-green-50 transition-colors"
                    >
                      Bump to Finished
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}
