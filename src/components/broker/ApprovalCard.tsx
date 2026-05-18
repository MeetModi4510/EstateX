import React, { useState } from 'react';
import { MapPin, User, Calendar, Check, X, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { ApprovalSuccessModal, RejectModal } from './review/ApprovalModals';
import { approveProperty, rejectProperty } from '../../api/client';

export interface ApprovalRequest {
  id: string;
  propertyTitle: string;
  location: string;
  submittedBy: string;
  submittedDate: string;
  qualityScore: number;
  imageUrl: string;
}

interface ApprovalCardProps {
  request: ApprovalRequest;
  onActionComplete?: () => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ request, onActionComplete }) => {
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approveProperty(request.id);
      setIsSuccessOpen(true);
      if (onActionComplete) onActionComplete();
    } catch (err) {
      console.error(err);
      alert('Failed to approve property');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (reason: string) => {
    setIsProcessing(true);
    try {
      await rejectProperty(request.id, reason);
      setIsRejectOpen(false);
      if (onActionComplete) onActionComplete();
    } catch (err) {
      console.error(err);
      alert('Failed to reject property');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white border border-neutral-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      <div className="relative aspect-video bg-neutral-bg">
        <img src={request.imageUrl} alt={request.propertyTitle} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <AlertCircle className="w-3 h-3 text-orange-500" /> Pending Review
        </div>
        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-md text-xs font-semibold backdrop-blur-sm flex items-center gap-1">
          Quality Score: <span className={request.qualityScore > 80 ? "text-green-400" : "text-yellow-400"}>{request.qualityScore}/100</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-neutral-primary text-lg mb-1 line-clamp-1">{request.propertyTitle}</h3>
        <p className="text-sm text-neutral-secondary flex items-center gap-1.5 mb-4">
          <MapPin className="w-4 h-4" /> {request.location}
        </p>
        
        <div className="mt-auto space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs font-medium border-t border-neutral-divider pt-3">
            <span className="flex items-center gap-1.5 text-neutral-secondary">
              <User className="w-4 h-4" /> {request.submittedBy}
            </span>
            <span className="flex items-center gap-1.5 text-neutral-secondary">
              <Calendar className="w-4 h-4" /> {request.submittedDate}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button 
            variant="outline" 
            className="w-full h-9 text-xs gap-1.5 justify-center border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            onClick={() => setIsRejectOpen(true)}
            disabled={isProcessing}
          >
            <X className="w-3.5 h-3.5" /> Reject
          </Button>
          <Button 
            className="w-full h-9 text-xs gap-1.5 justify-center"
            onClick={handleApprove}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            {isProcessing ? 'Processing' : 'Approve'}
          </Button>
          <Button 
            variant="outline" 
            className="col-span-2 w-full h-9 text-xs gap-1.5 justify-center mt-1"
            onClick={() => navigate(`/dashboard/review-property/${request.id}`)}
          >
            <Eye className="w-3.5 h-3.5" /> Review Listing
          </Button>
        </div>
      </div>
      
      <ApprovalSuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)} 
        propertyTitle={request.propertyTitle}
      />
      <RejectModal 
        isOpen={isRejectOpen} 
        onClose={() => setIsRejectOpen(false)} 
        onReject={handleReject}
      />
    </div>
  );
};
