import React from 'react';
import { 
  ClipboardList, Package, Map, AlertTriangle, TrendingUp, 
  Clock, Check, Play, UserCheck, Trash2, HeartPulse, Sparkles 
} from 'lucide-react';

export default function StaffDashboard({
  menu,
  tables,
  orders,
  queue,
  notifications,
  onToggleAvailability,
  onUpdateOrderStatus,
  onToggleTableStatus,
  onClearNotifications,
  activeDashboardTab,
  setActiveDashboardTab
}) {
  // Calculations for stats
  const activeOrdersCount = orders.filter(o => o.status !== 'Served' && o.status !== 'Completed').length;
  const completedOrders = orders.filter(o => o.status === 'Served' || o.status === 'Completed');
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  
  // Kitchen load calculation: 25% load per active preparing order, max 100%
  const kitchenLoad = Math.min(100, activeOrdersCount * 25);
  
  // Occupancy rate calculation
  const occupiedTables = tables.filter(t => t.status === 'Occupied').length;
  const occupancyRate = Math.round((occupiedTables / tables.length) * 100);

  // Digital Twin Health Score calculation
  // Base 100, drops by 10 for each Alert/Queue delay and active orders overload
  const healthScore = Math.max(50, 100 - (activeOrdersCount * 5) - (queue.length * 4));

  return (
    <div className="space-y-8">
      {/* 1. Digital Twin Analytics Strip */}
      <section className="bg-brand-charcoal-light border border-white/5 p-6 rounded-3xl space-y-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
              <HeartPulse size={16} className="text-red-500 animate-pulse" /> Restaurant Digital Twin
            </h3>
            <p className="text-xs text-white/40">Real-time operational health check</p>
          </div>
          <div className="bg-brand-orange/15 border border-brand-orange/30 px-3 py-1 rounded-full text-xs text-brand-orange font-bold flex items-center gap-1">
            <Sparkles size={12} /> AI Predictive Engine
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Health Score */}
          <div className="bg-brand-charcoal p-4 rounded-2xl border border-white/5 space-y-1">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Health Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold serif-font text-white">{healthScore}/100</span>
              <span className="text-[10px] text-green-400 font-semibold">Stable</span>
            </div>
            <div className="w-full bg-brand-charcoal-light h-1 rounded overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-500" 
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
          </div>

          {/* Kitchen Load */}
          <div className="bg-brand-charcoal p-4 rounded-2xl border border-white/5 space-y-1">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Kitchen Load</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold serif-font text-white">{kitchenLoad}%</span>
              <span className={`text-[10px] font-semibold ${kitchenLoad > 75 ? 'text-red-400' : 'text-green-400'}`}>
                {kitchenLoad > 75 ? 'Busy' : 'Normal'}
              </span>
            </div>
            <div className="w-full bg-brand-charcoal-light h-1 rounded overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${kitchenLoad > 75 ? 'bg-red-500' : 'bg-brand-orange'}`} 
                style={{ width: `${kitchenLoad}%` }}
              ></div>
            </div>
          </div>

          {/* Table Occupancy */}
          <div className="bg-brand-charcoal p-4 rounded-2xl border border-white/5 space-y-1">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Occupancy</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold serif-font text-white">{occupancyRate}%</span>
              <span className="text-[10px] text-white/50">{occupiedTables}/{tables.length} Tables</span>
            </div>
            <div className="w-full bg-brand-charcoal-light h-1 rounded overflow-hidden">
              <div 
                className="bg-brand-orange h-full transition-all duration-500" 
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>

          {/* Average Wait Time */}
          <div className="bg-brand-charcoal p-4 rounded-2xl border border-white/5 space-y-1">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Average Wait</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold serif-font text-white">{activeOrdersCount > 0 ? 8 + (activeOrdersCount * 2) : 5} mins</span>
              <span className="text-[10px] text-white/50 flex items-center gap-0.5"><Clock size={8} /> Est. delay</span>
            </div>
            <div className="w-full bg-brand-charcoal-light h-1 rounded overflow-hidden">
              <div className="bg-brand-orange h-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-brand-charcoal p-4 rounded-2xl border border-white/5 space-y-1 col-span-2 lg:col-span-1">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Today's Revenue</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold serif-font text-brand-orange">${totalRevenue.toFixed(2)}</span>
              <span className="text-[10px] text-white/50">{orders.length} orders</span>
            </div>
            <div className="w-full bg-brand-charcoal-light h-1 rounded overflow-hidden">
              <div className="bg-brand-orange h-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Tabs Control (8 cols) and notifications feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Core Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tab Selector */}
          <div className="flex bg-brand-charcoal-light border border-white/5 p-1 rounded-full w-fit">
            {[
              { id: 'orders', label: 'Orders Queue', icon: ClipboardList },
              { id: 'menu', label: 'Menu Toggles', icon: Package },
              { id: 'tables', label: 'Tables Map', icon: Map }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDashboardTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    activeDashboardTab === tab.id
                      ? 'bg-brand-orange text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT: Orders List */}
          {activeDashboardTab === 'orders' && (
            <div className="bg-brand-charcoal-light border border-white/5 p-6 rounded-3xl space-y-4">
              <h3 className="text-base font-bold text-white font-serif border-b border-white/5 pb-2">Active Kitchen Tickets</h3>

              <div className="space-y-4">
                {orders.filter(o => o.status !== 'Completed').map((order) => (
                  <div key={order.id} className="bg-brand-charcoal border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-orange/30 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">{order.id}</span>
                        <span className="text-xs font-bold text-[#D4AF37] bg-brand-charcoal-light/60 px-2.5 py-0.5 rounded-md border border-[#D4AF37]/20">
                          Table {order.table_number || 'Online'}
                        </span>
                        <span className="text-[10px] text-white/40 flex items-center gap-1">
                          <Clock size={10} /> Placed: {order.time}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="space-y-0.5">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs text-white/80 mr-4 inline-block">
                            • {item.name} <strong className="text-brand-orange">x{item.quantity}</strong>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-white/40">Status</p>
                        <p className={`text-xs font-bold ${
                          order.status === 'Pending' ? 'text-blue-400' :
                          order.status === 'Preparing' ? 'text-amber-400' :
                          order.status === 'Ready' ? 'text-emerald-400' : 'text-white/60'
                        }`}>{order.status}</p>
                      </div>

                      <div className="flex gap-2">
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                            className="bg-brand-orange hover:bg-brand-orange-light text-white font-bold uppercase tracking-wider text-[10px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
                          >
                            <Play size={10} /> Cook
                          </button>
                        )}
                        {order.status === 'Preparing' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'Ready')}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold uppercase tracking-wider text-[10px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
                          >
                            <Check size={10} /> Ready
                          </button>
                        )}
                        {order.status === 'Ready' && (
                          <button
                            onClick={() => onUpdateOrderStatus(order.id, 'Served')}
                            className="bg-white/10 hover:bg-white text-white hover:text-black font-bold uppercase tracking-wider text-[10px] px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
                          >
                            <UserCheck size={10} /> Serve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {orders.filter(o => o.status !== 'Completed').length === 0 && (
                  <div className="text-center py-12 text-white/35 text-xs">
                    No active orders at the moment. Excellent!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB CONTENT: Menu Toggles */}
          {activeDashboardTab === 'menu' && (
            <div className="bg-brand-charcoal-light border border-white/5 p-6 rounded-3xl space-y-4">
              <div className="border-b border-white/5 pb-2">
                <h3 className="text-base font-bold text-white font-serif">Menu Availability Switches</h3>
                <p className="text-[10px] text-white/40">Toggling these items instantly synchronizes state on the customer's digital menu</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menu.map((item) => (
                  <div key={item.id} className="bg-brand-charcoal border border-white/10 p-4 rounded-2xl flex justify-between items-center hover:border-brand-orange/20 transition-all">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-white/40">{item.category} • ${item.price.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => onToggleAvailability(item.id, !item.available)}
                      className={`text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-xl transition-all ${
                        item.available
                          ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {item.available ? 'Available' : 'Sold Out'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: Tables Grid */}
          {activeDashboardTab === 'tables' && (
            <div className="bg-brand-charcoal-light border border-white/5 p-6 rounded-3xl space-y-4">
              <div className="border-b border-white/5 pb-2">
                <h3 className="text-base font-bold text-white font-serif">Interactive Table Map</h3>
                <p className="text-[10px] text-white/40">Set table status. Marking a table "Available" auto-advances the waitlist queue.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tables.map((table) => {
                  let statusColor = 'border-white/15 text-white/60 bg-brand-charcoal';
                  if (table.status === 'Occupied') statusColor = 'border-brand-orange/40 text-brand-orange bg-brand-orange/5';
                  if (table.status === 'Reserved') statusColor = 'border-[#D4AF37]/40 text-[#D4AF37] bg-[rgba(212,175,55,0.05)]';

                  return (
                    <button
                      key={table.id}
                      onClick={() => {
                        const statusCycle = {
                          'Available': 'Occupied',
                          'Occupied': 'Reserved',
                          'Reserved': 'Available'
                        };
                        onToggleTableStatus(table.id, statusCycle[table.status]);
                      }}
                      className={`p-5 rounded-2xl border flex flex-col justify-between aspect-square text-center transition-all hover:scale-102 ${statusColor}`}
                    >
                      <span className="text-[10px] uppercase font-extrabold tracking-widest block">T-{table.table_no}</span>
                      <div className="py-2">
                        <span className="text-lg font-bold block">{table.status}</span>
                        <span className="text-[9px] uppercase tracking-wider block opacity-60">{table.capacity} Seats</span>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider bg-white/5 py-0.5 rounded text-white/40">Cycle State</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Operational Alerts & Notifications Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notifications feed */}
          <div className="bg-brand-charcoal-light border border-white/5 p-6 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                <AlertTriangle size={16} /> Operations Feed
              </h3>
              {notifications.length > 0 && (
                <button 
                  onClick={onClearNotifications}
                  className="text-[9px] uppercase text-white/40 hover:text-white font-bold"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[420px] no-scrollbar">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed animate-slide-up ${
                    notif.type === 'queue' 
                      ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' 
                      : 'bg-brand-orange/5 border-brand-orange/20 text-brand-orange'
                  }`}
                >
                  <p>{notif.message}</p>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="text-center py-12 text-white/30 space-y-2">
                  <Check size={18} className="mx-auto text-green-500" />
                  <p className="text-[10px] uppercase tracking-wider">No operational alerts</p>
                </div>
              )}
            </div>
          </div>

          {/* Waitlist Queue Admin Display */}
          <div className="bg-brand-charcoal-light border border-white/5 p-6 rounded-3xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80 border-b border-white/5 pb-2 flex items-center gap-1.5">
              <ClipboardList size={16} /> Waitlist Queue ({queue.length})
            </h3>

            <div className="space-y-3">
              {queue.map((q, idx) => (
                <div key={q.id} className="p-3 bg-brand-charcoal border border-white/10 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-white">#{idx + 1} {q.name}</p>
                    <p className="text-[10px] text-white/40">Group of {q.size} • wait: {q.waitTime}m</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#D4AF37] bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                    Seating Next
                  </span>
                </div>
              ))}

              {queue.length === 0 && (
                <div className="text-center py-6 text-white/30 text-xs">
                  Waitlist queue is empty
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
