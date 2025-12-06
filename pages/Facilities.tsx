import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Facility } from '../types';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../lib/currency';

const Facilities: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await api.facilities.list();
        setFacilities(data);
      } catch (error) {
        console.error("Failed to load facilities", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-6">World Class <span className="text-primary">Infrastructure</span></h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            Discover our premium spaces designed for performance, collaboration, and success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch auto-rows-fr">
          {facilities.map((facility) => (
            <Link key={facility.id} to={`/facilities/${facility.slug}`} className="group block h-full">
              <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-neon group-hover:-translate-y-1 h-full min-h-[520px] flex flex-col">
                <div className="relative aspect-[5/3] overflow-hidden bg-surfaceHighlight">
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent z-10 opacity-60" />
                  <img 
                    src={facility.image} 
                    alt={facility.name} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-primary border border-white/10">
                    {`${formatCurrency(facility.hourlyRate)}/hr`}
                  </div>
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display text-2xl font-bold text-white group-hover:text-primary transition-colors">
                      {facility.name}
                    </h3>
                    <ArrowRight className="h-6 w-6 text-gray-500 group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-gray-400 mb-6 line-clamp-2 flex-grow">
                    {facility.description}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500 border-t border-white/5 pt-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>Cap: {facility.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Zone A</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Facilities;
