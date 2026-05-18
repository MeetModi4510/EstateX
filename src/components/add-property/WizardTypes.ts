export interface WizardData {
  _id?: string;
  propertyCode?: string;
  propertyType: string;
  listingType: string;
  title: string;
  description: string;
  beds: string;
  baths: string;
  balconies: string;
  parking: string;
  floor: string;
  totalFloors: string;
  builtUpArea: string;
  carpetArea: string;
  propertyAge: string;
  furnishing: string;
  facing: string;
  country: string;
  state: string;
  city: string;
  locality: string;
  society: string;
  address: string;
  pincode: string;
  amenities: string[];
  images: { id: string; url: string }[];
  coverImage: string;
  expectedPrice: string;
  maintenance: string;
  negotiable: boolean;
  loanAvailable: boolean;
  ownership: string;
  possession: string;
}

export const INITIAL_WIZARD_DATA: WizardData = {
  propertyType: '',
  listingType: 'SALE',
  title: '',
  description: '',
  beds: '',
  baths: '',
  balconies: '',
  parking: '',
  floor: '',
  totalFloors: '',
  builtUpArea: '',
  carpetArea: '',
  propertyAge: '',
  furnishing: '',
  facing: '',
  country: '',
  state: '',
  city: '',
  locality: '',
  society: '',
  address: '',
  pincode: '',
  amenities: [],
  images: [],
  coverImage: '',
  expectedPrice: '',
  maintenance: '',
  negotiable: false,
  loanAvailable: false,
  ownership: '',
  possession: ''
};

export interface StepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  onValidChange: (isValid: boolean) => void;
}
