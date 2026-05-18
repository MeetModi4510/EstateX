import React from 'react';
import { Edit2, PauseCircle, Trash2, Eye, MoreVertical } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface Listing {
  id: string;
  title: string;
  price: string;
  area: string;
  views: number;
  interested: number;
  status: 'Active' | 'Paused' | 'Pending';
  imageUrl: string;
}

interface ListingTableProps {
  listings: Listing[];
}

export const ListingTable: React.FC<ListingTableProps> = ({ listings }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-neutral-bg/50 border-b border-neutral-divider">
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Property</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Price & Area</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Metrics</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {listings.map((listing) => (
              <tr key={listing.id} className="hover:bg-neutral-bg/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={listing.imageUrl} alt="" className="w-16 h-12 rounded-lg object-cover border border-neutral-divider" />
                    <div>
                      <div className="font-bold text-neutral-primary text-sm mb-0.5 line-clamp-1">{listing.title}</div>
                      <div className="text-xs text-neutral-secondary">ID: {listing.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-neutral-primary text-sm mb-0.5">{listing.price}</div>
                  <div className="text-xs text-neutral-secondary">{listing.area}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-medium text-neutral-primary"><span className="text-neutral-secondary">Views:</span> {listing.views}</div>
                    <div className="text-xs font-medium text-neutral-primary"><span className="text-neutral-secondary">Leads:</span> {listing.interested}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-bold",
                    listing.status === 'Active' ? "bg-green-100 text-green-700" :
                    listing.status === 'Paused' ? "bg-orange-100 text-orange-700" :
                    "bg-yellow-100 text-yellow-700"
                  )}>
                    {listing.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-neutral-secondary hover:text-primary hover:bg-neutral-bg rounded-md transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-neutral-secondary hover:text-orange-500 hover:bg-neutral-bg rounded-md transition-colors" title="Pause">
                      <PauseCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-neutral-secondary hover:text-primary hover:bg-neutral-bg rounded-md transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
