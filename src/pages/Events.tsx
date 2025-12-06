
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Event } from '../types';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.events.list().then(setEvents);
  }, []);

  return (
    <div className="bg-bg min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
          <div>
            <h1 className="font-display text-5xl font-bold text-white mb-4">Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Events</span></h1>
            <p className="text-xl text-gray-400">Competitions, workshops, and community gatherings.</p>
          </div>
          <div className="mt-6 md:mt-0">
             <select className="bg-surface border border-white/10 text-white rounded-lg px-6 py-3 focus:outline-none focus:border-primary appearance-none cursor-pointer hover:bg-white/5 transition-colors">
               <option>All Categories</option>
               <option>Wellness</option>
               <option>Professional</option>
               <option>Competition</option>
             </select>
          </div>
        </div>

        <div className="space-y-6">
          {events.map((event, idx) => (
            <div key={event.id} className="group bg-surface border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-primary/40 transition-all duration-300">
              <div
                className="md:w-1/3 relative overflow-hidden bg-surfaceHighlight"
                style={{ paddingTop: '22.75%' }} // 273 / 1200 * 100 to force the fixed 1200x273 ratio
              >
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                <img 
                  src={event.image} 
                  alt={event.title} 
                  referrerPolicy="no-referrer"
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
                  <button className="flex items-center gap-2 text-white font-bold hover:text-primary transition-colors group/btn">
                    Register Now 
                    <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
