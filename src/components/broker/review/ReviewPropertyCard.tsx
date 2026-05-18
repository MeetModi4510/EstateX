import React from 'react';
import { MapPin, User, Calendar, CheckCircle, ShieldCheck, Home, Eye, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useNavigate } from 'react-router-dom';

export interface PendingProperty {
  id: string;
  title: string;
  location: string;
  ownerName: string;
  submittedDate: string;
  expectedPrice: string;
  propertyType: string;
  qualityScore: number;
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
  imageUrl: string;
}

interface ReviewPropertyCardProps {
  property: PendingProperty;
}

export const ReviewPropertyCard: React.FC<ReviewPropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-neutral-border rounded-2xl overflow-hidden shadow-sm hover:shadow-soft transition-all duration-300 group flex flex-col">
      <div className="relative aspect-[4/3] bg-neutral-bg overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm text-neutral-primary">
          <AlertCircle className="w-3.5 h-3.5 text-orange-500" /> Pending Review
        </div>
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1 text-neutral-primary">
          <ShieldCheck className={`w-4 h-4 ${property.verificationStatus === 'Verified' ? 'text-green-500' : 'text-neutral-secondary'}`} />
          {property.verificationStatus}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-white">
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xl font-bold mb-1">{property.expectedPrice}</div>
              <div className="text-sm text-white/90 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5" /> {property.propertyType}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/80 mb-0.5">Quality Score</div>
              <div className={`text-lg font-bold ${property.qualityScore >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                {property.qualityScore}/100
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-neutral-primary text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">{property.title}</h3>
        <p className="text-sm text-neutral-secondary flex items-center gap-1.5 mb-5">
          <MapPin className="w-4 h-4" /> {property.location}
        </p>
        
        <div className="mt-auto space-y-3 mb-5">
          <div className="flex items-center justify-between text-sm border-t border-neutral-divider pt-4">
            <span className="flex items-center gap-2 text-neutral-primary font-medium">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User className="w-3.5 h-3.5" />
              </div>
              {property.ownerName}
            </span>
            <span className="flex items-center gap-1.5 text-neutral-secondary text-xs">
              <Calendar className="w-3.5 h-3.5" /> {property.submittedDate}
            </span>
          </div>
        </div>

        <Button 
          className="w-full h-11 text-sm gap-2 justify-center bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
          onClick={() => navigate(`/dashboard/review-property/${property.id}`)}
        >
          <Eye className="w-4 h-4" /> Review Full Listing
        </Button>
      </div>
    </div>
  );
};
