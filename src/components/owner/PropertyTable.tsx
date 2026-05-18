import React from 'react';
import { Edit2, Eye, Trash2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export type PropertyStatus = 'Draft' | 'Pending Review' | 'Approved' | 'Published' | 'Rejected' | 'Sold';

export interface OwnerProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  status: PropertyStatus;
  views: number;
  submittedDate: string;
  imageUrl: string;
}

interface PropertyTableProps {
  properties: OwnerProperty[];
  onDelete?: (id: string) => void;
}

export const PropertyTable: React.FC<PropertyTableProps> = ({ properties, onDelete }) => {
  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'Draft': return 'bg-neutral-bg text-neutral-secondary';
      case 'Pending Review': return 'bg-yellow-100 text-yellow-700';
      case 'Approved': return 'bg-blue-100 text-blue-700';
      case 'Published': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Sold': return 'bg-orange-100 text-orange-700';
      default: return 'bg-neutral-bg text-neutral-secondary';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-neutral-bg/50 border-b border-neutral-divider">
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Property</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Performance</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider">Submitted</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-secondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-divider">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-neutral-bg/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={property.imageUrl} alt="" className="w-20 h-14 rounded-lg object-cover border border-neutral-divider" />
                    <div>
                      <div className="font-bold text-neutral-primary text-sm mb-1 line-clamp-1">{property.title}</div>
                      <div className="text-xs text-neutral-secondary flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {property.location}
                      </div>
                      <div className="text-xs font-bold text-primary mt-1">{property.price}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap",
                    getStatusColor(property.status)
                  )}>
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-medium text-neutral-primary">
                    <span className="text-neutral-secondary">Views:</span> {property.views.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-neutral-primary">
                  {property.submittedDate}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to="/add-property" className="p-2 text-neutral-secondary hover:text-primary hover:bg-neutral-bg rounded-md transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <Link to={`/property/${property.id}`} className="p-2 text-neutral-secondary hover:text-primary hover:bg-neutral-bg rounded-md transition-colors" title="Preview">
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => onDelete?.(property.id)}
                      className="p-2 text-neutral-secondary hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-neutral-secondary">
                  No properties found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
