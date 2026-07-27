import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, ClipboardList, Package, Map, AlertTriangle, 
  ArrowUpRight, Clock, Plus, Check, Play, ChevronRight, TrendingUp 
} from 'lucide-react';

export default function DashboardPortal({ 
  orders, 
  onUpdateOrderStatus, 
  reservations, 
  onAddOrderMock 
}) {
  const [activeTab, setActiveTab] = useState('orders'); // orders, tables, inventory, analytics
  const [stats, setStats] = useState({
    todayRevenue: 2840,
    activeTables: 5,
    pendingOrders: 3,
    occupancyRate: 62.5
  });

  // Mock table list for the interactive floor map
  const [dashboardTables, setDashboardTables] = useState([
    { id: 1, name: 'Table 1', seats: 2, status: 'Occupied', currentBill: 84.50 },
    { id: 2, name: 'Table 2', seats: 4, status: 'Empty', currentBill: 0 },
    { id: 3, name: 'Table 3', seats: 2, status: 'Billing', currentBill: 120.00 },
    { id: 4, name: 'Table 4', seats: 6, status: 'Alert', currentBill: 240.20 },
    { id: 5, name: 'Table 5', seats: 4, status: 'Occupied', currentBill: 95.00 },
    { id: 6, name: 'Table 6', seats: 2, status: 'Empty', currentBill: 0 },
    { id: 7, name: 'Table 7', seats: 8, status: 'Occupied', currentBill: 345.50 },
    { id: 8, name: 'Table 8', seats: 4, status: 'Billing', currentBill: 180.00 },
  ]);

  // Handle changing table status interactively on the floor map
  const toggleTableStatus = (tableId) => {
    setDashboardTables(prev => prev.map(t => {
      if (t.id === tableId) {
        let nextStatus = 'Empty';
        let nextBill = 0;
        if (t.status === 'Empty') {
          nextStatus = 'Occupied';
          nextBill = Math.floor(Math.random() * 150) + 40;
        } else if (t.status === 'Occupied') {
          nextStatus = 'Billing';
          nextBill = t.currentBill;
        } else if (t.status === 'Billing') {
          nextStatus = 'Alert';
          nextBill = t.currentBill;
        } else if (t.status === 'Alert') {
          nextStatus = 'Empty';
          nextBill = 0;
        }
        return { ...t, status: nextStatus, currentBill: nextBill };
      }
      return t;
    }));
  };

  // Synchronize dashboard active tables with floor map
  useEffect(() => {
    const occupiedCount = dashboardTables.filter(t => t.status !== 'Empty').length;
    const pendingCount = orders.filter(o => o.status !== 'Served').length;
    const totalRev = orders
      .filter(o => o.status === 'Served')
      .reduce((sum, o) => sum + o.total, 2400); // 2400 as starting mock base
      
    setStats({
      todayRevenue: totalRev,
      activeTables: occupiedCount,
      pendingOrders: pendingCount,
      occupancyRate: (occupiedCount / dashboardTables.length) * 100
    });
  }, [dashboardTables, orders]);

  // Inventory ingredients list with remaining stock and AI forecasts
  const inventory = [
    { name: 'Fresh Italian Truffles', stock: 1.5, unit: 'kg', minRequired: 3.0, status: 'Critical', forecast: 'Expected deficit of 1.2kg for upcoming Friday peak.' },
    { name: 'Mediterranean Lobster', stock: 24, unit: 'units', minRequired: 15, status: 'Optimal', forecast: 'Sufficient stock. Predicted demand: 18 units.' },
    { name: 'A5 Wagyu Ribeye', stock: 5, unit: 'kg', minRequired: 8.0, status: 'Low Stock', forecast: 'Reposition stock: order 5kg to meet weekend bookings.' },
    { name: 'Organic Saffron Threads', stock: 80, unit: 'grams', minRequired: 100, status: 'Low Stock', forecast: 'Replenishment suggested. Peak risotto demand expected.' },
    { name: 'Tignanello Red Wine', stock: 18, unit: 'bottles', minRequired: 10, status: 'Optimal', forecast: 'Sufficient stock. Cellar temperature stable at 14°C.' },
    { name: 'Acqua Panna Still', stock: 120, unit: 'bottles', minRequired: 50, status: 'Optimal', forecast: 'High volume item. Current stock sufficient for 8 days.' },
  ];

  return (
    <div className="container py-8 space-y-8 min-h-screen">
      {/* 1. Header with Role Switch Info & KPI Cards */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-white font-bold tracking-tight">Operations Dashboard</h2>
          <p className="text-xs text-[#D4AF37] uppercase tracking-widest font-semibold mt-1">
            Real-Time Restaurant Control Platform
          </p>
        </div>

        {/* Dashboard Section Switcher */}
        <div className="flex bg-[#141414] border border-white/5 rounded-full p-1 self-stretch md:self-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: 'Order Board', icon: ClipboardList },
            { id: 'tables', label: 'Floor Map', icon: Map },
            { id: 'inventory', label: 'Inventory (AI)', icon: Package },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-[#D4AF37] text-[#0A0A0A]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Today\'s Revenue', val: `$${stats.todayRevenue.toFixed(2)}`, trend: '+14.2%', icon: TrendingUp },
          { label: 'Active Tables', val: `${stats.activeTables} / 8`, trend: '62.5% Cap', icon: Map },
          { label: 'Active Orders', val: stats.pendingOrders, trend: 'Kitchen Busy', icon: ClipboardList },
          { label: 'Occupancy Rate', val: `${stats.occupancyRate.toFixed(1)}%`, trend: '+5.4% vs yest', icon: Users },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-[#141414] border border-white/5 p-6 rounded-3xl space-y-2 relative overflow-hidden group hover:border-[#D4AF37]/30 transition-all duration-300">
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent rounded-bl-3xl"></div>
              <div className="flex justify-between items-center text-white/40">
                <span className="text-[10px] uppercase font-bold tracking-widest">{kpi.label}</span>
                <Icon size={18} className="text-[#D4AF37]" />
              </div>
              <div className="flex justify-between items-baseline pt-2">
                <h3 className="text-2xl font-bold text-white serif-font">{kpi.val}</h3>
                <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
                  {kpi.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. TAB: Orders Board */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl text-white font-bold serif-font flex items-center gap-2">
              <ClipboardList className="text-[#D4AF37]" /> Live Kitchen Tickets
            </h3>
            <button 
              onClick={onAddOrderMock}
              className="btn-secondary text-[10px] py-2 px-4 flex items-center gap-2"
            >
              <Plus size={12} />
              Simulate Customer Order
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Received', 'Cooking', 'Ready', 'Served'].map((status) => {
              const statusOrders = orders.filter(o => o.status === status);
              return (
                <div key={status} className="bg-[#141414] border border-white/5 rounded-3xl p-5 flex flex-col min-h-[450px]">
                  {/* Status Column Header */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                    <span className="text-xs uppercase font-extrabold tracking-widest text-white/80 flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        status === 'Received' ? 'bg-blue-400' :
                        status === 'Cooking' ? 'bg-amber-400' :
                        status === 'Ready' ? 'bg-emerald-400' : 'bg-white/40'
                      }`}></span>
                      {status}
                    </span>
                    <span className="text-[10px] font-bold bg-white/5 text-white/50 px-2 py-0.5 rounded-full">
                      {statusOrders.length}
                    </span>
                  </div>

                  {/* Cards Feed Container */}
                  <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar max-h-[500px]">
                    {statusOrders.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center py-12">
                        <p className="text-xs text-white/20 uppercase tracking-wider">No tickets</p>
                      </div>
                    ) : (
                      statusOrders.map((order) => (
                        <div 
                          key={order.id} 
                          className="bg-[#0A0A0A]/80 border border-white/10 p-4 rounded-2xl space-y-3 hover:border-[#D4AF37]/45 transition-colors relative"
                        >
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[#D4AF37] font-semibold">T-{order.tableId ? order.tableId : 'Online'}</span>
                            <span className="text-white/40 flex items-center gap-1">
                              <Clock size={10} /> {order.time}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <p key={idx} className="text-xs text-white/80 flex justify-between">
                                <span>{item.name}</span>
                                <span className="text-white/40">x{item.quantity}</span>
                              </p>
                            ))}
                          </div>

                          <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                            <span className="text-xs font-bold text-white serif-font">${order.total.toFixed(2)}</span>
                            
                            {/* Action Button to progress status */}
                            {status !== 'Served' && (
                              <button
                                onClick={() => {
                                  const nextMap = {
                                    'Received': 'Cooking',
                                    'Cooking': 'Ready',
                                    'Ready': 'Served'
                                  };
                                  onUpdateOrderStatus(order.id, nextMap[status]);
                                }}
                                className="p-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0A0A0A] transition-all flex items-center gap-1 text-[9px] uppercase tracking-wider font-bold"
                              >
                                {status === 'Received' ? 'Cook' : status === 'Cooking' ? 'Ready' : 'Serve'}
                                <ChevronRight size={10} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. TAB: Floor Map */}
      {activeTab === 'tables' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Map Grid (8 cols) */}
          <div className="lg:col-span-8 bg-[#141414] border border-white/5 p-6 rounded-3xl space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div>
                <h3 className="text-lg text-white font-bold">Restaurant Floor Layout</h3>
                <p className="text-[10px] text-white/40">Click any table tile to cycle through states manually</p>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/30">Lobby Open</span>
              </div>
            </div>

            {/* The Tables Grid representation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-4 bg-[#0A0A0A]/40 rounded-2xl min-h-[300px]">
              {dashboardTables.map((table) => {
                // Determine styling based on status: Occupied, Empty, Billing, Alert
                let statusBgClass = '';
                if (table.status === 'Empty') {
                  statusBgClass = 'bg-[#141414] border-white/15 text-white/70 hover:border-white/40';
                } else if (table.status === 'Occupied') {
                  statusBgClass = 'bg-white/5 border-[#D4AF37]/40 text-[#D4AF37] hover:bg-white/10';
                } else if (table.status === 'Billing') {
                  statusBgClass = 'bg-orange-500/10 border-orange-500 text-orange-400 glow-border-billing';
                } else if (table.status === 'Alert') {
                  statusBgClass = 'bg-red-500/10 border-red-500 text-red-400 glow-border-alert';
                }

                return (
                  <button
                    key={table.id}
                    onClick={() => toggleTableStatus(table.id)}
                    className={`p-6 rounded-3xl flex flex-col justify-between aspect-square border text-center transition-all ${statusBgClass}`}
                  >
                    <span className="text-xs uppercase tracking-widest font-extrabold block">T-{table.id}</span>
                    <div>
                      <span className="text-xl font-bold block serif-font">
                        {table.status === 'Empty' ? 'Empty' : `$${table.currentBill}`}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider block opacity-75 mt-1">{table.seats} Seats</span>
                    </div>

                    {/* Alert indicators */}
                    <div className="flex justify-center items-center gap-1.5 mt-2">
                      <span className={`h-2 w-2 rounded-full ${
                        table.status === 'Empty' ? 'bg-white/20' :
                        table.status === 'Occupied' ? 'bg-green-400' :
                        table.status === 'Billing' ? 'bg-orange-500 animate-ping' : 'bg-red-500 animate-pulse'
                      }`}></span>
                      <span className="text-[9px] uppercase font-bold tracking-widest">{table.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Actions / Status Details Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#141414] border border-white/5 p-6 rounded-3xl space-y-6">
            <h3 className="text-lg text-white font-bold border-b border-white/5 pb-3">Operational Alerts</h3>
            
            <div className="space-y-4">
              {dashboardTables.filter(t => t.status === 'Alert' || t.status === 'Billing').map((table) => (
                <div 
                  key={table.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    table.status === 'Alert' 
                      ? 'bg-red-500/5 border-red-500/30 text-red-400' 
                      : 'bg-orange-500/5 border-orange-500/30 text-orange-400'
                  }`}
                >
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Table {table.id} Needs Attention
                    </h4>
                    <p className="text-[11px] text-white/60">
                      {table.status === 'Alert' 
                        ? 'Customer flagged waiting time alert: Order delayed > 20 mins.' 
                        : 'Billing requested. Generate receipt summary of $' + table.currentBill + '.'}
                    </p>
                    <button 
                      onClick={() => toggleTableStatus(table.id)}
                      className="text-[9px] uppercase tracking-widest font-extrabold bg-white/10 px-3 py-1.5 rounded-full text-white mt-2 hover:bg-white/20 transition-all block"
                    >
                      Resolve Status
                    </button>
                  </div>
                </div>
              ))}

              {dashboardTables.filter(t => t.status === 'Alert' || t.status === 'Billing').length === 0 && (
                <div className="py-12 text-center text-white/30 space-y-2">
                  <Check size={24} className="mx-auto text-green-400" />
                  <p className="text-xs uppercase tracking-wider">All tables operating smoothly</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: Inventory Forecasting */}
      {activeTab === 'inventory' && (
        <div className="bg-[#141414] border border-white/5 p-6 rounded-3xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg text-white font-bold flex items-center gap-2">
              <Package className="text-[#D4AF37]" /> AI-Powered Inventory Prediction
            </h3>
            <p className="text-xs text-white/40 mt-1">
              Monitors ingredients and cross-references reservations to forecast inventory requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ingredients Table */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-widest font-extrabold text-[#D4AF37]">Active Sourcing Stocks</h4>
              
              <div className="space-y-3">
                {inventory.map((item, idx) => (
                  <div key={idx} className="p-4 bg-[#0A0A0A]/40 border border-white/5 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="text-xs font-semibold text-white">{item.name}</p>
                      <p className="text-[10px] text-white/40 mt-1">Min. Required: {item.minRequired} {item.unit}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-bold text-white serif-font">{item.stock} {item.unit}</p>
                      <span className={`text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full inline-block mt-1.5 ${
                        item.status === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/30' :
                        item.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-green-500/10 text-green-400 border border-green-500/30'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Demand Forecasting Panel */}
            <div className="bg-[#0A0A0A]/50 border border-[rgba(212,175,55,0.2)] p-6 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <TrendingUp size={18} />
                  <span className="text-xs uppercase tracking-widest font-bold">Predictive Intelligence Insights</span>
                </div>
                
                <p className="text-xs text-white/70 leading-relaxed">
                  Based on <strong>8 upcoming reservations</strong> and seasonal dining history for late July, the AI model has generated the following stocking directives:
                </p>

                <div className="space-y-3 pt-2">
                  {inventory.filter(i => i.status !== 'Optimal').map((item, idx) => (
                    <div key={idx} className="p-3 bg-[#141414] border-l-2 border-amber-500 rounded-r-xl space-y-1">
                      <p className="text-xs font-bold text-white">{item.name}</p>
                      <p className="text-[11px] text-white/50">{item.forecast}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <button className="btn-gold py-2.5 px-4 text-[10px] flex-1">
                  Approve Restock Orders
                </button>
                <button className="btn-secondary py-2.5 px-4 text-[10px] flex-1">
                  Adjust Parameters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-[#141414] border border-white/5 p-6 rounded-3xl space-y-8">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-lg text-white font-bold flex items-center gap-2">
              <BarChart3 className="text-[#D4AF37]" /> Daily Analytics & Financial Metrics
            </h3>
            <p className="text-xs text-white/40 mt-1">
              Visualizes daily earnings trends, service efficiency times, and peaks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Custom SVG Line Chart - Today's Sales Trend */}
            <div className="bg-[#0A0A0A]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white font-semibold">Hourly Revenue Trend ($)</span>
                <span className="text-green-400 font-bold">+12% vs last Mon</span>
              </div>
              
              {/* SVG Curve chart */}
              <div className="h-60 w-full flex items-center justify-center pt-4">
                <svg viewBox="0 0 500 200" className="w-full h-full text-[#D4AF37]">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="450" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="50" y1="70" x2="450" y2="70" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="50" y1="120" x2="450" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <line x1="50" y1="170" x2="450" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  
                  {/* Axis Label bounds */}
                  <text x="25" y="25" fill="rgba(255,255,255,0.3)" fontSize="10">800</text>
                  <text x="25" y="75" fill="rgba(255,255,255,0.3)" fontSize="10">500</text>
                  <text x="25" y="125" fill="rgba(255,255,255,0.3)" fontSize="10">200</text>
                  
                  {/* Area fill */}
                  <path d="M 50 170 C 100 150, 150 70, 200 100 C 250 120, 300 40, 350 30 C 400 20, 420 80, 450 60 L 450 170 Z" fill="url(#chartGradient)" />
                  
                  {/* Revenue Curve */}
                  <path d="M 50 170 C 100 150, 150 70, 200 100 C 250 120, 300 40, 350 30 C 400 20, 420 80, 450 60" fill="none" stroke="#D4AF37" strokeWidth="3" />
                  
                  {/* Data Points */}
                  <circle cx="200" cy="100" r="4" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" />
                  <circle cx="350" cy="30" r="4" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" />
                  
                  {/* Time Labels */}
                  <text x="50" y="190" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">12 PM</text>
                  <text x="150" y="190" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">3 PM</text>
                  <text x="250" y="190" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">6 PM</text>
                  <text x="350" y="190" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">9 PM</text>
                  <text x="450" y="190" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">11 PM</text>
                </svg>
              </div>
            </div>

            {/* Custom SVG Bar Chart - Peak Table booking hours */}
            <div className="bg-[#0A0A0A]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-white font-semibold">Table Bookings By Hour (Covers)</span>
                <span className="text-[#D4AF37] font-semibold">Peak: 8:00 PM</span>
              </div>

              {/* SVG Bar Chart */}
              <div className="h-60 w-full flex items-center justify-center pt-4">
                <svg viewBox="0 0 500 200" className="w-full h-full text-white">
                  <line x1="50" y1="170" x2="450" y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  
                  {/* Bars representing slots */}
                  {/* 5 PM */}
                  <rect x="75" y="120" width="30" height="50" rx="3" fill="#141414" stroke="rgba(255,255,255,0.1)" />
                  <text x="90" y="185" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">5 PM</text>
                  
                  {/* 6 PM */}
                  <rect x="150" y="80" width="30" height="90" rx="3" fill="rgba(212,175,55,0.3)" stroke="#D4AF37" strokeWidth="1" />
                  <text x="165" y="185" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">6 PM</text>
                  
                  {/* 7 PM */}
                  <rect x="225" y="40" width="30" height="130" rx="3" fill="rgba(212,175,55,0.5)" stroke="#D4AF37" strokeWidth="1" />
                  <text x="240" y="185" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">7 PM</text>
                  
                  {/* 8 PM (PEAK) */}
                  <rect x="300" y="20" width="30" height="150" rx="3" fill="#D4AF37" />
                  <text x="315" y="185" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">8 PM</text>
                  
                  {/* 9 PM */}
                  <rect x="375" y="60" width="30" height="110" rx="3" fill="rgba(212,175,55,0.6)" stroke="#D4AF37" strokeWidth="1" />
                  <text x="390" y="185" fill="rgba(255,255,255,0.3)" fontSize="9" textAnchor="middle">9 PM</text>
                  
                  {/* Guest count labels */}
                  <text x="90" y="110" fill="#FFFFFF" fontSize="9" textAnchor="middle">10</text>
                  <text x="165" y="70" fill="#FFFFFF" fontSize="9" textAnchor="middle">24</text>
                  <text x="240" y="30" fill="#FFFFFF" fontSize="9" textAnchor="middle">42</text>
                  <text x="315" y="10" fill="#D4AF37" fontSize="9" fontWeight="bold" textAnchor="middle">58</text>
                  <text x="390" y="50" fill="#FFFFFF" fontSize="9" textAnchor="middle">35</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
