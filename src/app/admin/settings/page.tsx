"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("identity");

  return (
    <div className="bg-[#fdf9f2] text-[#1c1c18] min-h-screen font-body flex">
      <Sidebar />
      
      {/* TopAppBar inside the main content or as a floating header */}
      <div className="flex-1 ml-64 flex flex-col pt-16">
        <header className="fixed top-0 right-0 left-64 h-16 bg-[#fdf9f2]/90 backdrop-blur-xl z-40 border-b border-[#f1ede6] flex items-center justify-between px-8">
          <div className="flex items-center">
            <h2 className="font-headline font-bold text-xl text-[#1c1c18]">Settings</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative group cursor-pointer">
              <span className="material-symbols-outlined text-[#1c1c18] hover:opacity-80 transition-opacity">notifications</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#894d00] rounded-full"></span>
            </div>
            <span className="material-symbols-outlined text-[#1c1c18] hover:opacity-80 cursor-pointer transition-opacity">help_outline</span>
            <div className="h-8 w-[1px] bg-[#d8c3b2]/50"></div>
            <button className="bg-[#894d00] text-white px-6 py-2 rounded-full text-sm font-bold active:scale-95 transition-all shadow-md hover:bg-[#a96413]">
              Save Settings
            </button>
          </div>
        </header>

        <main className="flex-1 pb-12 px-8 max-w-6xl mx-auto w-full mt-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar Navigation for Settings Sections */}
            <div className="col-span-12 lg:col-span-3 space-y-2">
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#857466] mb-4 px-4">Configuration</p>
              <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 gap-2">
                <button 
                  onClick={() => setActiveTab("identity")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full whitespace-nowrap transition-colors
                    ${activeTab === 'identity' ? 'bg-[#ebe8e1] text-[#894d00] font-bold' : 'hover:bg-[#f7f3ec] text-[#534437]'}`}
                >
                  <span className="material-symbols-outlined text-sm">storefront</span>
                  Café Identity
                </button>
                <button 
                  onClick={() => setActiveTab("hours")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full whitespace-nowrap transition-colors
                    ${activeTab === 'hours' ? 'bg-[#ebe8e1] text-[#894d00] font-bold' : 'hover:bg-[#f7f3ec] text-[#534437]'}`}
                >
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  Operating Hours
                </button>
                <button 
                  onClick={() => setActiveTab("notifications")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full whitespace-nowrap transition-colors
                    ${activeTab === 'notifications' ? 'bg-[#ebe8e1] text-[#894d00] font-bold' : 'hover:bg-[#f7f3ec] text-[#534437]'}`}
                >
                  <span className="material-symbols-outlined text-sm">notifications_active</span>
                  Notifications
                </button>
                <button 
                  className={`flex items-center gap-3 px-4 py-3 rounded-full whitespace-nowrap transition-colors hover:bg-[#f7f3ec] text-[#534437] opacity-60 cursor-not-allowed`}
                >
                  <span className="material-symbols-outlined text-sm">payments</span>
                  Billing & Plans
                </button>
              </nav>
            </div>

            {/* Settings Form Canvas */}
            <div className="col-span-12 lg:col-span-9 space-y-8">
              
              {/* Café Identity Section */}
              {activeTab === 'identity' && (
                <section className="bg-white rounded-xl p-8 shadow-sm border border-[#f1ede6]">
                  <h3 className="text-2xl font-headline font-bold mb-1 text-[#1c1c18]">Café Identity</h3>
                  <p className="text-sm text-[#534437] mb-8">Manage how your roastery appears to customers and on the web.</p>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="relative group cursor-pointer">
                        <div className="w-32 h-32 rounded-xl overflow-hidden bg-[#f1ede6] flex items-center justify-center border-2 border-dashed border-[#d8c3b2] group-hover:border-[#894d00]/50 transition-colors">
                          <img alt="Cafe Logo" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?q=80&w=200&auto=format&fit=crop" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white">upload</span>
                          </div>
                        </div>
                        <p className="text-center text-[10px] mt-2 font-bold uppercase tracking-tight text-[#534437]">Update Logo</p>
                      </div>
                      
                      <div className="flex-grow w-full space-y-6">
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#857466]">Café Name</label>
                          <input 
                            className="w-full bg-transparent border-b border-[#d8c3b2] focus:border-[#894d00] focus:ring-0 transition-colors py-2 font-headline text-lg placeholder:text-[#857466]/50 outline-none" 
                            type="text" 
                            defaultValue="The Roasted Bean"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#857466]">URL Slug</label>
                          <div className="flex items-center">
                            <span className="text-sm text-[#857466] pr-1">theroastedbean.com/order/</span>
                            <input 
                              className="flex-grow bg-transparent border-b border-[#d8c3b2] focus:border-[#894d00] focus:ring-0 transition-colors py-1 text-sm font-medium outline-none" 
                              type="text" 
                              defaultValue="artisan-roast-city"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Operating Hours Section */}
              {activeTab === 'hours' && (
                <section className="bg-white rounded-xl p-8 shadow-sm border border-[#f1ede6]">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-headline font-bold mb-1 text-[#1c1c18]">Operating Hours</h3>
                      <p className="text-sm text-[#534437]">Set your daily availability for orders and dine-in.</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 bg-[#b2ebff]/20 text-[#006579] text-xs font-bold rounded-full">
                      <span className="w-2 h-2 bg-[#006579] rounded-full mr-2 animate-pulse"></span>
                      Live Now
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Monday */}
                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f7f3ec] transition-colors border border-transparent hover:border-[#f1ede6]">
                      <div className="flex items-center gap-4 w-32">
                        <input defaultChecked className="rounded text-[#894d00] focus:ring-[#894d00] border-[#d8c3b2]" type="checkbox"/>
                        <span className="text-sm font-bold text-[#1c1c18]">Monday</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input className="bg-[#f1ede6] border-none rounded-lg text-sm px-3 py-1 font-mono outline-none" type="time" defaultValue="07:00"/>
                        <span className="text-[#857466] text-xs uppercase font-bold">to</span>
                        <input className="bg-[#f1ede6] border-none rounded-lg text-sm px-3 py-1 font-mono outline-none" type="time" defaultValue="19:00"/>
                      </div>
                    </div>
                    
                    {/* Tuesday-Friday */}
                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f7f3ec] transition-colors border border-transparent hover:border-[#f1ede6]">
                      <div className="flex items-center gap-4 w-32">
                        <input defaultChecked className="rounded text-[#894d00] focus:ring-[#894d00] border-[#d8c3b2]" type="checkbox"/>
                        <span className="text-sm font-bold text-[#1c1c18]">Tue - Fri</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input className="bg-[#f1ede6] border-none rounded-lg text-sm px-3 py-1 font-mono outline-none" type="time" defaultValue="07:00"/>
                        <span className="text-[#857466] text-xs uppercase font-bold">to</span>
                        <input className="bg-[#f1ede6] border-none rounded-lg text-sm px-3 py-1 font-mono outline-none" type="time" defaultValue="19:00"/>
                      </div>
                    </div>

                    {/* Saturday */}
                    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-[#f7f3ec] transition-colors border border-transparent hover:border-[#f1ede6]">
                      <div className="flex items-center gap-4 w-32">
                        <input defaultChecked className="rounded text-[#894d00] focus:ring-[#894d00] border-[#d8c3b2]" type="checkbox"/>
                        <span className="text-sm font-bold text-[#1c1c18]">Saturday</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <input className="bg-[#f1ede6] border-none rounded-lg text-sm px-3 py-1 font-mono outline-none" type="time" defaultValue="09:00"/>
                        <span className="text-[#857466] text-xs uppercase font-bold">to</span>
                        <input className="bg-[#f1ede6] border-none rounded-lg text-sm px-3 py-1 font-mono outline-none" type="time" defaultValue="21:00"/>
                      </div>
                    </div>

                    {/* Sunday */}
                    <div className="flex items-center justify-between p-4 rounded-xl opacity-60 bg-[#ebe8e1]/50 border border-transparent">
                      <div className="flex items-center gap-4 w-32">
                        <input className="rounded text-[#894d00] focus:ring-[#894d00] border-[#d8c3b2]" type="checkbox"/>
                        <span className="text-sm font-bold text-[#1c1c18]">Sunday</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#857466]">Closed</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Notifications Section */}
              {activeTab === 'notifications' && (
                <section className="bg-white rounded-xl p-8 shadow-sm border border-[#f1ede6]">
                  <h3 className="text-2xl font-headline font-bold mb-1 text-[#1c1c18]">Notifications</h3>
                  <p className="text-sm text-[#534437] mb-8">Control how you're alerted about new orders and staff updates.</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-bold text-sm text-[#1c1c18]">Order Alerts</p>
                        <p className="text-xs text-[#534437]">Instant email notifications for every new online order.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#ebe8e1] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#894d00] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-[#f1ede6] pt-6">
                      <div>
                        <p className="font-bold text-sm text-[#1c1c18]">Dashboard Sounds</p>
                        <p className="text-xs text-[#534437]">A soft chime when a new ticket is sent to the kitchen.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#ebe8e1] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#894d00] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-t border-[#f1ede6] pt-6">
                      <div>
                        <p className="font-bold text-sm text-[#1c1c18]">Low Stock Warnings</p>
                        <p className="text-xs text-[#534437]">Alert when inventory for key ingredients falls below 10%.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#ebe8e1] rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#894d00] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  </div>
                </section>
              )}

              {/* Advanced/Danger Area */}
              <div className="flex justify-end pt-4">
                <button className="text-red-600 text-xs font-bold uppercase tracking-widest hover:bg-red-50 rounded-lg px-4 py-2 transition-colors">
                  Deactivate Storefront
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
