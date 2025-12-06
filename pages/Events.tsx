import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Event } from '../types';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const ADMIN_EMAIL = 'aadit.issar@gmail.com';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    category: 'Competition' as Event['category'],
    date: '',
    time: '',
    image: '',
    highlights: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.events.list().then(setEvents);
    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email?.toLowerCase();
      setIsAdmin(email === ADMIN_EMAIL);
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreating(true);
    try {
      const highlights = form.highlights
        .split('\n')
        .map(h => h.trim())
        .filter(Boolean);

      const newEvent = await api.events.create({
        ...form,
        highlights,
      });
      setEvents(prev => [newEvent, ...prev]);
      setShowCreate(false);
      setForm({
        title: '',
        description: '',
        location: '',
        category: 'Competition',
        date: '',
        time: '',
        image: '',
        highlights: '',
      });
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create event.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <h1 className="font-display text-5xl font-bold text-white mb-4">Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Events</span></h1>
            <p className="text-xl text-gray-400">Competitions, workshops, and community gatherings.</p>
          </div>
          <div className="mt-6 md:mt-0">
             <div className="flex items-center gap-3">
               <select className="bg-surface border border-white/10 text-white rounded-lg px-6 py-3 focus:outline-none focus:border-primary appearance-none cursor-pointer hover:bg-white/5 transition-colors">
                 <option>All Categories</option>
                 <option>Wellness</option>
                 <option>Professional</option>
                 <option>Competition</option>
               </select>
               {isAdmin && (
                 <button
                   onClick={() => setShowCreate(true)}
                   className="bg-primary text-black font-bold px-4 py-3 rounded-lg hover:bg-white transition-colors shadow-neon"
                 >
                   Create Event
                 </button>
               )}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          {events.map((event) => (
            <div 
              key={event.id} 
              onClick={() => navigate(`/events/${event.id}`)}
              className="group bg-surface border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-primary/40 transition-all duration-300 cursor-pointer"
            >
              <div
                className="md:w-1/3 relative overflow-hidden bg-surfaceHighlight"
                style={{ paddingTop: '22.75%' }} // 273 / 1200 * 100 to force the fixed 1200x273 ratio
              >
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 rounded-md bg-black/80 backdrop-blur text-primary text-xs font-bold uppercase border border-primary/20">
                    {event.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-4 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{event.time}</span>
                  </div>
                </div>
                
                <h3 className="font-display text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed max-w-2xl">{event.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="flex items-center gap-2 text-white font-bold hover:text-primary transition-colors group/btn"
                  >
                    More Details 
                    <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-surface border border-white/10 rounded-2xl p-8 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display text-white font-bold">Create Event</h2>
              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>

            {createError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm">
                {createError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  required
                  type="date"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                <input
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  placeholder="Time (e.g. 10:00 AM - 7:00 PM)"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Event['category'] })}
                >
                  <option value="Wellness">Wellness</option>
                  <option value="Social">Social</option>
                  <option value="Professional">Professional</option>
                  <option value="Competition">Competition</option>
                </select>
              </div>

              <input
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />

              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary min-h-[100px]"
                placeholder="Schedule & Highlights (one per line)"
                value={form.highlights}
                onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              />

              <textarea
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary min-h-[120px]"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-3 rounded-lg bg-primary text-black font-bold hover:bg-white transition-colors shadow-neon disabled:opacity-50"
                >
                  {creating ? 'Saving...' : 'Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
