import React from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { Button } from '../ui/Button';

export interface VisitRequest {
  id: string;
  buyerName: string;
  propertyTitle: string;
  location: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

interface VisitCardProps {
  visit: VisitRequest;
}

export const VisitCard: React.FC<VisitCardProps> = ({ visit }) => {
  return (
    <div className="bg-white border border-neutral-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-neutral-primary line-clamp-1">{visit.propertyTitle}</h3>
          <p className="text-xs text-neutral-secondary flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5" /> {visit.location}
          </p>
        </div>
        <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-bold shrink-0 ${
          visit.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
          visit.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
          visit.status === 'Completed' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          {visit.status}
        </span>
      </div>

      <div className="bg-neutral-bg/50 rounded-xl p-3 mb-5 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="font-semibold text-neutral-primary">{visit.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-primary" />
          <span className="font-semibold text-neutral-primary">{visit.time}</span>
        </div>
        <div className="col-span-2 flex items-center gap-2 text-sm border-t border-neutral-divider pt-3 mt-1">
          <User className="w-4 h-4 text-neutral-secondary" />
          <span className="text-neutral-secondary">Buyer:</span>
          <span className="font-semibold text-neutral-primary">{visit.buyerName}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {visit.status === 'Pending' && (
          <>
            <Button className="flex-1 h-9 text-xs justify-center">Approve</Button>
            <Button variant="outline" className="flex-1 h-9 text-xs justify-center border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">Reject</Button>
          </>
        )}
        {visit.status === 'Confirmed' && (
          <>
            <Button className="flex-1 h-9 text-xs justify-center bg-green-600 hover:bg-green-700 border-none">Mark Completed</Button>
            <Button variant="outline" className="flex-1 h-9 text-xs justify-center">Reschedule</Button>
          </>
        )}
        {(visit.status === 'Completed' || visit.status === 'Cancelled') && (
          <Button variant="outline" className="w-full h-9 text-xs justify-center">View Details</Button>
        )}
      </div>
    </div>
  );
};
