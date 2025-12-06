import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Calendar, Activity, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  // Simple intersection observer for fade-in elements
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-up');
          entry.target.classList.remove('opacity-0');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        {/* Background Image with Parallax-like effect */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm font-medium text-gray-300">New High-Performance Zone Open</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight text-white animate-slide-up" style={{animationDelay: '0.1s'}}>
              Push Your Limits. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-glow">
                Define Your Grit.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl leading-relaxed animate-slide-up opacity-0" style={{animationDelay: '0.2s'}}>
              The ultimate ecosystem for athletes and innovators. World-class facilities, data-driven training, and a community that refuses to quit.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up opacity-0" style={{animationDelay: '0.3s'}}>
              <Link 
                to="/memberships" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full bg-primary text-black hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-neon"
              >
                Start Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/facilities" 
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-300"
              >
                Explore Campus
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Features Grid */}
      <section className="py-32 relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-16 reveal opacity-0">
            <div className="glass rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 border border-white/10">
              {[
                { label: 'Active Members', value: '2,000+' },
                { label: 'Facility Area', value: '50k sqft' },
                { label: 'Weekly Classes', value: '120+' },
                { label: 'Pro Coaches', value: '45+' },
              ].map((stat, i) => (
                <div key={i} className="text-center md:text-left md:border-r border-white/10 last:border-0">
                  <p className="text-3xl font-display font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mb-20 reveal opacity-0">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Why Choose GRIT X?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">More than just a gym. It's a complete performance lifestyle designed for the elite.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<Trophy className="h-8 w-8 text-primary" />}
              title="Elite Facilities"
              description="Train with Olympic-grade equipment and specialized zones designed for pro athletes."
              delay="0s"
            />
            <FeatureCard 
              icon={<Users className="h-8 w-8 text-accent" />}
              title="Community"
              description="Connect with like-minded individuals, founders, and industry leaders."
              delay="0.1s"
            />
            <FeatureCard 
              icon={<Calendar className="h-8 w-8 text-primary" />}
              title="Exclusive Events"
              description="Access to workshops, competitions, and networking nights."
              delay="0.2s"
            />
            <FeatureCard 
              icon={<Activity className="h-8 w-8 text-accent" />}
              title="Performance Tracking"
              description="Advanced metrics and health monitoring integration to track your gains."
              delay="0.3s"
            />
          </div>
        </div>
      </section>

      {/* Immersive CTA Section */}
      <section className="relative py-32 bg-surface overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-12 md:p-20 relative overflow-hidden border border-white/10 reveal opacity-0 shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">Ready to elevate your game?</h2>
                <p className="text-lg text-gray-400 mb-8">
                  Join the top 1% of performers. Start your free 14-day trial today and experience the difference.
                </p>
                <ul className="space-y-3 mb-8">
                  {['24/7 Access', 'Personalized Training Plan', 'Recovery Suite Access'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <ArrowRight className="h-3 w-3 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0">
                <Link 
                  to="/memberships" 
                  className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-full bg-white text-black hover:bg-primary transition-all duration-300 shadow-xl transform hover:-translate-y-1"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay: string }> = ({ icon, title, description, delay }) => (
  <div className="p-8 rounded-2xl bg-surface border border-white/5 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-2 reveal opacity-0" style={{ transitionDelay: delay }}>
    <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 font-display">{title}</h3>
    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{description}</p>
  </div>
);

export default Home;
