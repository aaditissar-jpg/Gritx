import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { api } from '../services/api';

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  return (
    <div className="bg-bg min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
          {/* Info Side */}
          <div className="bg-gradient-to-br from-primary to-primary-hover text-black p-12 md:w-2/5 relative overflow-hidden">
             {/* Abstract Pattern */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-bold mb-6">Get in Touch</h2>
              <p className="text-black/70 font-medium text-lg mb-12">
                Have questions about memberships, facility bookings, or events? Our team is here to help.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Visit Us</h4>
                    <p className="text-black/70">123 Grit Avenue<br/>Sport City, ST 90210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-black/10 rounded-lg">
                    <Mail className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Email</h4>
                    <p className="text-black/70">support@gritx.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="p-3 bg-black/10 rounded-lg">
                    <Phone className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Call</h4>
                    <p className="text-black/70">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-12 md:w-3/5 bg-surface">
            <h2 className="font-display text-3xl font-bold text-white mb-8">Send us a message</h2>
            <form
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                setStatus('sending');
                setError('');
                try {
                  await api.contacts.submit({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    message: form.message,
                  });
                  setStatus('success');
                  setForm({ name: '', email: '', phone: '', message: '' });
                } catch (err: any) {
                  console.error(err);
                  setError(err.message || 'Failed to send message.');
                  setStatus('error');
                }
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-600 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-600 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone (optional)</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-600 transition-all"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-600 transition-all"
                  placeholder="How can we help?"
                />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              {status === 'success' && <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">Message sent! Our team will get back to you.</p>}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-primary hover:bg-primary-hover text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-neon disabled:opacity-70"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
