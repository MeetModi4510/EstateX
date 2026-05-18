import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkPlus, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';

import { SearchHeader, SearchFilters } from '../components/search/SearchHeader';
import { FilterSidebar, SidebarFilters } from '../components/search/FilterSidebar';
import { FilterChips } from '../components/search/FilterChips';
import { SearchResultsHeader } from '../components/search/SearchResultsHeader';
import { EnhancedPropertyCard } from '../components/search/EnhancedPropertyCard';
import { MapPlaceholder } from '../components/search/MapPlaceholder';
import { CompareBar } from '../components/search/CompareBar';
import { SaveSearchModal } from '../components/search/SaveSearchModal';
import { ContactBrokerModal } from '../components/search/ContactBrokerModal';
import { Pagination } from '../components/search/Pagination';
import { EmptyState } from '../components/search/EmptyState';
import { LoadingSkeletons } from '../components/search/LoadingSkeletons';

// import { MOCK_SEARCH_RESULTS, MOCK_RECENTLY_VIEWED, MOCK_RECOMMENDED } from '../data/mockSearchData';
import { fetchPublicProperties } from '../api/client';

import { useSearchParams } from 'react-router-dom';

const SearchProperties: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedForCompare, setSelectedForCompare] = useState<(string | number)[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [contactBroker, setContactBroker] = useState<any>(null);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const selectedChips = searchParams.getAll('chips') || [];
  
  // Fetch real data from backend
  useEffect(() => {
    setIsLoading(true);
    // Convert chips back to regular filters if needed for API, but for now we just pass the raw query string
    // The backend won't know 'chips', but we can format the query string specifically here if we want.
    // However, it's easier to just pass the query string straight through and map it.
    
    // Convert frontend params to backend API params
    const apiParams = new URLSearchParams(searchParams);
    if (apiParams.has('query')) {
      apiParams.set('location', apiParams.get('query')!);
      apiParams.delete('query');
    }
    
    // Handle budget
    const budgetStr = apiParams.get('budget');
    if (budgetStr && budgetStr !== 'Any Budget') {
      if (budgetStr === 'Under ₹50 Lakhs') apiParams.set('maxPrice', '5000000');
      else if (budgetStr === '₹50L - ₹1Cr') { apiParams.set('minPrice', '5000000'); apiParams.set('maxPrice', '10000000'); }
      else if (budgetStr === '₹1Cr - ₹2.5Cr') { apiParams.set('minPrice', '10000000'); apiParams.set('maxPrice', '25000000'); }
      else if (budgetStr === 'Above ₹2.5Cr') apiParams.set('minPrice', '25000000');
      apiParams.delete('budget');
    }

    if (apiParams.get('propertyType') === 'All Types') apiParams.delete('propertyType');
    else if (apiParams.has('propertyType')) apiParams.set('propertyType', apiParams.get('propertyType')!.toUpperCase());

    fetchPublicProperties(apiParams.toString()).then((data: any) => {
      const properties = data.properties || [];
      if (!Array.isArray(properties)) {
        throw new Error('Properties is not an array');
      }
      
      const mapFn = (prop: any) => {
        const typeStr = prop.propertyType || 'OTHER';
        return {
          id: prop._id || Math.random().toString(),
          title: prop.title || 'Untitled',
          location: (prop.locality || '') + ', ' + (prop.city || ''),
          price: '₹' + ((prop.price || 0) / 100000) + 'L',
          beds: prop.bedrooms || 3,
          baths: prop.bathrooms || 3,
          area: (prop.builtUpArea || 0) + ' sqft',
          type: typeStr.charAt(0) + typeStr.slice(1).toLowerCase(),
          imageUrl: prop.images && prop.images.length > 0 ? prop.images[0].imageUrl : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
          images: prop.images && prop.images.length > 0 
            ? prop.images.map((img: any) => img.imageUrl) 
            : [
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
              ],
          isNew: true,
          verified: prop.isVerified || false,
          listedBy: prop.ownerId?.name || 'Property Owner',
          brokerName: prop.brokerId?.name || 'EstateX Broker',
          brokerPhone: prop.brokerId?.phone || '+91 98765 43210',
          brokerEmail: prop.brokerId?.email || 'broker@estatex.com',
          tags: [typeStr.toLowerCase()],
          matchScore: (() => {
            let score = 0;
            if (apiParams.has('location') && prop.city && apiParams.get('location')?.toLowerCase() === prop.city.toLowerCase()) score += 30;
            if (apiParams.has('propertyType') && apiParams.get('propertyType') === prop.propertyType) score += 20;
            if (apiParams.has('minPrice') || apiParams.has('maxPrice')) score += 25;
            if (apiParams.has('bedrooms') && apiParams.get('bedrooms') === prop.bedrooms?.toString()) score += 15;
            if (apiParams.has('minArea') || apiParams.has('maxArea')) score += 10;
            return score > 0 ? score : undefined; // undefined means just show Recommended if not enough filters
          })(),
          emi: '₹45K/month',
          parking: prop.parking || 1,
          shortDescription: prop.description || 'A beautiful property.',
          postedDate: new Date(prop.createdAt).toLocaleDateString()
        };
      };
      const mappedData = properties.map((prop: any) => mapFn(prop));
      setResults(mappedData);
      setTotalResults(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setIsLoading(false);
    }).catch(err => {
      console.error('Failed to fetch from real API:', err);
      setResults([]);
      setTotalResults(0);
      setIsLoading(false);
    });

    // Fetch Recommended (mocked as highest price for now)
    fetchPublicProperties('limit=6&sort=price_desc').then((data: any) => {
       if (Array.isArray(data.properties)) {
         setRecommended(data.properties.map((prop: any) => ({
           id: prop._id || Math.random().toString(),
           title: prop.title || 'Untitled',
           location: (prop.locality || '') + ', ' + (prop.city || ''),
           price: '₹' + ((prop.price || 0) / 100000) + 'L',
           beds: prop.bedrooms || 3,
           baths: prop.bathrooms || 3,
           area: (prop.builtUpArea || 0) + ' sqft',
           type: (prop.propertyType || 'OTHER').toLowerCase(),
           images: prop.images && prop.images.length > 0 
             ? prop.images.map((img: any) => img.imageUrl) 
             : [
                 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
               ],
           isNew: true,
           verified: prop.isVerified || false,
           brokerName: prop.brokerId?.name || 'EstateX Broker',
           brokerPhone: prop.brokerId?.phone || '+91 98765 43210',
           brokerEmail: prop.brokerId?.email || 'broker@estatex.com',
         })));
       }
    });

    // Fetch Recently Viewed (mocked as newest for now)
    fetchPublicProperties('limit=6&sort=newest').then((data: any) => {
       if (Array.isArray(data.properties)) {
         setRecentlyViewed(data.properties.map((prop: any) => ({
           id: prop._id || Math.random().toString(),
           title: prop.title || 'Untitled',
           location: (prop.locality || '') + ', ' + (prop.city || ''),
           price: '₹' + ((prop.price || 0) / 100000) + 'L',
           beds: prop.bedrooms || 3,
           baths: prop.bathrooms || 3,
           area: (prop.builtUpArea || 0) + ' sqft',
           type: (prop.propertyType || 'OTHER').toLowerCase(),
           images: prop.images && prop.images.length > 0 
             ? prop.images.map((img: any) => img.imageUrl) 
             : [
                 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
               ],
           isNew: true,
           verified: prop.isVerified || false,
           brokerName: prop.brokerId?.name || 'EstateX Broker',
           brokerPhone: prop.brokerId?.phone || '+91 98765 43210',
           brokerEmail: prop.brokerId?.email || 'broker@estatex.com',
         })));
       }
    });
  }, [searchParams]);

  const handleCompareToggle = (id: string | number) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const handleSearch = (filters: SearchFilters) => {
    const newParams = new URLSearchParams(searchParams);
    if (filters.query) newParams.set('query', filters.query); else newParams.delete('query');
    if (filters.budget !== 'Any Budget') newParams.set('budget', filters.budget); else newParams.delete('budget');
    if (filters.propertyType !== 'All Types') newParams.set('propertyType', filters.propertyType); else newParams.delete('propertyType');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleToggleChip = (chip: string) => {
    const newParams = new URLSearchParams(searchParams);
    let chips = newParams.getAll('chips');
    if (chips.includes(chip)) {
      chips = chips.filter(c => c !== chip);
    } else {
      chips.push(chip);
    }
    newParams.delete('chips');
    chips.forEach(c => newParams.append('chips', c));
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSidebarChange = (filters: SidebarFilters) => {
    const newParams = new URLSearchParams(searchParams);
    
    // We update URL params mapping from the sidebar filters.
    if (filters.minBudget) newParams.set('minPrice', (parseFloat(filters.minBudget) * 100000).toString()); else newParams.delete('minPrice');
    if (filters.maxBudget) newParams.set('maxPrice', (parseFloat(filters.maxBudget) * 100000).toString()); else newParams.delete('maxPrice');
    
    newParams.delete('status');
    filters.propertyStatus.forEach(s => newParams.append('status', s));
    
    // Bedrooms (take first for now or pass as array)
    newParams.delete('bedrooms');
    if (filters.bedrooms.length > 0) {
      newParams.set('bedrooms', filters.bedrooms[0].replace('+', ''));
    }

    newParams.delete('bathrooms');
    if (filters.bathrooms.length > 0) {
      newParams.set('bathrooms', filters.bathrooms[0].replace('+', ''));
    }

    newParams.delete('amenities');
    filters.amenities.forEach(a => newParams.append('amenities', a));

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-neutral-bg font-sans pt-[72px]">
      <SearchHeader 
        onMobileFilterClick={() => setIsMobileFilterOpen(true)} 
        onSearch={handleSearch}
        initialQuery={searchParams.get('query') || ''}
        initialBudget={searchParams.get('budget') || 'Any Budget'}
        initialPropertyType={searchParams.get('propertyType') || 'All Types'}
      />
      <FilterChips selectedChips={selectedChips} onToggle={handleToggleChip} />

      <div className="container-custom py-8">
        <div className="flex gap-8">
          
          {/* Left Sidebar - Desktop Filters */}
          <div className="hidden lg:block w-1/4 shrink-0">
            <div className="sticky top-40 bg-white p-6 rounded-3xl border border-neutral-border shadow-sm overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-hide">
              <FilterSidebar onFiltersChange={handleSidebarChange} />
            </div>
          </div>

          {/* Right Content - Results */}
          <div className={viewMode === 'map' ? 'w-full lg:w-2/5 shrink-0' : 'w-full lg:w-3/4'}>
            
            <div className="flex justify-between items-center mb-6">
              <SearchResultsHeader 
                resultCount={totalResults} 
                viewMode={viewMode} 
                onViewModeChange={setViewMode}
              />
              <Button variant="outline" className="gap-2 shrink-0 hidden md:flex h-11" onClick={() => setIsSaveModalOpen(true)}>
                <BookmarkPlus className="w-4 h-4" /> Save Search
              </Button>
            </div>

            {isLoading ? (
              <LoadingSkeletons count={6} isListMode={viewMode === 'list'} />
            ) : results.length === 0 ? (
              <EmptyState onClearFilters={clearFilters} />
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}
              >
                {results.map(property => (
                  <EnhancedPropertyCard 
                    key={property.id}
                    {...property}
                    isListMode={viewMode === 'list'}
                    onCompareToggle={handleCompareToggle}
                    isSelectedForCompare={selectedForCompare.includes(property.id)}
                    onContactClick={() => setContactBroker({ name: property.brokerName, phone: property.brokerPhone, email: property.brokerEmail, propertyId: property.id })}
                  />
                ))}
              </motion.div>
            )}

            {!isLoading && results.length > 0 && (
              <Pagination 
                currentPage={parseInt(searchParams.get('page') || '1')} 
                totalPages={totalPages} 
                onPageChange={(page) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('page', page.toString());
                  setSearchParams(newParams);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
              />
            )}
          </div>

          {/* Map View Split */}
          {viewMode === 'map' && (
            <div className="hidden lg:block w-full lg:w-[35%] shrink-0 flex-grow z-0">
              <MapPlaceholder properties={results} />
            </div>
          )}

        </div>
      </div>

      {/* Recommended & Recently Viewed */}
      <div className="bg-white border-t border-neutral-divider py-16">
        <div className="container-custom">
          <SectionHeader title="Recommended For You" align="left" subtitle="Handpicked properties matching your preferences." />
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
            {recommended.map(prop => (
              <div key={prop.id} className="min-w-[320px] md:min-w-[400px] snap-start">
                <EnhancedPropertyCard {...prop} onContactClick={() => setContactBroker({ name: (prop as any).brokerName || 'EstateX Broker', phone: '+91 98765 43210', email: 'broker@estatex.com', propertyId: prop.id })} />
              </div>
            ))}
          </div>

          <div className="mt-12">
            <SectionHeader title="Recently Viewed" align="left" />
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
              {recentlyViewed.map(prop => (
                <div key={prop.id} className="min-w-[320px] md:min-w-[400px] snap-start">
                  <EnhancedPropertyCard {...prop} onContactClick={() => setContactBroker({ name: (prop as any).brokerName || 'EstateX Broker', phone: '+91 98765 43210', email: 'broker@estatex.com', propertyId: prop.id })} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <CompareBar selectedIds={selectedForCompare} onClear={() => setSelectedForCompare([])} />
      <SaveSearchModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} />
      <ContactBrokerModal isOpen={!!contactBroker} onClose={() => setContactBroker(null)} broker={contactBroker} />

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white z-50 overflow-y-auto shadow-2xl lg:hidden flex flex-col"
            >
              <div className="p-4 border-b border-neutral-divider flex justify-between items-center sticky top-0 bg-white z-10">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-neutral-bg rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex-1">
                <FilterSidebar onFiltersChange={handleSidebarChange} />
              </div>
              <div className="p-4 border-t border-neutral-divider sticky bottom-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <Button className="w-full h-12" onClick={() => setIsMobileFilterOpen(false)}>Show Results</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SearchProperties;
