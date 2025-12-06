
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Facility } from '../types';
import { Check, Calendar, ArrowLeft, Star } from 'lucide-react';
import BookingModal from '../components/BookingModal';

const FacilityDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      api.facilities.getBySlug(slug).then(setFacility).finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-bg text-white flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div></div>;
  if (!facility) return <div className="min-h-screen bg-bg text-white flex items-center justify-center">Facility not found</div>;

  return (
    <div className="bg-bg min-h-screen text-white pb-20">
      <BookingModal 
        facility={facility} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Immersive Header */}
      <div className="relative h-[60vh] w-full overflow-hidden group bg-surfaceHighlight">
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent z-10" />
        <img 
          src={facility.image} 
          alt={facility.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[2s]"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-20 px-4 max-w-7xl mx-auto w-full">
          <Link 
            to="/facilities" 
            className="absolute top-8 left-4 md:left-8 bg-black/40 hover:bg-white/10 backdrop-blur-md p-3 rounded-full text-white border border-white/10 transition-all hover:scale-110"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20 tracking-wider">PREMIUM FACILITY</span>
              <div className="flex items-center gap-1 text-yellow-500 bg-black/30 backdrop-blur px-2 py-0.5 rounded-full border border-white/5">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-xs font-medium text-white">4.9</span>
              </div>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 text-glow tracking-tight">{facility.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-primary rounded-full"></span>
                Overview
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                {facility.description}
              </p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-display text-2xl font-bold text-white mb-6">Elite Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {facility.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-surface/50 border border-white/5 p-5 rounded-2xl hover:border-primary/30 transition-all group hover:bg-surface">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-gray-300 font-medium group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card rounded-3xl p-8 sticky top-24 shadow-2xl shadow-black/50 border-t border-white/10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-sm text-gray-400 mb-1 font-medium uppercase tracking-wider">Standard Rate</p>
                  <p className="text-4xl font-display font-bold text-white">${facility.hourlyRate}<span className="text-lg text-gray-500 font-sans font-normal">/hr</span></p>
                </div>
                <div className="flex flex-col items-end">
                   <span className="flex h-3 w-3 relative mb-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </span>
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">Available</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-primary hover:bg-white text-black font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-neon hover:-translate-y-1"
                >
                  <Calendar className="h-5 w-5" />
                  Book Session
                </button>
                
                <button className="w-full bg-transparent border border-white/10 hover:border-white text-white font-bold py-4 px-6 rounded-xl transition-all hover:bg-white/5">
                  Contact Support
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5">
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  *Instant confirmation available. Free cancellation up to 24h before booking time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetail;
