import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Event } from '../types';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRsvp, setShowRsvp] = useState(false);
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [rsvpStatus, setRsvpStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [rsvpError, setRsvpError] = useState<string>('');

  useEffect(() => {
    if (id) {
      api.events.getById(id).then(found => setEvent(found ?? null)).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-white flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-bg text-white flex items-center justify-center">
        Event not found
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen text-white pb-16">
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent z-10" />
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 px-4 max-w-6xl mx-auto w-full">
          <Link
            to="/events"
            className="absolute top-6 left-4 md:left-8 bg-black/40 hover:bg-white/10 backdrop-blur-md p-3 rounded-full text-white border border-white/10 transition-all hover:scale-110"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="space-y-4">
            <span className="inline-flex px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20 tracking-wider w-fit">
              {event.category}
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight text-glow max-w-4xl">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-card p-8 rounded-3xl border border-white/5">
              <h2 className="font-display text-2xl font-bold mb-4">Event Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {event.description}
              </p>
            </section>

            <section className="glass-card p-8 rounded-3xl border border-white/5">
              <h3 className="font-display text-xl font-bold mb-4">Schedule & Highlights</h3>
              <ul className="space-y-3 text-gray-300">
                {(event.highlights && event.highlights.length > 0
                  ? event.highlights
                  : [
                      'Arrive early for check-in and warm-up to secure prime slots and equipment.',
                      'Expert coordinators on-site to guide participants and answer questions.',
                      'Food, hydration, and lounge zones available throughout the venue.',
                    ]).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="glass-card p-8 rounded-3xl border border-white/5 space-y-6 h-fit sticky top-20">
            <div>
              <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Date & Time</p>
              <p className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                {event.date}
              </p>
              <p className="text-gray-300 flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-primary" />
                {event.time}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Location</p>
              <p className="text-gray-200 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {event.location}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowRsvp(true);
                  setRsvpStatus('idle');
                  setRsvpError('');
                }}
                className="w-full bg-primary hover:bg-white text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
              >
                RSVP Interest
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/contact"
                className="block text-center w-full bg-transparent border border-white/10 hover:border-white text-white font-bold py-3 px-4 rounded-xl transition-all hover:bg-white/5"
              >
                Contact Team
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {showRsvp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-white/10 rounded-3xl w-full max-w-2xl relative shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <div>
                <p className="text-xs uppercase text-gray-500 tracking-[0.25em]">Event RSVP</p>
                <h3 className="text-2xl font-display font-bold text-white mt-1">{event.title}</h3>
              </div>
              <button
                onClick={() => setShowRsvp(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
              >
                <ArrowRight className="h-5 w-5 transform rotate-180" />
              </button>
            </div>

            <form
              className="p-6 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!event) return;
                setRsvpStatus('submitting');
                setRsvpError('');
                try {
                  await api.events.rsvp({
                    eventId: event.id,
                    eventTitle: event.title,
                    name: rsvpForm.name,
                    email: rsvpForm.email,
                    phone: rsvpForm.phone,
                    message: rsvpForm.message,
                  });
                  setRsvpStatus('success');
                  setRsvpForm({ name: '', email: '', phone: '', message: '' });
                } catch (err: any) {
                  console.error(err);
                  setRsvpError(err.message || 'Failed to submit. Please try again.');
                  setRsvpStatus('error');
                }
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Full Name</label>
                  <input
                    required
                    value={rsvpForm.name}
                    onChange={(e) => setRsvpForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 text-white placeholder-gray-600"
                    placeholder="Alex Johnson"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                  <input
                    required
                    type="email"
                    value={rsvpForm.email}
                    onChange={(e) => setRsvpForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 text-white placeholder-gray-600"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Phone</label>
                  <input
                    value={rsvpForm.phone}
                    onChange={(e) => setRsvpForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 text-white placeholder-gray-600"
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Questions / Notes</label>
                  <input
                    value={rsvpForm.message}
                    onChange={(e) => setRsvpForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/30 text-white placeholder-gray-600"
                    placeholder="Any specific request?"
                  />
                </div>
              </div>

              {rsvpError && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{rsvpError}</p>}
              {rsvpStatus === 'success' && <p className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">RSVP received! Our team will reach out soon.</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRsvp(false)}
                  className="px-4 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 border border-white/10 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={rsvpStatus === 'submitting'}
                  className="px-5 py-3 rounded-xl bg-primary text-black font-bold hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {rsvpStatus === 'submitting' ? 'Submitting...' : 'Submit RSVP'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
