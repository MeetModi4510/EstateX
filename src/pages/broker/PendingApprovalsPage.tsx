import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Search } from 'lucide-react';
import { ReviewPropertyCard, PendingProperty } from '../../components/broker/review/ReviewPropertyCard';
import { EmptyState } from '../../components/broker/EmptyState';

export const PendingApprovalsPage: React.FC = () => {
  const pendingProperties: PendingProperty[] = [
    {
      id: 'REQ-001',
      title: 'Luxury Sea View Penthouse',
      location: 'Bandra West, Mumbai',
      ownerName: 'Rahul Sharma',
      submittedDate: 'Today, 10:30 AM',
      expectedPrice: '₹5.5 Cr',
      propertyType: 'Penthouse',
      qualityScore: 92,
      verificationStatus: 'Pending',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'REQ-002',
      title: 'Modern 3BHK Apartment',
      location: 'Powai, Mumbai',
      ownerName: 'Neha Gupta',
      submittedDate: 'Yesterday, 04:15 PM',
      expectedPrice: '₹2.2 Cr',
      propertyType: 'Apartment',
      qualityScore: 78,
      verificationStatus: 'Unverified',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'REQ-003',
      title: 'Independent Villa with Pool',
      location: 'Lonavala, Maharashtra',
      ownerName: 'Vikram Singh',
      submittedDate: 'Oct 12, 09:00 AM',
      expectedPrice: '₹4.8 Cr',
      propertyType: 'Villa',
      qualityScore: 85,
      verificationStatus: 'Verified',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-primary mb-2">Pending Approvals</h1>
          <p className="text-neutral-secondary">Review and approve properties submitted by owners.</p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-secondary" />
          <input 
            type="text" 
            placeholder="Search properties..." 
            className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white border border-neutral-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-sm"
          />
        </div>
      </div>

      {pendingProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ReviewPropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={CheckCircle}
          title="All caught up!"
          description="There are no properties pending approval at the moment."
        />
      )}
    </motion.div>
  );
};
