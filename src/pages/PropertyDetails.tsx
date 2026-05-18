import React from 'react';
import { Helmet } from 'react-helmet-async';

import { MapPin, ShieldCheck, Share2, Heart, Star, Eye, Bookmark, Download, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
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
import { InquiryModal } from '../components/property/InquiryModal';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchPublicProperties, fetchPropertyById, recordPropertyView } from '../api/client';

const PropertyDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInquiryModalOpen, setIsInquiryModalOpen] = React.useState(false);
  const [inquiryType, setInquiryType] = React.useState<'INFORMATION' | 'CALLBACK' | 'VISIT'>('INFORMATION');
  const [property, setProperty] = React.useState<any>(null);
  const [similarProperties, setSimilarProperties] = React.useState<any[]>([]);

  const openInquiry = (type: 'INFORMATION' | 'CALLBACK' | 'VISIT') => {
    setInquiryType(type);
    setIsInquiryModalOpen(true);
  };

  React.useEffect(() => {
    if (id) {
      // Record view in the background
      recordPropertyView(id);
      
      fetchPropertyById(id)
        .then(data => {
          setProperty(data);
          if (data.city) {
            fetchPublicProperties(`city=${encodeURIComponent(data.city)}&limit=5`)
              .then(res => setSimilarProperties(res.properties?.filter((p: any) => p.id !== id) || []))
              .catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, [id]);

  const images = property?.images?.length > 0 
    ? property.images.map((img: any) => img.imageUrl)
    : [
        'https://images.unsplash.com/photo-1613490900233-141c5123d248?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'
      ];

  return (
    <div className="w-full bg-neutral-bg pb-24 pt-24">
      {property && (
        <Helmet>
          <title>{property.title ? `${property.title} | EstateX` : 'Property Details | EstateX'}</title>
          <meta name="description" content={property.description || 'View details of this premium property on EstateX.'} />
          <meta property="og:title" content={property.title} />
          <meta property="og:description" content={property.description} />
          {property.images && property.images.length > 0 && (
            <meta property="og:image" content={property.images[0].imageUrl} />
          )}
        </Helmet>
      )}

      {/* 1. Property Header */}
      <div className="container-custom py-6">
        <button onClick={() => navigate(-1)} className="inline-flex mb-4 items-center gap-2 text-neutral-secondary hover:text-primary font-medium bg-transparent border-0 cursor-pointer p-0">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Verified Property
              </span>
              <span className="bg-neutral-bg-secondary text-neutral-secondary px-3 py-1 rounded-full text-sm font-medium">
                {property?.propertyType || 'Premium Villa'}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-neutral-primary mb-3">{property?.title || 'Luxury Villa'}</h1>
            <div className="flex flex-wrap items-center gap-4 text-neutral-secondary">
              <span className="flex items-center gap-1"><MapPin className="w-5 h-5 text-primary" /> {property?.address ? `${property.address}, ` : ''}{property?.locality}, {property?.city}</span>
              <span>•</span>
              <span>ID: {property?.propertyCode || 'EST-8492X'}</span>
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
          <section className="bg-gradient-to-br from-white to-neutral-bg/30 p-8 rounded-3xl shadow-md border border-neutral-border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div>
              <p className="text-neutral-secondary font-medium mb-1 uppercase tracking-wide text-xs">Current Price</p>
              <div className="flex items-end gap-3">
                <h2 className="text-4xl md:text-5xl font-extrabold text-primary">₹{(property?.price / 100000)?.toFixed(2)} L</h2>
              </div>
              <p className="text-sm text-neutral-secondary mt-2 font-medium">₹{Math.round(property?.price / property?.builtUpArea)} per sq. ft.</p>
            </div>
            <div className="h-16 w-px bg-neutral-divider hidden md:block"></div>
            <div className="bg-white p-5 rounded-2xl border border-neutral-border shadow-sm">
              <p className="text-neutral-secondary font-medium mb-1 text-sm">EMI Starts From</p>
              <h3 className="text-2xl font-bold text-neutral-primary mb-3">₹{Math.round((property?.price * 0.008) / 1000)}K <span className="text-base font-medium text-neutral-secondary">/ month</span></h3>
              <span className="bg-feedback-success/10 text-feedback-success px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 w-full justify-center border border-feedback-success/20">
                <ShieldCheck className="w-3.5 h-3.5"/> {property?.possessionStatus || 'Ready to Move'}
              </span>
            </div>
          </section>

          {/* 5. Description */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-4">Description</h2>
            <div className="text-neutral-secondary leading-relaxed space-y-4 text-lg whitespace-pre-wrap">
              {property?.description || 'No description provided.'}
            </div>
          </section>

          {/* 4. Quick Info */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-6">Property Overview</h2>
            <QuickInfoGrid />
          </section>

          {/* 6. Amenities */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-6">Premium Amenities</h2>
            <AmenitiesGrid />
          </section>

          {/* 8. Specifications */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-primary mb-6">Property Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['Property Type', property?.propertyType],
                ['Carpet Area', `${property?.carpetArea} sq.ft.`],
                ['Built-up Area', `${property?.builtUpArea} sq.ft.`],
                ['Bedrooms', property?.bedrooms],
                ['Bathrooms', property?.bathrooms],
                ['Possession', property?.possessionStatus || 'Immediate'],
                ['Furnishing', property?.furnishing || 'Unfurnished'],
                ['Facing', property?.facing || 'East'],
              ].filter(r => r[1] && r[1] !== 'undefined sq.ft.').map((row, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-neutral-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all">
                  <span className="text-neutral-secondary font-medium">{row[0]}</span>
                  <span className="text-neutral-primary font-bold">{row[1]}</span>
                </div>
              ))}
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
            <BrokerCard brokerName={property?.brokerId?.name} />
            <VisitBookingCard propertyId={property?._id} propertyTitle={property?.title} />
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similarProperties.length > 0 && (
        <section className="mt-24 pt-20 border-t border-neutral-divider bg-white">
          <div className="container-custom">
            <SectionHeader title="Similar Properties" align="left" subtitle={`Explore more properties in ${property?.city || 'this area'}.`} />
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
              {similarProperties.map((prop) => (
                <div key={prop.id || prop._id} className="min-w-[320px] md:min-w-[400px] snap-start">
                  <PropertyCard {...prop} id={prop.id || prop._id} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="bg-primary text-white py-20 mt-12">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Interested in this property?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
            <Button size="lg" className="bg-secondary text-primary hover:bg-white flex-1 text-lg border-0" onClick={() => openInquiry('INFORMATION')}>Request Information</Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 flex-1 text-lg" onClick={() => openInquiry('VISIT')}>Schedule Visit</Button>
          </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-border p-4 flex gap-3 lg:hidden z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Button className="flex-1" onClick={() => openInquiry('CALLBACK')}>Request Callback</Button>
        <Button variant="outline" className="flex-1" onClick={() => openInquiry('INFORMATION')}>Request Info</Button>
      </div>

      {property?._id && (
        <InquiryModal 
          isOpen={isInquiryModalOpen} 
          onClose={() => setIsInquiryModalOpen(false)} 
          propertyTitle={property.title}
          propertyId={property._id}
          inquiryType={inquiryType}
        />
      )}

    </div>
  );
};

export default PropertyDetails;
