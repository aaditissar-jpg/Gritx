
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Users, CalendarCheck, DollarSign, Activity, TrendingUp } from 'lucide-react';
import { StatCardProps } from '../../types';
import { formatCurrency } from '../../lib/currency';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.admin.getStats().then(setStats);
  }, []);

  if (!stats) return <div className="text-gray-400 p-8 flex items-center gap-2"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> Connecting to Command Center...</div>;

  // Determine max value for chart scaling
  const maxTrend = stats.bookingTrends?.length > 0 
    ? Math.max(...stats.bookingTrends.map((t: any) => t.count)) 
    : 10;
  const chartMax = maxTrend === 0 ? 10 : maxTrend + 2;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-display font-bold text-white tracking-tight">Command Center</h2>
          <p className="text-gray-400 mt-1">Real-time platform overview</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-primary uppercase">System Operational</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Members" 
          value={stats.totalMembers || 0} 
          icon={<Users className="h-6 w-6 text-blue-400" />} 
          // trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Active Bookings" 
          value={stats.activeBookings || 0} 
          icon={<CalendarCheck className="h-6 w-6 text-primary" />} 
          // trend={{ value: 5, isPositive: true }}
        />
        <StatCard 
          title="Monthly Revenue" 
          value={formatCurrency(stats.monthlyRevenue || 0)} 
          icon={<DollarSign className="h-6 w-6 text-yellow-400" />} 
          // trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Pending Requests" 
          value={stats.pendingRequests || 0} 
          icon={<Activity className="h-6 w-6 text-red-400" />} 
          // trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section - Dynamic Booking Trends */}
        <div className="lg:col-span-2 bg-surface rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white font-display">Booking Trends</h3>
            <div className="bg-bg border border-white/10 rounded-lg px-3 py-1 text-sm text-gray-400">
               Last 7 Days
            </div>
          </div>
          
          <div className="h-64 w-full flex items-end gap-2 md:gap-4 relative z-10">
             {stats.bookingTrends && stats.bookingTrends.map((point: any, i: number) => {
               const heightPercent = (point.count / chartMax) * 100;
               return (
               <div key={i} className="flex-1 flex flex-col justify-end group/bar h-full">
                 <div className="text-center mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity text-xs font-bold text-primary">
                    {point.count}
                 </div>
                 <div 
                   className="w-full bg-white/5 rounded-t-sm hover:bg-primary transition-all duration-500 relative group-hover/bar:shadow-[0_0_15px_rgba(14,169,95,0.5)]"
                   style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                 >
                 </div>
                 <div className="text-center mt-2 text-xs text-gray-500 font-mono">
                    {point.date}
                 </div>
               </div>
             )})}
             {(!stats.bookingTrends || stats.bookingTrends.length === 0) && (
                 <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No data available
                 </div>
             )}
          </div>
          {/* Grid Lines */}
          <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none"></div>
        </div>

        {/* Recent Activity Feed - Dynamic */}
        <div className="bg-surface rounded-3xl p-8 border border-white/5 flex flex-col">
          <h3 className="text-xl font-bold text-white font-display mb-6">Live Feed</h3>
          <div className="space-y-6 overflow-y-auto custom-scrollbar flex-grow max-h-[300px]">
            {stats.recentActivity && stats.recentActivity.map((item: any, i: number) => {
                // Formatting relative time roughly
                const timeDiff = Math.floor((new Date().getTime() - new Date(item.rawTime).getTime()) / 60000); // minutes
                let timeString = timeDiff < 1 ? 'Just now' : `${timeDiff} min ago`;
                if (timeDiff > 60) timeString = `${Math.floor(timeDiff/60)} hrs ago`;
                if (timeDiff > 1440) timeString = `${Math.floor(timeDiff/1440)} days ago`;

                return (
                  <div key={i} className="flex gap-4 items-start animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0 shadow-[0_0_10px_rgba(14,169,95,0.8)] animate-pulse" />
                    <div>
                      <p className="text-sm text-gray-300">
                        <span className="font-bold text-white">{item.user.split('@')[0]}</span> {item.action} 
                        <span className="text-primary"> {item.target}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{timeString}</p>
                    </div>
                  </div>
                );
            })}
            
            {(!stats.recentActivity || stats.recentActivity.length === 0) && (
                <div className="text-gray-500 text-sm italic mt-4">No recent activity found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => (
  <div className="bg-surface p-6 rounded-3xl border border-white/5 flex flex-col justify-between hover:border-primary/30 transition-all duration-300 hover:shadow-neon group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity scale-150 transform translate-x-2 -translate-y-2">
       {icon}
    </div>
    
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-3 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-primary/20 group-hover:border-primary/20 transition-colors">
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          <TrendingUp className={`h-3 w-3 ${!trend.isPositive && 'transform rotate-180'}`} />
          {trend.value}%
        </div>
      )}
    </div>
    
    <div className="relative z-10">
      <p className="text-sm font-medium text-gray-400 mb-1 tracking-wide">{title}</p>
      <p className="text-3xl font-bold text-white font-display tracking-tight">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
