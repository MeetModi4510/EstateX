import React, { useEffect, useState, useRef } from 'react';
import { StepProps } from './WizardTypes';
import { Building2, Home, Hotel, Store, Briefcase, Map as MapIcon, TreePine, MapPin, UploadCloud, X, Star, Video, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { uploadPropertyImages, deletePropertyImage, setPropertyCoverImage } from '../../api/client';

const PROPERTY_TYPES = [
  { id: 'Apartment', value: 'APARTMENT', icon: Building2, desc: 'Flats and apartments in societies' },
  { id: 'Villa', value: 'VILLA', icon: Home, desc: 'Independent premium houses' },
  { id: 'Independent House', value: 'HOUSE', icon: Home, desc: 'Stand-alone houses or bungalows' },
  { id: 'Commercial', value: 'COMMERCIAL', icon: Hotel, desc: 'Commercial properties or spaces' },
  { id: 'Office', value: 'OFFICE', icon: Briefcase, desc: 'Office spaces for businesses' },
  { id: 'Shop', value: 'SHOP', icon: Store, desc: 'Retail shops and showrooms' },
  { id: 'Plot', value: 'PLOT', icon: MapIcon, desc: 'Residential or commercial land' },
  { id: 'Farmhouse', value: 'FARMHOUSE', icon: TreePine, desc: 'Farmhouses and agricultural land' },
];

export const StepPropertyType: React.FC<StepProps> = ({ data, updateData, onValidChange }) => {
  
  useEffect(() => {
    onValidChange(!!data.propertyType);
  }, [data.propertyType, onValidChange]);

  const handleSelect = (typeId: string) => {
    updateData({ propertyType: typeId });
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-primary mb-2">What type of property are you listing?</h2>
        <p className="text-neutral-secondary">Choose the category that best describes your property.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {PROPERTY_TYPES.map(type => {
          const Icon = type.icon;
          const isSelected = data.propertyType === type.value;
          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.value)}
              className={cn(
                "flex flex-col items-center p-6 rounded-2xl border-2 transition-all text-center gap-3",
                isSelected 
                  ? "border-primary bg-primary/5 text-primary shadow-sm" 
                  : "border-neutral-border bg-white text-neutral-primary hover:border-primary/50 hover:bg-neutral-bg"
              )}
            >
              <Icon className={cn("w-8 h-8", isSelected ? "text-primary" : "text-neutral-secondary")} />
              <div>
                <div className="font-semibold">{type.id}</div>
                <div className="text-[10px] text-neutral-secondary mt-1 leading-tight">{type.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Listing Type */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-neutral-primary mb-3">What do you want to do?</h3>
        <div className="flex gap-4">
          {['SALE', 'RENT'].map(lt => (
            <button
              key={lt}
              onClick={() => updateData({ listingType: lt })}
              className={cn(
                "flex-1 py-4 rounded-2xl border-2 text-center font-semibold transition-all",
                data.listingType === lt
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-neutral-border bg-white text-neutral-primary hover:border-primary/50"
              )}
            >
              {lt === 'SALE' ? '🏷️ Sell' : '🔑 Rent / Lease'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StepBasicDetails: React.FC<StepProps> = ({ data, updateData, onValidChange }) => {
  
  useEffect(() => {
    const isValid = !!data.title && !!data.builtUpArea;
    onValidChange(isValid);
  }, [data.title, data.builtUpArea, onValidChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-primary mb-2">Tell us about your property</h2>
        <p className="text-neutral-secondary">Provide the basic details to help buyers understand what you're offering.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-neutral-primary mb-2">Property Title *</label>
          <input 
            name="title" value={data.title} onChange={handleChange}
            placeholder="e.g. Beautiful 3BHK Sea-facing Apartment"
            className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-primary mb-2">Description</label>
          <textarea 
            name="description" value={data.description} onChange={handleChange}
            placeholder="Describe the key highlights of your property..."
            className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm h-32 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Bedrooms</label>
            <select name="beds" value={data.beds} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm bg-white">
              <option value="">Select</option>
              {[1, 2, 3, 4, 5, '5+'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Bathrooms</label>
            <select name="baths" value={data.baths} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm bg-white">
              <option value="">Select</option>
              {[1, 2, 3, 4, '4+'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Balconies</label>
            <select name="balconies" value={data.balconies} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm bg-white">
              <option value="">Select</option>
              {[0, 1, 2, 3, '3+'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Parking</label>
            <select name="parking" value={data.parking} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm bg-white">
              <option value="">Select</option>
              {[0, 1, 2, '3+'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Built-up Area (sq.ft) *</label>
            <input name="builtUpArea" value={data.builtUpArea} onChange={handleChange} type="number" placeholder="e.g. 1500" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Carpet Area (sq.ft)</label>
            <input name="carpetArea" value={data.carpetArea} onChange={handleChange} type="number" placeholder="e.g. 1200" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Property Age</label>
            <select name="propertyAge" value={data.propertyAge} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm bg-white">
              <option value="">Select</option>
              <option value="New">New</option>
              <option value="1-5 years">1-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="10+ years">10+ years</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Furnishing</label>
            <select name="furnishing" value={data.furnishing} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm bg-white">
              <option value="">Select</option>
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi Furnished">Semi Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Floor</label>
            <input name="floor" value={data.floor} onChange={handleChange} placeholder="e.g. 3" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Total Floors</label>
            <input name="totalFloors" value={data.totalFloors} onChange={handleChange} placeholder="e.g. 10" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ... (in the middle, let's just make sure we replace the right StepLocation)
export const StepLocation: React.FC<StepProps> = ({ data, updateData, onValidChange }) => {
  useEffect(() => {
    const isValid = !!data.city && !!data.locality;
    onValidChange(isValid);
  }, [data.city, data.locality, onValidChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-primary mb-2">Where is it located?</h2>
        <p className="text-neutral-secondary">Help buyers find your property accurately on the map.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-neutral-primary mb-2">State</label>
              <input name="state" value={data.state} onChange={handleChange} placeholder="e.g. Gujarat" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-primary mb-2">City *</label>
              <input name="city" value={data.city} onChange={handleChange} placeholder="e.g. Amreli" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-primary mb-2">Locality *</label>
            <input name="locality" value={data.locality} onChange={handleChange} placeholder="e.g. Lathi Road" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-primary mb-2">Society / Building Name</label>
            <input name="society" value={data.society} onChange={handleChange} placeholder="e.g. Royal Residency" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-primary mb-2">House No. & Address</label>
            <input name="address" value={data.address} onChange={handleChange} placeholder="e.g. Flat 301, Block A" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-primary mb-2">Pincode</label>
            <input name="pincode" value={data.pincode} onChange={handleChange} placeholder="e.g. 365601" className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm" />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="block text-sm font-bold text-neutral-primary mb-2">Pin on Map</label>
          <div className="flex-1 bg-neutral-bg border border-neutral-border rounded-xl flex items-center justify-center relative overflow-hidden min-h-[300px]">
            {/* Map Placeholder */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Amreli,Gujarat&zoom=14&size=600x400&sensor=false')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50"></div>
            <div className="relative flex flex-col items-center gap-3 z-10 p-6 text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-neutral-divider">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-primary mb-1">Set Location</h4>
                <p className="text-xs text-neutral-secondary mb-3">Drag the pin to exact location</p>
                <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                  Pin Location
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AMENITIES_LIST = [
  'Lift', 'Power Backup', 'Swimming Pool', 'Gym', 'Garden', 
  'Club House', 'Security', 'Visitor Parking', 'Kids Play Area', 
  'Gas Pipeline', 'Internet', 'Rainwater Harvesting', 'Pet Friendly', 'Solar Panels'
];

export const StepAmenities: React.FC<StepProps> = ({ data, updateData, onValidChange }) => {
  useEffect(() => {
    onValidChange(true); // Amenities are optional, so it's always valid
  }, [onValidChange]);

  const toggleAmenity = (amenity: string) => {
    const updated = data.amenities.includes(amenity)
      ? data.amenities.filter(a => a !== amenity)
      : [...data.amenities, amenity];
    updateData({ amenities: updated });
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-primary mb-2">What amenities does it have?</h2>
        <p className="text-neutral-secondary">Select all the amenities available in your property or society.</p>
      </div>

      <div className="flex flex-wrap gap-4">
        {AMENITIES_LIST.map(amenity => {
          const isSelected = data.amenities.includes(amenity);
          return (
            <button
              key={amenity}
              onClick={() => toggleAmenity(amenity)}
              className={cn(
                "px-6 py-3 rounded-full border-2 text-sm font-semibold transition-all",
                isSelected
                  ? "border-primary bg-primary text-white shadow-md"
                  : "border-neutral-border bg-white text-neutral-primary hover:border-primary/50"
              )}
            >
              {amenity}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const StepMedia: React.FC<StepProps> = ({ data, updateData, onValidChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onValidChange(true); // Images are optional now
  }, [onValidChange]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!data._id) {
      alert("Property draft not found. Please go back to step 1 and ensure your draft is saved before uploading images.");
      return;
    }
    
    const files = Array.from(e.target.files);
    
    // Filter by type and size
    const validFiles = files.filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      alert("Some files were skipped. Only images under 10MB are allowed.");
    }

    if (validFiles.length === 0) return;

    try {
      setIsUploading(true);
      const res = await uploadPropertyImages(data._id, validFiles);
      
      const newImages = res.images.map((img: any) => ({ id: img._id, url: img.imageUrl }));
      const updatedImages = [...data.images, ...newImages];
      
      updateData({ 
        images: updatedImages,
        coverImage: data.coverImage || newImages[0]?.url 
      });
    } catch (error: any) {
      console.error("Upload failed", error);
      const msg = error?.message || "Failed to upload images. Please try again.";
      alert(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = async (idx: number) => {
    if (!data._id) return;
    const imgToRemove = data.images[idx];
    
    try {
      await deletePropertyImage(data._id, imgToRemove.id);
      const updatedImages = data.images.filter((_, i) => i !== idx);
      updateData({
        images: updatedImages,
        coverImage: data.coverImage === imgToRemove.url ? (updatedImages[0]?.url || '') : data.coverImage
      });
    } catch (error) {
      console.error("Failed to delete image", error);
      alert("Failed to delete image.");
    }
  };

  const setCover = async (img: { id: string, url: string }) => {
    if (!data._id) return;
    try {
      await setPropertyCoverImage(data._id, img.id);
      updateData({ coverImage: img.url });
    } catch (error) {
      console.error("Failed to set cover image", error);
      alert("Failed to set cover image.");
    }
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-primary mb-2">Showcase your property</h2>
        <p className="text-neutral-secondary">Great photos help your property stand out. You can upload images now or skip this step.</p>
      </div>

      <div className="space-y-8">
        {/* Upload Area */}
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
          onChange={handleFileChange} 
        />
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "w-full border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 rounded-2xl p-10 flex flex-col items-center justify-center transition-colors",
            isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
        >
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          ) : (
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-primary">
              <UploadCloud className="w-8 h-8" />
            </div>
          )}
          <h3 className="text-lg font-bold text-neutral-primary mb-1">
            {isUploading ? "Uploading Images..." : "Click to upload"}
          </h3>
          <p className="text-sm text-neutral-secondary mb-4">JPEG, PNG, WEBP (max. 10MB)</p>
          <button disabled={isUploading} className="px-6 py-2 bg-white border border-neutral-border rounded-full text-sm font-semibold hover:border-primary transition-colors">
            Browse Files
          </button>
        </div>

        {/* Uploaded Images Grid */}
        {data.images.length > 0 && (
          <div>
            <h4 className="font-bold text-neutral-primary mb-4 flex items-center gap-2">
              Uploaded Media <span className="px-2 py-0.5 bg-neutral-bg text-neutral-secondary rounded-full text-xs">{data.images.length}</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.images.map((img, idx) => (
                <div key={img.id} className={cn("relative group aspect-square rounded-xl overflow-hidden border-2", data.coverImage === img.url ? "border-primary" : "border-transparent")}>
                  <img src={img.url} alt="Property" className="w-full h-full object-cover" />
                  
                  {/* Cover Badge */}
                  {data.coverImage === img.url && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" /> COVER
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <button 
                      onClick={() => removeImage(idx)}
                      className="self-end p-1.5 bg-white/20 hover:bg-red-500 rounded-full text-white backdrop-blur-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {data.coverImage !== img.url && (
                      <button 
                        onClick={() => setCover(img)}
                        className="w-full py-1.5 bg-white/20 hover:bg-primary text-white text-xs font-semibold rounded-lg backdrop-blur-sm transition-colors"
                      >
                        Set as Cover
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video / 360 placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-divider">
          <div className="p-4 border border-neutral-border rounded-xl flex items-center gap-4 bg-white opacity-60 cursor-not-allowed">
            <div className="w-12 h-12 bg-neutral-bg rounded-lg flex items-center justify-center text-neutral-secondary">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-semibold text-sm">Add Property Video</h5>
              <p className="text-xs text-neutral-secondary">Coming soon in next update</p>
            </div>
          </div>
          <div className="p-4 border border-neutral-border rounded-xl flex items-center gap-4 bg-white opacity-60 cursor-not-allowed">
            <div className="w-12 h-12 bg-neutral-bg rounded-lg flex items-center justify-center text-neutral-secondary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-semibold text-sm">360° Virtual Tour</h5>
              <p className="text-xs text-neutral-secondary">Coming soon in next update</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const StepPricing: React.FC<StepProps> = ({ data, updateData, onValidChange }) => {
  useEffect(() => {
    const isValid = !!data.expectedPrice && !!data.ownership;
    onValidChange(isValid);
  }, [data.expectedPrice, data.ownership, onValidChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.checked });
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-primary mb-2">Pricing and Details</h2>
        <p className="text-neutral-secondary">Set a competitive price to attract more buyers.</p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-neutral-primary mb-2">Expected Price (₹) *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary font-semibold">₹</span>
              <input 
                name="expectedPrice" value={data.expectedPrice} onChange={handleChange} 
                type="number" placeholder="e.g. 7500000" 
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm font-medium"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-primary mb-2">Maintenance Charges / Month</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-secondary font-semibold">₹</span>
              <input 
                name="maintenance" value={data.maintenance} onChange={handleChange} 
                type="number" placeholder="e.g. 5000" 
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 border border-neutral-border rounded-xl bg-neutral-bg/50">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="negotiable" checked={data.negotiable} onChange={handleCheckbox} className="w-5 h-5 accent-primary" />
            <span className="font-semibold text-sm">Price is negotiable</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="loanAvailable" checked={data.loanAvailable} onChange={handleCheckbox} className="w-5 h-5 accent-primary" />
            <span className="font-semibold text-sm">Home Loan Available (Approved project)</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Ownership Type *</label>
            <select name="ownership" value={data.ownership} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm bg-white">
              <option value="">Select</option>
              <option value="Freehold">Freehold</option>
              <option value="Leasehold">Leasehold</option>
              <option value="Co-operative Society">Co-operative Society</option>
              <option value="Power of Attorney">Power of Attorney</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-secondary uppercase tracking-wider mb-2">Possession Status</label>
            <select name="possession" value={data.possession} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-neutral-border focus:border-primary outline-none text-sm bg-white">
              <option value="">Select</option>
              <option value="Ready to Move">Ready to Move</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StepReview: React.FC<StepProps> = ({ data, onValidChange }) => {
  useEffect(() => {
    onValidChange(true); // Always valid for final submission
  }, [onValidChange]);

  const priceFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  });

  const locationStr = [data.locality, data.city, data.state].filter(Boolean).join(', ');

  return (
    <div className="py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-neutral-primary mb-2">Review & Publish</h2>
        <p className="text-neutral-secondary">Make sure everything looks good before going live.</p>
      </div>

      <div className="space-y-8">
        {/* Preview Card */}
        <div className="border border-neutral-border rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col md:flex-row">
          <div className="md:w-1/3 aspect-[4/3] md:aspect-auto relative bg-neutral-bg">
            {data.coverImage ? (
              <img src={data.coverImage} alt="Property Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-secondary">
                <Home className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-sm">No image</span>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-neutral-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
              {data.propertyType || 'Property'}
            </div>
            {data.images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-md backdrop-blur-sm">
                + {data.images.length - 1} photos
              </div>
            )}
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className="text-xl font-bold text-neutral-primary line-clamp-2">
                  {data.title || 'Untitled Property'}
                </h3>
                <div className="text-2xl font-bold text-primary whitespace-nowrap">
                  {data.expectedPrice ? priceFormatter.format(Number(data.expectedPrice)) : 'Price upon request'}
                </div>
              </div>
              <p className="text-neutral-secondary text-sm flex items-center gap-1.5 mb-6">
                <MapPin className="w-4 h-4" /> {locationStr || 'Location not specified'}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm font-medium text-neutral-primary mb-6">
                {data.beds && <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-neutral-secondary" /> {data.beds} Beds</span>}
                {data.baths && <span className="flex items-center gap-1.5"><Home className="w-4 h-4 text-neutral-secondary" /> {data.baths} Baths</span>}
                {data.builtUpArea && <span className="flex items-center gap-1.5"><MapIcon className="w-4 h-4 text-neutral-secondary" /> {data.builtUpArea} sq.ft</span>}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {data.amenities.slice(0, 4).map(am => (
                <span key={am} className="px-3 py-1 bg-neutral-bg text-neutral-secondary text-xs rounded-full border border-neutral-divider">
                  {am}
                </span>
              ))}
              {data.amenities.length > 4 && (
                <span className="px-3 py-1 bg-neutral-bg text-neutral-secondary text-xs rounded-full border border-neutral-divider">
                  +{data.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Summary */}
        <div className="bg-white rounded-2xl border border-neutral-border p-6 md:p-8 space-y-8">
          <section>
            <h4 className="text-lg font-bold text-neutral-primary border-b border-neutral-divider pb-2 mb-4">Description</h4>
            <p className="text-sm text-neutral-secondary whitespace-pre-wrap leading-relaxed">
              {data.description || 'No description provided.'}
            </p>
          </section>

          <section>
            <h4 className="text-lg font-bold text-neutral-primary border-b border-neutral-divider pb-2 mb-4">Additional Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
              <div><span className="text-neutral-secondary block mb-0.5 text-xs">Floor</span><span className="font-medium text-neutral-primary">{data.floor || '-'} of {data.totalFloors || '-'}</span></div>
              <div><span className="text-neutral-secondary block mb-0.5 text-xs">Property Age</span><span className="font-medium text-neutral-primary">{data.propertyAge || '-'}</span></div>
              <div><span className="text-neutral-secondary block mb-0.5 text-xs">Furnishing</span><span className="font-medium text-neutral-primary">{data.furnishing || '-'}</span></div>
              <div><span className="text-neutral-secondary block mb-0.5 text-xs">Maintenance</span><span className="font-medium text-neutral-primary">{data.maintenance ? `₹${data.maintenance}/mo` : '-'}</span></div>
              <div><span className="text-neutral-secondary block mb-0.5 text-xs">Ownership</span><span className="font-medium text-neutral-primary">{data.ownership || '-'}</span></div>
              <div><span className="text-neutral-secondary block mb-0.5 text-xs">Possession</span><span className="font-medium text-neutral-primary">{data.possession || '-'}</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
