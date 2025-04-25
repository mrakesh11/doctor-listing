
export interface Doctor {
  id: string;
  name: string;
  name_initials: string;
  photo: string;
  doctor_introduction: string;
  specialities: Array<{ name: string }>;
  fees: string;
  experience: string | number;
  languages: string[];
  clinic: {
    name: string;
    address: {
      locality: string;
      city: string;
      address_line1: string;
      location: string;
      logo_url: string;
    };
  };
  video_consult: boolean;
  in_clinic: boolean;
}

export enum ConsultationMode {
  VIDEO = "Video Consult",
  CLINIC = "In Clinic"
}

export interface FilterState {
  searchQuery: string;
  consultationMode: ConsultationMode | null;
  specialties: string[];
  sortBy: SortOption | null;
}

export enum SortOption {
  FEES = "fees",
  EXPERIENCE = "experience"
}

export interface SearchSuggestion {
  id: string; // Changed from number to string to match Doctor.id
  name: string;
}
