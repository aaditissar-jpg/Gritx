import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-bg min-h-screen py-16 text-gray-100">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        {/* Who We Are */}
        <section className="space-y-6">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Who We Are</h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            GRIT X was built for one purpose — to redefine what an athletic ecosystem can be. What started as a boutique training center has evolved into a multi-discipline performance hub where athletes, coaches, creators, and sports enthusiasts come together to push boundaries.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            Our campus combines elite-grade turf arenas, high-performance labs, recovery zones, and collaborative learning spaces — all designed to support the complete athlete. From grassroots talent to corporate teams looking to elevate their game, GRIT X provides the structure, science, and support needed to unlock true potential.
          </p>
        </section>

        {/* Meet the Team */}
        <section className="space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Meet the Team Behind GRIT X</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: 'Rohit Malhotra',
                role: 'Founder & Performance Strategist',
                bio: 'Former athlete turned sports entrepreneur with 15+ years in athletic development. Leads GRIT X with vision and purpose.',
              },
              {
                name: 'Simran Kaur',
                role: 'Chief Operations Officer',
                bio: 'Operational backbone ensuring seamless execution across programs, facilities, and community experiences with an athlete-first approach.',
              },
              {
                name: 'Aman Verma',
                role: 'Head Coach & Program Director',
                bio: 'National-level coach specializing in youth development and advanced performance training. Leads coaching curriculum and mentorship.',
              },
            ].map((member) => (
              <div key={member.name} className="bg-surface border border-white/10 rounded-xl p-4 space-y-2">
                <p className="text-white font-semibold">{member.name}</p>
                <p className="text-primary text-sm">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Athletes Choose GRIT X */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Why Athletes Choose GRIT X</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: '🏆 Elite Coaching', text: 'Certified trainers and sport-specific experts.' },
              { title: '⚡ Next-Gen Infrastructure', text: 'World-class surfaces, calibrated equipment & performance tech.' },
              { title: '💬 Supportive Community', text: 'Athletes, coaches, families, corporates — all growing together.' },
              { title: '📈 Real Results', text: 'Programs designed for measurable improvement and long-term development.' },
            ].map((item) => (
              <div key={item.title} className="bg-surface border border-white/10 rounded-xl p-4 text-sm text-gray-200 space-y-2">
                <p className="font-semibold text-white">{item.title}</p>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Location Map */}
        <section className="space-y-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Find Us</h2>
          <p className="text-gray-300">
            Shop No. 4, Ground Floor, Icon Plaza, Sector 84, Near SS Coralwood, Opposite Icon School, Gurugram, Haryana 122002
          </p>
          <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <iframe
              title="GRIT X Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.085591920844!2d77.0266!3d28.3572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDIxJzI1LjkiTiA3N8KwMDEnMzYuMyJF!5e0!3m2!1sen!2sin!4v0000000000"
              className="w-full h-80"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
