
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Booking } from '../../types';
import { Search, Loader2, Eye, X, Check, XCircle, FileText, Activity, Calendar, MessageSquare, Mail, RefreshCw, ExternalLink } from 'lucide-react';

const AdminBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [processing, setProcessing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchBookings();
  }, [lastUpdated]);

  const fetchBookings = () => {
    setLoading(true);
    api.bookings.list()
      .then(setBookings)
      .finally(() => setLoading(false));
  };

  const handleStatusUpdate = async (status: 'confirmed' | 'cancelled') => {
    if (!selectedBooking) return;
    setProcessing(true);
    
    try {
        const updatedRecord = await api.bookings.updateStatus(selectedBooking.id, status);
        const verifiedRecord = await api.bookings.getById(selectedBooking.id);
        
        if (!verifiedRecord || verifiedRecord.status !== status) {
             throw new Error(`Server Verification Failed.`);
        }

        setSelectedBooking(verifiedRecord);
        setBookings(prev => prev.map(b => 
            b.id === selectedBooking.id ? verifiedRecord : b
        ));

    } catch (err: any) {
        console.error("Failed to update status", err);
        alert(`Failed to save status: ${err.message || 'Unknown error'}. Please try again.`);
    } finally {
        setProcessing(false);
    }
  };

  const generateGoogleCalendarLink = (booking: Booking) => {
    const startTimeParts = booking.startTime.split(':');
    const endTimeParts = booking.endTime.split(':');
    const dateStr = booking.date.replace(/-/g, '');
    const startStr = `${dateStr}T${startTimeParts[0]}${startTimeParts[1]}00`;
    const endStr = `${dateStr}T${endTimeParts[0]}${endTimeParts[1]}00`;
    const details = `Booking for ${booking.facilityName} by ${booking.userName}. Equipment: ${booking.equipmentNeeded || 'None'}`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`GRIT X: ${booking.facilityName}`)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(details)}&location=${encodeURIComponent('GRIT X Sports Center')}`;
  };

  const handleWhatsApp = (booking: Booking) => {
      const text = `Hi ${booking.userName}, your booking for ${booking.facilityName} on ${booking.date} at ${booking.startTime} has been ${booking.status.toUpperCase()}.`;
      const phone = booking.userPhone ? booking.userPhone.replace(/\D/g, '') : '';
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getGmailLink = (booking: Booking) => {
      const subject = `Booking Confirmation: ${booking.facilityName}`;
      const body = `Hi ${booking.userName},\n\nThis is a confirmation for your booking at GRIT X.\n\nFacility: ${booking.facilityName}\nDate: ${booking.date}\nTime: ${booking.startTime} - ${booking.endTime}\n\nPlease find your invoice attached (if applicable).\n\nBest,\nGRIT X Team`;
      
      // Explicitly constructs a Gmail Web Compose URL
      return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(booking.userName)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="animate-fade-in relative">
      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}></div>
            <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h3 className="font-display text-xl font-bold text-white">Booking Details</h3>
                    <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white p-2">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Facility</p>
                            <p className="text-lg font-bold text-white font-display">{selectedBooking.facilityName}</p>
                        </div>
                         <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                             <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                                selectedBooking.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                selectedBooking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                {selectedBooking.status.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/5">
                        <h4 className="text-sm font-bold text-white mb-4 border-b border-white/5 pb-2">Schedule & User</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-400 text-xs">Date</p>
                                <p className="text-white">{selectedBooking.date}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Time</p>
                                <p className="text-primary font-mono">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">User Name</p>
                                <p className="text-white">{selectedBooking.userName}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">Phone</p>
                                <p className="text-white font-mono text-xs">{selectedBooking.userPhone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/5">
                             <div className="flex items-start gap-3">
                                <FileText className="h-5 w-5 text-blue-400 mt-1" />
                                <div>
                                    <p className="text-sm font-bold text-white">Equipment Requested</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {selectedBooking.equipmentNeeded || "No equipment specified."}
                                    </p>
                                </div>
                             </div>
                        </div>

                        <div className="bg-surfaceHighlight p-4 rounded-xl border border-white/5">
                             <div className="flex items-start gap-3">
                                <Activity className="h-5 w-5 text-red-400 mt-1" />
                                <div>
                                    <p className="text-sm font-bold text-white">Medical Concerns</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        {selectedBooking.medicalConcerns || "No medical concerns listed."}
                                    </p>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* ACTIONS: Calendar / WhatsApp / Gmail */}
                    {selectedBooking.status === 'confirmed' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 animate-fade-in">
                            <a 
                                href={generateGoogleCalendarLink(selectedBooking)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors"
                            >
                                <Calendar className="h-4 w-4 text-blue-400" />
                                Add to Calendar
                            </a>
                            <button 
                                onClick={() => handleWhatsApp(selectedBooking)}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors"
                            >
                                <MessageSquare className="h-4 w-4 text-green-400" />
                                WhatsApp
                            </button>
                            <a 
                                href={getGmailLink(selectedBooking)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium text-white transition-colors group"
                            >
                                <Mail className="h-4 w-4 text-red-400" />
                                <span>Open in Gmail</span>
                                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-4">
                    {selectedBooking.status === 'pending' && (
                        <>
                            <button 
                                onClick={() => handleStatusUpdate('cancelled')}
                                disabled={processing}
                                className="px-6 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors font-medium flex items-center gap-2"
                            >
                                {processing ? <Loader2 className="h-4 w-4 animate-spin"/> : <XCircle className="h-4 w-4" />}
                                Reject
                            </button>
                            <button 
                                onClick={() => handleStatusUpdate('confirmed')}
                                disabled={processing}
                                className="px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-white transition-colors shadow-neon flex items-center gap-2"
                            >
                                {processing ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4" />}
                                Approve
                            </button>
                        </>
                    )}
                    {selectedBooking.status !== 'pending' && (
                        <button onClick={() => setSelectedBooking(null)} className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                            Close
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
           <h2 className="text-3xl font-display font-bold text-white tracking-tight">Bookings</h2>
           <p className="text-gray-400 text-sm mt-1">Manage schedules and reservations</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2.5 bg-surface border border-white/10 rounded-xl text-sm text-white focus:border-primary focus:outline-none w-64"
            />
          </div>
          <button 
             onClick={() => setLastUpdated(new Date())}
             className="bg-surface hover:bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        {loading ? (
             <div className="p-20 flex justify-center items-center">
                 <Loader2 className="h-8 w-8 text-primary animate-spin" />
             </div>
        ) : (
            <>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5">
                    <thead>
                    <tr className="bg-black/20">
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Facility</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-sm font-bold text-white border border-white/10 shadow-inner">
                                {booking.userName ? booking.userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-bold text-white">{booking.userName}</div>
                                <div className="text-xs text-gray-500">ID: ...{booking.userId?.substr(-4)}</div>
                            </div>
                            </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <span className="text-sm text-gray-300 font-medium">{booking.facilityName}</span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <div className="text-sm text-gray-400 font-mono">
                            {booking.date} <br/>
                            <span className="text-gray-500">{booking.startTime} - {booking.endTime}</span>
                            </div>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${
                            booking.status === 'confirmed' ? 'bg-green-500/5 text-green-400 border-green-500/20' :
                            booking.status === 'pending' ? 'bg-yellow-500/5 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/5 text-red-400 border-red-500/20'
                            }`}>
                            {booking.status.toUpperCase()}
                            </span>
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                                onClick={() => setSelectedBooking(booking)}
                                className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg flex items-center gap-2 ml-auto"
                            >
                                <Eye className="h-4 w-4" />
                                {booking.status === 'pending' ? 'Review' : 'View'}
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                {bookings.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No bookings found.
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
