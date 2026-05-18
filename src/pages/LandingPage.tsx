import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Shield, Map, Star, 
  Building2, Home, Key, MapPin, 
  ChevronRight, BadgeCheck
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { PropertyCard } from '../components/shared/PropertyCard';
import { FeatureCard } from '../components/shared/FeatureCard';
import { useNavigate } from 'react-router-dom';
import { fetchPublicProperties } from '../api/client';

// Dummy Data
const FEATURED_PROPERTIES = [
  { id: 1, title: 'Luxury Villa with Pool', price: '₹2.5 Cr', location: 'Lathi Road, Amreli', beds: 5, baths: 6, area: '4,500 sqft', image: 'https://images.unsplash.com/photo-1613490900233-141c5123d248?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Modern Penthouse', price: '₹1.2 Cr', location: 'Chakkargadh Road, Amreli', beds: 3, baths: 2, area: '2,100 sqft', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Spacious Family Home', price: '₹85 Lakhs', location: 'Jesingpara, Amreli', beds: 4, baths: 3, area: '3,200 sqft', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Minimalist Smart House', price: '₹95 Lakhs', location: 'Liliya Road, Amreli', beds: 3, baths: 3, area: '2,800 sqft', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'Suburban Estate', price: '₹1.75 Cr', location: 'Gajera Para, Amreli', beds: 6, baths: 5, area: '5,000 sqft', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
  { id: 6, title: 'Independent House', price: '₹1.4 Cr', location: 'Station Road, Amreli', beds: 4, baths: 4, area: '3,500 sqft', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800' },
];

const CITIES = [
  { name: 'Lathi Road', count: '120+', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f7415e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Chakkargadh', count: '45+', image: 'https://images.unsplash.com/photo-1522256662241-11910d65b704?auto=format&fit=crop&q=80&w=400' },
  { name: 'Jesingpara', count: '210+', image: 'https://images.unsplash.com/photo-1558296720-33306db7de09?auto=format&fit=crop&q=80&w=400' },
  { name: 'Station Road', count: '90+', image: 'https://images.unsplash.com/photo-1605389659345-42cb23359d3e?auto=format&fit=crop&q=80&w=400' },
];

const TESTIMONIALS = [
  { name: 'Sarah Jenkins', role: 'Homeowner', content: 'EstateX made finding our dream home incredibly seamless. The verified listings gave us peace of mind.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { name: 'David Chen', role: 'Property Investor', content: 'As an investor, the smart search and market insights are invaluable. Highly recommend this platform.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { name: 'Emily Rodriguez', role: 'First-time Buyer', content: 'The transparent process and responsive agents helped us navigate our first purchase without stress.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);

  useEffect(() => {
    fetchPublicProperties('limit=6&featured=true')
      .then(res => setFeaturedProperties(res.properties || []))
      .catch(console.error);
  }, []);

  return (
    <div className="w-full">
      {/* 1 & 2. Hero Section & Smart Search */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-neutral-bg">
        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center lg:mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
                <BadgeCheck className="w-5 h-5" /> Trusted by Thousands of Home Buyers
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-neutral-primary leading-tight mb-6">
                Find More Than a House.<br/>
                <span className="text-primary">Find Home.</span>
              </h1>
              <p className="text-xl text-neutral-secondary mb-8 leading-relaxed">
                Experience the finest real estate marketplace. Discover premium properties, verified listings, and a seamless buying experience tailored just for you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="px-8" onClick={() => navigate('/search')}>Explore Properties</Button>
                <Button size="lg" variant="outline" className="px-8 bg-white">List Your Property</Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[600px]">
                <img src="/luxury_home_hero.png" alt="Luxury Home" className="w-full h-full object-cover" />
              </div>
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-10 -left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex-center"><Building2 /></div>
                <div><div className="font-bold text-xl">20K+</div><div className="text-sm text-neutral-secondary">Properties</div></div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute bottom-20 -right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-secondary/30 text-[#D4AF37] rounded-full flex-center"><Star /></div>
                <div><div className="font-bold text-xl">15K+</div><div className="text-sm text-neutral-secondary">Happy Buyers</div></div>
              </motion.div>
            </motion.div>
          </div>

          {/* Smart Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 relative z-20 bg-white rounded-2xl shadow-xl p-4 lg:p-6 border border-neutral-border max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-neutral-secondary mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-secondary w-5 h-5" />
                  <input type="text" placeholder="Neighborhood in Amreli..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none transition-colors bg-neutral-bg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-secondary mb-2">Property Type</label>
                <select className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none transition-colors bg-neutral-bg appearance-none">
                  <option>All Types</option>
                  <option>Villa</option>
                  <option>Apartment</option>
                  <option>House</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-secondary mb-2">Budget</label>
                <select className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none transition-colors bg-neutral-bg appearance-none">
                  <option>Any Budget</option>
                  <option>₹20L - ₹50L</option>
                  <option>₹50L - ₹1Cr</option>
                  <option>₹1Cr+</option>
                </select>
              </div>
              <Button size="lg" className="w-full gap-2 h-[50px]" onClick={() => navigate('/search')}><Search className="w-5 h-5" /> Search</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Featured Properties */}
      <section className="py-20 bg-neutral-bg-secondary">
        <div className="container-custom">
          <SectionHeader title="Featured Properties" subtitle="Handpicked premium listings tailored for modern living." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredProperties.length > 0 ? featuredProperties : FEATURED_PROPERTIES).map((prop, idx) => (
              <motion.div key={prop.id || prop._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}>
                <PropertyCard {...prop} id={prop.id || prop._id} />
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="gap-2 bg-white" onClick={() => navigate('/search')}>View All Properties <ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <SectionHeader title="Why Choose EstateX" subtitle="We redefine the real estate experience with trust, simplicity, and premium quality." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={Shield} title="Verified Properties" description="Every property goes through a strict verification process for your peace of mind." />
            <FeatureCard icon={Search} title="Smart Search" description="Find exactly what you need with our intelligent, lightning-fast search tools." />
            <FeatureCard icon={BadgeCheck} title="Trusted Sellers" description="Connect only with highly rated, verified property sellers and brokers." />
            <FeatureCard icon={Key} title="Easy Property Listing" description="List your property in minutes and reach thousands of potential buyers instantly." />
          </div>
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="py-20 bg-neutral-bg-secondary">
        <div className="container-custom">
          <SectionHeader title="How EstateX Works" subtitle="Your journey to a new home in three simple steps." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-neutral-divider -translate-y-1/2 z-0"></div>
            {[
              { step: 1, title: 'Search', desc: 'Find your perfect property using our smart filters.', icon: Search },
              { step: 2, title: 'Visit', desc: 'Schedule a visit and explore the property in person.', icon: Map },
              { step: 3, title: 'Own', desc: 'Complete the paperwork and move into your new home.', icon: Key },
            ].map((item, idx) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.2 }} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-soft flex-center text-primary mb-6 border border-neutral-border relative">
                  <item.icon className="w-8 h-8" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-secondary text-primary rounded-full flex-center font-bold">{item.step}</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-neutral-secondary">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 & 8. Cities & Categories */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <SectionHeader title="Popular Areas in Amreli" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {CITIES.map((city, idx) => (
              <motion.div key={city.name} whileHover={{ y: -5 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: idx * 0.1 }} className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer">
                <img src={city.image} alt={city.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                  <p className="text-white/80">{city.count} Properties</p>
                </div>
              </motion.div>
            ))}
          </div>

          <SectionHeader title="Property Categories" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Apartment', 'Villa', 'Independent House', 'Commercial', 'Office', 'Plot'].map((cat) => (
              <motion.div key={cat} whileHover={{ y: -4, backgroundColor: '#FAFAFA' }} className="border border-neutral-border rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center">
                <Home className="w-8 h-8 text-primary mb-3" />
                <h4 className="font-semibold text-neutral-primary">{cat}</h4>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="py-20 bg-neutral-bg-secondary">
        <div className="container-custom">
          <SectionHeader title="What Our Customers Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div key={idx} whileHover={{ y: -5 }} className="bg-white p-8 rounded-2xl shadow-soft border border-neutral-border">
                <div className="flex gap-1 text-secondary mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-neutral-primary font-medium text-lg mb-8 leading-relaxed">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-neutral-primary">{t.name}</h4>
                    <p className="text-sm text-neutral-secondary">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 & 11. Statistics & Final CTA */}
      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container-custom relative z-10 text-center">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 pb-20 border-b border-white/20">
            {[
              { label: 'Properties', count: '20K+' },
              { label: 'Happy Buyers', count: '15K+' },
              { label: 'Trusted Agents', count: '500+' },
              { label: 'Areas Covered', count: '10+' }
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-secondary">{stat.count}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Dream Home?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Join thousands of others who have found their perfect place through EstateX.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" className="bg-secondary text-primary hover:bg-white border-0" onClick={() => navigate('/search')}>Browse Properties</Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">List Your Property</Button>
            </div>
          </motion.div>
          
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
