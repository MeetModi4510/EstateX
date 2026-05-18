import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Home, Maximize, Bed, Bath, 
  CheckCircle2, AlertCircle, FileText, Check, X
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { BrokerNotesPanel } from '../../components/broker/review/BrokerNotesPanel';
import { StatusTimeline, PropertyStatus } from '../../components/broker/review/StatusTimeline';
import { RequestChangesModal } from '../../components/broker/review/RequestChangesModal';
import { ApprovalSuccessModal, RejectModal } from '../../components/broker/review/ApprovalModals';
import { NotificationsPreview } from '../../components/broker/review/NotificationsPreview';

export const PropertyReviewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock property data
  const property = {
    title: 'Luxury Sea View Penthouse',
    location: 'Bandra West, Mumbai',
    price: '₹5.5 Cr',
    area: '2,400 sq.ft',
    type: 'Penthouse',
    bedrooms: 4,
    bathrooms: 4,
    description: 'An exquisite sea-facing penthouse offering panoramic views of the Arabian Sea. Features include Italian marble flooring, a private terrace, smart home automation, and access to premium clubhouse amenities.',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'
    ],
    owner: {
      name: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      phone: '+91 98765 43210'
    },
    qualityScore: 92,
    amenities: ['Swimming Pool', 'Gymnasium', '24/7 Security', 'Power Backup', 'Private Terrace'],
    documents: ['Title Deed', 'NOC from Society', 'Property Tax Receipt']
  };

  const [status, setStatus] = useState<PropertyStatus>('Under Review');
  const [isRequestChangesOpen, setIsRequestChangesOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const handleApprove = () => {
    setStatus('Approved');
    setIsSuccessOpen(true);
  };

  const handleReject = (reason: string) => {
    setStatus('Rejected');
    setIsRejectOpen(false);
    console.log('Rejected reason:', reason);
  };

  const handleRequestChanges = (reasons: string[], customReason: string) => {
    setStatus('Changes Requested');
    console.log('Requested Changes:', reasons, customReason);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-10 max-w-7xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-neutral-border shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/pending-approvals')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-bg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-primary" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-neutral-primary line-clamp-1">{property.title}</h1>
            <p className="text-sm text-neutral-secondary">ID: {id || 'REQ-001'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
          <Button variant="outline" className="hidden lg:flex border-neutral-divider shadow-sm">
            Preview Listing
          </Button>
          <Button variant="outline" className="hidden lg:flex border-neutral-divider shadow-sm">
            Compare Info
          </Button>
          <Button variant="outline" className="hidden lg:flex border-neutral-divider shadow-sm">
            Edit Listing
          </Button>
          <Button variant="outline" className="hidden sm:flex border-neutral-divider shadow-sm">
            Save Draft
          </Button>
          <Button 
            className="bg-orange-50 hover:bg-orange-100 text-orange-600 border-orange-200"
            onClick={() => setIsRequestChangesOpen(true)}
          >
            <AlertCircle className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Request Changes</span>
          </Button>
          <Button 
            className="bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
            onClick={() => setIsRejectOpen(true)}
          >
            <X className="w-4 h-4 mr-1 sm:mr-2" /> Reject
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white shadow-md border-transparent"
            onClick={handleApprove}
          >
            <Check className="w-4 h-4 mr-1 sm:mr-2" /> Approve
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Image Gallery */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-border shadow-sm">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
              <img src={property.images[0]} alt="Cover" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                Listing Quality: <span className="text-green-500">{property.qualityScore}/100</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {property.images.slice(1).map((img, idx) => (
                <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Property Information */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-border shadow-sm space-y-6">
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-primary mb-2">{property.title}</h2>
                <p className="text-neutral-secondary flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {property.location}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-primary">{property.price}</div>
                <p className="text-sm text-neutral-secondary mt-1">Expected Price</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-neutral-divider">
              <div className="flex flex-col gap-1">
                <span className="text-neutral-secondary text-sm flex items-center gap-1.5"><Home className="w-4 h-4"/> Type</span>
                <span className="font-semibold text-neutral-primary">{property.type}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-secondary text-sm flex items-center gap-1.5"><Maximize className="w-4 h-4"/> Area</span>
                <span className="font-semibold text-neutral-primary">{property.area}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-secondary text-sm flex items-center gap-1.5"><Bed className="w-4 h-4"/> Bedrooms</span>
                <span className="font-semibold text-neutral-primary">{property.bedrooms}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-secondary text-sm flex items-center gap-1.5"><Bath className="w-4 h-4"/> Bathrooms</span>
                <span className="font-semibold text-neutral-primary">{property.bathrooms}</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-neutral-primary mb-3">Description</h3>
              <p className="text-neutral-secondary text-sm leading-relaxed">{property.description}</p>
            </div>

            <div>
              <h3 className="font-bold text-neutral-primary mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, idx) => (
                  <span key={idx} className="bg-neutral-bg px-3 py-1.5 rounded-lg text-sm text-neutral-primary border border-neutral-divider">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Documents & Owner Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-neutral-border shadow-sm">
              <h3 className="font-bold text-neutral-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" /> Submitted Documents
              </h3>
              <div className="space-y-3">
                {property.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-neutral-divider bg-neutral-bg hover:border-primary/30 transition-colors cursor-pointer group">
                    <span className="text-sm font-medium text-neutral-primary">{doc}</span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-neutral-border shadow-sm">
              <h3 className="font-bold text-neutral-primary mb-4">Owner Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Name</p>
                  <p className="font-semibold text-neutral-primary">{property.owner.name}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-secondary uppercase tracking-wider mb-1">Contact</p>
                  <p className="text-neutral-primary text-sm">{property.owner.email}</p>
                  <p className="text-neutral-primary text-sm">{property.owner.phone}</p>
                </div>
                <div className="pt-4 border-t border-neutral-divider">
                  <Button variant="outline" className="w-full text-sm">Contact Owner</Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map Placeholder */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-border shadow-sm">
             <h3 className="font-bold text-neutral-primary mb-4">Location Verification</h3>
             <div className="w-full h-48 bg-neutral-bg rounded-xl border border-neutral-divider flex items-center justify-center">
               <div className="text-center text-neutral-secondary flex flex-col items-center">
                 <MapPin className="w-8 h-8 mb-2 opacity-50" />
                 <span className="text-sm font-medium">Map View (Google Maps / Mapbox placeholder)</span>
                 <span className="text-xs">{property.location}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Right Sidebar Area */}
        <div className="space-y-6">
          <div className="h-[400px]">
            <BrokerNotesPanel />
          </div>
          <StatusTimeline currentStatus={status} />
          <NotificationsPreview />
        </div>
      </div>

      {/* Modals */}
      <RequestChangesModal 
        isOpen={isRequestChangesOpen} 
        onClose={() => setIsRequestChangesOpen(false)} 
        onSubmit={handleRequestChanges}
      />
      <ApprovalSuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => {
          setIsSuccessOpen(false);
          navigate('/dashboard/pending-approvals');
        }} 
        propertyTitle={property.title}
      />
      <RejectModal 
        isOpen={isRejectOpen} 
        onClose={() => setIsRejectOpen(false)} 
        onReject={handleReject}
      />
    </motion.div>
  );
};
