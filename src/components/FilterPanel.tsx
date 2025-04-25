
import { ConsultationMode, SortOption } from "@/types/doctor";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterPanelProps {
  specialties: string[];
  selectedSpecialties: string[];
  consultationMode: ConsultationMode | null;
  sortOption: SortOption | null;
  onSpecialtyChange: (specialty: string) => void;
  onConsultationModeChange: (mode: ConsultationMode) => void;
  onSortChange: (option: SortOption) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  specialties,
  selectedSpecialties,
  consultationMode,
  sortOption,
  onSpecialtyChange,
  onConsultationModeChange,
  onSortChange,
}) => {
  return (
    <div className="space-y-6 bg-white p-5 rounded-lg shadow-sm border">
      {/* Consultation Mode Filter */}
      <div className="space-y-3">
        <h3 data-testid="filter-header-moc" className="text-sm font-semibold">Consultation Mode</h3>
        <RadioGroup 
          value={consultationMode || undefined} 
          onValueChange={(value) => onConsultationModeChange(value as ConsultationMode)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              data-testid="filter-video-consult" 
              value={ConsultationMode.VIDEO} 
              id="video-consult" 
            />
            <Label htmlFor="video-consult">Video Consult</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              data-testid="filter-in-clinic" 
              value={ConsultationMode.CLINIC} 
              id="in-clinic" 
            />
            <Label htmlFor="in-clinic">In Clinic</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Specialties Filter */}
      <div className="space-y-3">
        <h3 data-testid="filter-header-speciality" className="text-sm font-semibold">Speciality</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {specialties.map((specialty) => (
            <div key={specialty} className="flex items-center space-x-2">
              <Checkbox 
                data-testid={`filter-specialty-${specialty.replace("/", "-")}`}
                id={specialty}
                checked={selectedSpecialties.includes(specialty)}
                onCheckedChange={() => onSpecialtyChange(specialty)}
              />
              <Label htmlFor={specialty}>{specialty}</Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sort Filter */}
      <div className="space-y-3">
        <h3 data-testid="filter-header-sort" className="text-sm font-semibold">Sort</h3>
        <RadioGroup 
          value={sortOption || undefined} 
          onValueChange={(value) => onSortChange(value as SortOption)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              data-testid="sort-fees" 
              value={SortOption.FEES} 
              id="sort-fees" 
            />
            <Label htmlFor="sort-fees">Fees (Low to High)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              data-testid="sort-experience" 
              value={SortOption.EXPERIENCE} 
              id="sort-experience" 
            />
            <Label htmlFor="sort-experience">Experience (High to Low)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default FilterPanel;
