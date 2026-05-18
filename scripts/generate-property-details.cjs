const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'src', 'components', 'property');
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeComponent(name, content) {
  fs.writeFileSync(path.join(dirPath, `${name}.tsx`), content);
}

// 1. PropertyGallery
writeComponent('PropertyGallery', `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Map as MapIcon, Expand } from 'lucide-react';
import { Button } from '../ui/Button';

interface GalleryProps { images: string[]; }

export const PropertyGallery: React.FC<GalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-soft group">
        <AnimatePresence mode="wait">
          <motion.img key={mainImage} src={mainImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full object-cover" />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
          <Button variant="secondary" className="gap-2 bg-white/90 backdrop-blur-md hover:bg-white text-neutral-primary border-0"><MapIcon className="w-4 h-4"/> 360° Virtual Tour (Soon)</Button>
          <Button variant="secondary" className="gap-2 bg-white/90 backdrop-blur-md hover:bg-white text-neutral-primary border-0"><Camera className="w-4 h-4"/> View All Photos</Button>
          <button className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-neutral-primary hover:bg-white transition-colors shadow-sm"><Expand className="w-5 h-5"/></button>
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-4">
        {images.slice(0, 6).map((img, idx) => (
          <div key={idx} onClick={() => setMainImage(img)} className={\`cursor-pointer h-24 rounded-xl overflow-hidden border-2 transition-all \${mainImage === img ? 'border-primary shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}\`}>
            <img src={img} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};
`);

// 2. QuickInfoGrid
writeComponent('QuickInfoGrid', `import React from 'react';
import { BedDouble, Bath, Square, Building, Compass, Calendar, Warehouse, ArrowUpRight } from 'lucide-react';

export const QuickInfoGrid: React.FC = () => {
  const items = [
    { icon: BedDouble, label: 'Bedrooms', value: '4 Beds' },
    { icon: Bath, label: 'Bathrooms', value: '5 Baths' },
    { icon: Square, label: 'Balcony', value: '2 Balconies' },
    { icon: Warehouse, label: 'Parking', value: '3 Cars' },
    { icon: Square, label: 'Area', value: '4,500 sqft' },
    { icon: ArrowUpRight, label: 'Floor', value: '8th Floor' },
    { icon: Building, label: 'Total Floors', value: '24 Floors' },
    { icon: Compass, label: 'Facing', value: 'North-East' },
    { icon: Calendar, label: 'Property Age', value: '1-5 Years' },
    { icon: BedDouble, label: 'Furnishing', value: 'Semi-Furnished' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="bg-neutral-bg-secondary p-4 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-primary/5 transition-colors cursor-default border border-transparent hover:border-primary/20">
          <item.icon className="w-6 h-6 text-primary mb-2 opacity-80" />
          <span className="text-xs text-neutral-secondary mb-1">{item.label}</span>
          <span className="text-sm font-semibold text-neutral-primary">{item.value}</span>
        </div>
      ))}
    </div>
  );
};
`);

// 3. AmenitiesGrid
writeComponent('AmenitiesGrid', `import React from 'react';
import { Dumbbell, Trees, Waves, ShieldCheck, Wifi, Flame, Car, Droplets } from 'lucide-react';

export const AmenitiesGrid: React.FC = () => {
  const amenities = [
    { icon: Dumbbell, label: 'Gym' }, { icon: Trees, label: 'Garden' },
    { icon: Waves, label: 'Swimming Pool' }, { icon: ShieldCheck, label: '24/7 Security' },
    { icon: Wifi, label: 'High-speed Internet' }, { icon: Flame, label: 'Gas Pipeline' },
    { icon: Car, label: 'Visitor Parking' }, { icon: Droplets, label: 'Rain Water Harvesting' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {amenities.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-secondary/30 text-primary flex items-center justify-center">
            <item.icon className="w-5 h-5" />
          </div>
          <span className="font-medium text-neutral-primary">{item.label}</span>
        </div>
      ))}
    </div>
  );
};
`);

// 4. BrokerCard
writeComponent('BrokerCard', `import React from 'react';
import { Phone, Mail, Calendar, CheckCircle2, Star } from 'lucide-react';
import { Button } from '../ui/Button';

export const BrokerCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-border sticky top-24">
      <div className="flex items-center gap-4 mb-6">
        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150" className="w-16 h-16 rounded-full object-cover shadow-sm" />
        <div>
          <h3 className="text-xl font-bold text-neutral-primary flex items-center gap-1">
            Rajesh Kumar <CheckCircle2 className="w-4 h-4 text-feedback-success" />
          </h3>
          <p className="text-sm text-neutral-secondary">Verified Premium Broker</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center p-2 bg-neutral-bg-secondary rounded-xl">
          <div className="font-bold text-neutral-primary">8 Yrs</div>
          <div className="text-xs text-neutral-secondary">Exp.</div>
        </div>
        <div className="text-center p-2 bg-neutral-bg-secondary rounded-xl">
          <div className="font-bold text-neutral-primary">120+</div>
          <div className="text-xs text-neutral-secondary">Props</div>
        </div>
        <div className="text-center p-2 bg-neutral-bg-secondary rounded-xl">
          <div className="font-bold text-neutral-primary flex items-center justify-center gap-1"><Star className="w-3 h-3 fill-primary text-primary"/> 4.9</div>
          <div className="text-xs text-neutral-secondary">Rating</div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button className="w-full gap-2"><Phone className="w-4 h-4"/> Call Now</Button>
        <Button variant="outline" className="w-full gap-2"><Mail className="w-4 h-4"/> Send Message</Button>
        <Button variant="secondary" className="w-full gap-2 text-primary bg-secondary/50 hover:bg-secondary"><Calendar className="w-4 h-4"/> Book Visit</Button>
      </div>
    </div>
  );
};
`);

// 5. VisitBookingCard
writeComponent('VisitBookingCard', `import React from 'react';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { Button } from '../ui/Button';

export const VisitBookingCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-soft border border-neutral-border mt-6">
      <h3 className="text-lg font-bold text-neutral-primary mb-4">Book Site Visit</h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-neutral-secondary mb-1">Select Date</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
            <input type="date" className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-secondary mb-1">Select Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
            <select className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm appearance-none">
              <option>10:00 AM - 11:00 AM</option>
              <option>11:00 AM - 12:00 PM</option>
              <option>02:00 PM - 03:00 PM</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-secondary mb-1">Visitors</label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-secondary" />
            <select className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm appearance-none">
              <option>1 Person</option>
              <option>2 Persons</option>
              <option>3+ Persons</option>
            </select>
          </div>
        </div>
      </div>
      
      <Button className="w-full">Request Visit</Button>
    </div>
  );
};
`);

// 6. HomeLoanCalculator
writeComponent('HomeLoanCalculator', `import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '../ui/Button';

export const HomeLoanCalculator: React.FC = () => {
  const [amount, setAmount] = useState(15000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  // EMI formula calculation
  const r = rate / (12 * 100);
  const n = tenure * 12;
  const emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-soft border border-neutral-border flex flex-col lg:flex-row gap-12 items-center">
      <div className="flex-1 w-full space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-secondary font-medium">Loan Amount</span>
            <span className="font-bold text-neutral-primary">{formatCurrency(amount)}</span>
          </div>
          <input type="range" min="1000000" max="50000000" step="500000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-secondary font-medium">Interest Rate (p.a.)</span>
            <span className="font-bold text-neutral-primary">{rate}%</span>
          </div>
          <input type="range" min="5" max="15" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-secondary font-medium">Loan Tenure</span>
            <span className="font-bold text-neutral-primary">{tenure} Years</span>
          </div>
          <input type="range" min="1" max="30" step="1" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-primary" />
        </div>
      </div>
      
      <div className="w-full lg:w-72 bg-primary text-white rounded-2xl p-6 text-center flex flex-col justify-center shadow-lg relative overflow-hidden">
        <div className="absolute -top-10 -right-10 text-white/10"><Calculator className="w-32 h-32" /></div>
        <div className="relative z-10">
          <p className="text-white/80 text-sm mb-2">Your Monthly EMI</p>
          <h3 className="text-4xl font-bold text-secondary mb-6">{formatCurrency(emi)}</h3>
          <Button variant="secondary" className="w-full text-primary hover:bg-white">Apply for Loan</Button>
        </div>
      </div>
    </div>
  );
};
`);

// 7. PropertyInsights & Safety
writeComponent('PropertyInsights', `import React from 'react';
import { TrendingUp, ShieldCheck, FileCheck, CheckSquare, Search } from 'lucide-react';

export const PropertyInsights: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Insights */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-neutral-border">
        <h3 className="text-xl font-bold text-neutral-primary mb-6">Property Insights</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-neutral-secondary">Neighborhood Score</span>
              <span className="text-primary">8.5 / 10</span>
            </div>
            <div className="w-full bg-neutral-bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[85%] rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-neutral-secondary">Investment Score</span>
              <span className="text-primary">9.2 / 10</span>
            </div>
            <div className="w-full bg-neutral-bg-secondary h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[92%] rounded-full"></div>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-divider flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-secondary mb-1">Expected APY</p>
              <p className="text-2xl font-bold text-feedback-success flex items-center gap-2"><TrendingUp className="w-5 h-5"/> +12%</p>
            </div>
            <div className="w-24 h-12 bg-neutral-bg-secondary rounded-lg flex items-center justify-center text-xs text-neutral-secondary italic border border-neutral-divider">[Chart Placeholder]</div>
          </div>
        </div>
      </div>

      {/* Safety */}
      <div className="bg-white rounded-3xl p-8 shadow-soft border border-neutral-border">
        <h3 className="text-xl font-bold text-neutral-primary mb-6 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-feedback-success"/> Safety & Verification</h3>
        <div className="space-y-4">
          {[
            { icon: FileCheck, label: 'Verified Ownership', desc: 'Title deed checked and verified' },
            { icon: CheckSquare, label: 'Document Verified', desc: 'All legal documents are clear' },
            { icon: ShieldCheck, label: 'RERA Verified', desc: 'Registered with regulatory authority' },
            { icon: Search, label: 'Inspection Completed', desc: 'Physical verification done by EstateX' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-neutral-bg-secondary transition-colors cursor-default">
              <div className="w-10 h-10 rounded-full bg-feedback-success/10 text-feedback-success flex-center shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-neutral-primary text-sm">{item.label}</h4>
                <p className="text-xs text-neutral-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
`);

// Generate the massive PropertyDetails.tsx
const propertyDetailsContent = `import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Share2, Heart, Star, Eye, Bookmark, Download, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { PropertyGallery } from '../components/property/PropertyGallery';
import { QuickInfoGrid } from '../components/property/QuickInfoGrid';
import { AmenitiesGrid } from '../components/property/AmenitiesGrid';
import { BrokerCard } from '../components/property/BrokerCard';
import { VisitBookingCard } from '../components/property/VisitBookingCard';
import { HomeLoanCalculator } from '../components/property/HomeLoanCalculator';
import { PropertyInsights } from '../components/property/PropertyInsights';
import { PropertyCard } from '../components/shared/PropertyCard';

const PropertyDetails: React.FC = () => {
  const images = [
    'https://images.unsplash.com/photo-1613490900233-141c5123d248?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200',
  ];

  return (
    <div className="w-full bg-neutral-bg pb-24 pt-24">
      {/* 1. Property Header */}
      <div className="container-custom py-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verified Property
              </span>
              <span className="bg-neutral-bg-secondary text-neutral-secondary px-3 py-1 rounded-full text-sm font-medium">
                Premium Villa
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-neutral-primary mb-3">Luxury Villa with Pool</h1>
            <div className="flex flex-wrap items-center gap-4 text-neutral-secondary">
              <span className="flex items-center gap-1"><MapPin className="w-5 h-5 text-primary" /> Lathi Road, Amreli</span>
              <span>•</span>
              <span>ID: EST-8492X</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-secondary text-secondary" /> 4.9 (124 Reviews)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="hidden sm:flex flex-col items-end mr-4 text-sm text-neutral-secondary border-r border-neutral-divider pr-6">
              <span className="flex items-center gap-1"><Eye className="w-4 h-4"/> 2.4k Views</span>
              <span className="flex items-center gap-1"><Bookmark className="w-4 h-4"/> 850 Saves</span>
            </div>
            <Button variant="outline" className="gap-2 flex-1 lg:flex-none"><Share2 className="w-4 h-4" /> Share</Button>
            <Button variant="outline" className="gap-2 flex-1 lg:flex-none hover:text-red-500 hover:border-red-500"><Heart className="w-4 h-4" /> Save</Button>
          </div>
        </div>
      </div>

      {/* 2. Gallery */}
      <div className="container-custom mb-16">
        <PropertyGallery images={images} />
      </div>

      {/* Main Content Grid */}
      <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          
          {/* 3. Price Section */}
          <section className="bg-white p-8 rounded-3xl shadow-soft border border-neutral-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-neutral-secondary mb-1">Current Price</p>
              <div className="flex items-end gap-3">
                <h2 className="text-4xl font-bold text-primary">₹2.5 Cr</h2>
                <span className="text-neutral-secondary line-through mb-1">₹2.8 Cr</span>
              </div>
              <p className="text-sm text-neutral-secondary mt-2">₹5,555 per sq. ft.</p>
            </div>
            <div className="h-16 w-px bg-neutral-divider hidden md:block"></div>
            <div>
              <p className="text-neutral-secondary mb-1">EMI Starts From</p>
              <h3 className="text-2xl font-bold text-neutral-primary mb-2">₹1.85 L / month</h3>
              <span className="bg-feedback-success/10 text-feedback-success px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3"/> Ready to Move
              </span>
            </div>
          </section>

          {/* 4. Quick Info */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-6">Property Overview</h2>
            <QuickInfoGrid />
          </section>

          {/* 5. Description */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-4">Description</h2>
            <div className="text-neutral-secondary leading-relaxed space-y-4 text-lg">
              <p>Experience the epitome of luxury living in this magnificent 5-bedroom villa located in the heart of Amreli. Designed with impeccable attention to detail, this residence offers a seamless blend of modern architecture and elegant comfort.</p>
              <p>The property features a sprawling layout with high ceilings, large windows that invite abundant natural light, a private landscaped garden, and a pristine swimming pool perfect for entertaining guests or enjoying quiet family weekends.</p>
            </div>
            <Button variant="ghost" className="mt-2 -ml-4">Read More <ChevronRight className="w-4 h-4 ml-1" /></Button>
          </section>

          {/* 6. Amenities */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-6">Premium Amenities</h2>
            <AmenitiesGrid />
          </section>

          {/* 8. Specifications Table */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-6">Property Features</h2>
            <div className="bg-white rounded-3xl border border-neutral-border overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <tbody>
                  {[
                    ['Property Type', 'Villa / Independent House'],
                    ['Carpet Area', '4,200 sq.ft.'],
                    ['Built-up Area', '4,500 sq.ft.'],
                    ['Plot Area', '6,000 sq.ft.'],
                    ['Ownership', 'Freehold'],
                    ['Possession', 'Immediate'],
                    ['Water Supply', '24/7 Municipal & Borewell'],
                    ['Electricity', 'No Power Cuts'],
                  ].map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-neutral-bg-secondary' : 'bg-white'}>
                      <th className="py-4 px-6 text-neutral-secondary font-medium w-1/3">{row[0]}</th>
                      <td className="py-4 px-6 text-neutral-primary font-medium">{row[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 7. Location & Map */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-6">Location & Neighborhood</h2>
            <div className="w-full h-80 bg-neutral-bg-secondary rounded-3xl flex items-center justify-center border border-neutral-border mb-6">
              <div className="text-center text-neutral-secondary">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Google Maps Integration Placeholder</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Schools (1.2 km)', 'Hospitals (2.5 km)', 'Shopping Mall (4 km)', 'Bus Stop (500m)'].map((poi, idx) => (
                <div key={idx} className="bg-white border border-neutral-border p-3 rounded-xl text-center text-sm font-medium text-neutral-primary shadow-sm">{poi}</div>
              ))}
            </div>
          </section>

          {/* Floor Plan */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-6">Floor Plan</h2>
            <div className="w-full h-96 bg-white rounded-3xl flex flex-col items-center justify-center border border-neutral-border shadow-soft relative overflow-hidden group">
              <FileText className="w-20 h-20 text-neutral-divider mb-4" />
              <p className="text-neutral-secondary mb-6 font-medium">Floor Plan PDF Available</p>
              <Button className="gap-2"><Download className="w-4 h-4"/> Download Floor Plan</Button>
            </div>
          </section>

          {/* 11. Home Loan & Insights */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-6">EMI Calculator</h2>
            <HomeLoanCalculator />
          </section>

          <section>
            <PropertyInsights />
          </section>

        </div>

        {/* Right Sidebar (Broker & Booking) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <BrokerCard />
            <VisitBookingCard />
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      <section className="mt-24 pt-20 border-t border-neutral-divider bg-white">
        <div className="container-custom">
          <SectionHeader title="Similar Properties" align="left" subtitle="Explore more luxury properties in Amreli." />
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="min-w-[320px] md:min-w-[400px] snap-start">
                <PropertyCard 
                  image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
                  price="₹1.8 Cr" title="Premium Independent House" location="Jesingpara, Amreli"
                  beds={4} baths={4} area="3,200 sqft"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-primary text-white py-20 mt-12">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Interested in this property?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            <Button size="lg" className="bg-secondary text-primary hover:bg-white flex-1 text-lg border-0">Contact Broker</Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 flex-1 text-lg">Schedule Visit</Button>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-border p-4 flex gap-3 lg:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Button className="flex-1">Call</Button>
        <Button variant="outline" className="flex-1">Message</Button>
      </div>

    </div>
  );
};

export default PropertyDetails;
`;

fs.writeFileSync(path.join(__dirname, '..', 'src', 'pages', 'PropertyDetails.tsx'), propertyDetailsContent);

console.log('Phase 3 Property Details components and page generated successfully.');
