import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WizardHeader } from '../components/add-property/WizardHeader';
import { ProgressBar, WIZARD_STEPS } from '../components/add-property/ProgressBar';
import { Button } from '../components/ui/Button';
import { Loader2 } from 'lucide-react';

// Import step components
import { 
  StepPropertyType, StepBasicDetails, StepLocation, StepAmenities, 
  StepMedia, StepPricing, StepReview 
} from '../components/add-property/WizardSteps';
import { WizardData, INITIAL_WIZARD_DATA } from '../components/add-property/WizardTypes';
import { createPropertyDraft, updatePropertyDraft, submitProperty } from '../api/client';

/**
 * Maps frontend WizardData fields to the backend Property schema.
 * The wizard uses user-friendly names (beds, baths, expectedPrice etc.)
 * but the backend model expects (bedrooms, bathrooms, price etc.)
 */
const mapWizardToBackend = (data: WizardData) => ({
  propertyType: data.propertyType,
  listingType: data.listingType || 'SALE',
  title: data.title,
  description: data.description,
  bedrooms: data.beds ? Number(data.beds) : undefined,
  bathrooms: data.baths ? Number(data.baths) : undefined,
  balconies: data.balconies ? Number(data.balconies) : undefined,
  parking: data.parking ? Number(data.parking) : undefined,
  floor: data.floor ? Number(data.floor) : undefined,
  totalFloors: data.totalFloors ? Number(data.totalFloors) : undefined,
  builtUpArea: data.builtUpArea ? Number(data.builtUpArea) : undefined,
  carpetArea: data.carpetArea ? Number(data.carpetArea) : undefined,
  propertyAge: data.propertyAge || undefined,
  furnishing: data.furnishing || undefined,
  facing: data.facing || undefined,
  state: data.state,
  city: data.city,
  locality: data.locality,
  address: data.address || data.society || data.locality || '-',
  price: data.expectedPrice ? Number(data.expectedPrice) : undefined,
  maintenance: data.maintenance ? Number(data.maintenance) : undefined,
  negotiable: data.negotiable,
  possessionStatus: data.possession || undefined,
});

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_WIZARD_DATA);
  const [isStepValid, setIsStepValid] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const totalSteps = WIZARD_STEPS.length;

  const updateData = (updates: Partial<WizardData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps && isStepValid) {
      // Ensure a draft exists before moving past step 1
      if (!data._id) {
        try {
          const backendData = mapWizardToBackend(data);
          const res = await createPropertyDraft(backendData);
          setData(prev => ({ ...prev, _id: res._id, propertyCode: res.propertyCode }));
        } catch (e: any) {
          console.error('Failed to create draft', e);
          alert('Failed to save your property draft. Please make sure you are logged in as a Property Owner and try again.');
          return; // Don't proceed if draft creation fails
        }
      } else {
        try {
          const backendData = mapWizardToBackend(data);
          await updatePropertyDraft(data._id, backendData);
        } catch (e) {
          console.error('Failed to update draft', e);
        }
      }
      
      setCurrentStep(c => c + 1);
      setIsStepValid(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(c => c - 1);
      setIsStepValid(true);
    }
  };

  const handleSaveAndExit = async () => {
    if (data._id) {
      const backendData = mapWizardToBackend(data);
      await updatePropertyDraft(data._id, backendData).catch(console.error);
    }
    navigate('/dashboard/owner');
  };

  const handlePublish = async () => {
    if (!data._id) {
      alert('No property draft found. Please go back and start again.');
      return;
    }
    
    setIsPublishing(true);
    try {
      // Final update with all data mapped to backend schema
      const backendData = mapWizardToBackend(data);
      await updatePropertyDraft(data._id, backendData);
      
      // Submit the property for publishing
      await submitProperty(data._id);
      setIsPublished(true);
    } catch (e: any) {
      console.error('Failed to submit property', e);
      alert(e?.message || 'Failed to publish property. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const renderStep = () => {
    const props = { data, updateData, onValidChange: setIsStepValid };
    switch (currentStep) {
      case 1: return <StepPropertyType {...props} />;
      case 2: return <StepBasicDetails {...props} />;
      case 3: return <StepLocation {...props} />;
      case 4: return <StepAmenities {...props} />;
      case 5: return <StepMedia {...props} />;
      case 6: return <StepPricing {...props} />;
      case 7: return <StepReview {...props} />;
      default: return null;
    }
  };

  if (isPublished) {
    return (
      <div className="min-h-screen bg-neutral-bg flex flex-col font-sans text-neutral-primary">
        <WizardHeader onSaveAndExit={handleSaveAndExit} />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-10 rounded-3xl border border-neutral-border shadow-sm max-w-md w-full flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-3xl font-display font-bold text-neutral-primary mb-3">Submitted for Approval!</h2>
            <p className="text-neutral-secondary mb-8">Your property has been submitted for review. It will be live once a broker approves it.</p>
            <div className="w-full space-y-3">
              <Button className="w-full" onClick={() => navigate('/')}>Browse Properties</Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard/owner')}>Go to Dashboard</Button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col font-sans text-neutral-primary">
      <WizardHeader onSaveAndExit={handleSaveAndExit} />
      <ProgressBar currentStep={currentStep} />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="bg-white border-t border-neutral-divider sticky bottom-0 z-40 p-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
            Back
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-secondary hidden sm:inline-block">Draft saved automatically</span>
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={!isStepValid}>Next Step</Button>
            ) : (
              <Button onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...</>
                ) : (
                  'Submit for Approval'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;
