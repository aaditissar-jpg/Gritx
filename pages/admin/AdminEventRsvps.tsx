import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { EventRsvp } from '../../types';
import { Loader2, Calendar, Mail, Phone, MessageSquare, RefreshCw } from 'lucide-react';

const AdminEventRsvps: React.FC = () => {
  const [rsvps, setRsvps] = useState<EventRsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    setLoading(true);
    api.events.listRsvps().then(setRsvps).finally(() => setLoading(false));
  }, [lastUpdated]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Event RSVPs</h2>
          <p className="text-gray-400 text-sm mt-1">Incoming interest for events</p>
        </div>
        <button
          onClick={() => setLastUpdated(new Date())}
          className="bg-surface hover:bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="bg-surface rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-16 flex items-center justify-center text-gray-400 gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Loading RSVPs...
          </div>
        ) : rsvps.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No RSVPs yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead>
                <tr className="bg-black/20">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                          <Calendar className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{rsvp.eventTitle || 'Event'}</p>
                          <p className="text-xs text-gray-500">ID: {rsvp.eventId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white font-semibold">{rsvp.name}</div>
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {rsvp.email}
                      </div>
                      {rsvp.phone && (
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {rsvp.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-300">
                        <MessageSquare className="h-4 w-4 text-blue-400 mt-0.5" />
                        <span>{rsvp.message || '—'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(rsvp.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventRsvps;
