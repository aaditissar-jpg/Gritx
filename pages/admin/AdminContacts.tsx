import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ContactMessage } from '../../types';
import { Loader2, Mail, Phone, MessageSquare, RefreshCw, User } from 'lucide-react';

const AdminContacts: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    setLoading(true);
    api.contacts.list().then(setMessages).finally(() => setLoading(false));
  }, [lastUpdated]);

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight">Contact Inbox</h2>
          <p className="text-gray-400 text-sm mt-1">Messages from the Contact page</p>
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
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No messages yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/5">
              <thead>
                <tr className="bg-black/20">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {messages.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{m.name}</p>
                          <p className="text-xs text-gray-500">ID: {m.id.slice(0, 6)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {m.email}
                      </div>
                      {m.phone && (
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" /> {m.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2 text-sm text-gray-300">
                        <MessageSquare className="h-4 w-4 text-blue-400 mt-0.5" />
                        <span>{m.message}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(m.createdAt).toLocaleString()}
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

export default AdminContacts;
