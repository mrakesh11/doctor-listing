
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctors } from "@/services/doctorService";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import DoctorCard from "@/components/DoctorCard";
import { ConsultationMode, Doctor, FilterState, SortOption } from "@/types/doctor";
import { Loader2 } from "lucide-react";

const DoctorListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Extract filter state from URL params
  const initialFilters: FilterState = {
    searchQuery: searchParams.get("search") || "",
    consultationMode: searchParams.get("mode") as ConsultationMode || null,
    specialties: searchParams.getAll("specialty"),
    sortBy: searchParams.get("sort") as SortOption || null,
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);

  // Fetch doctors data
  const { data: doctors, isLoading, isError } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.searchQuery) {
      params.set("search", filters.searchQuery);
    }
    
    if (filters.consultationMode) {
      params.set("mode", filters.consultationMode);
    }
    
    filters.specialties.forEach(specialty => {
      params.append("specialty", specialty);
    });
    
    if (filters.sortBy) {
      params.set("sort", filters.sortBy);
    }
    
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Extract all unique specialties when doctors data is loaded
  useEffect(() => {
    if (doctors) {
      const specialtiesSet = new Set<string>();
      doctors.forEach(doctor => {
        // Add null check for specialities
        if (doctor.specialities && Array.isArray(doctor.specialities)) {
          doctor.specialities.forEach(specialty => {
            if (specialty && specialty.name) {
              specialtiesSet.add(specialty.name);
            }
          });
        }
      });
      setAllSpecialties(Array.from(specialtiesSet).sort());
    }
  }, [doctors]);

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFilters(prev => {
      const updatedSpecialties = prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty];
      return { ...prev, specialties: updatedSpecialties };
    });
  };

  const handleConsultationModeChange = (mode: ConsultationMode) => {
    setFilters(prev => ({
      ...prev,
      consultationMode: prev.consultationMode === mode ? null : mode,
    }));
  };

  const handleSortChange = (option: SortOption) => {
    setFilters(prev => ({
      ...prev,
      sortBy: prev.sortBy === option ? null : option,
    }));
  };

  // Apply filters to doctors data
  const filteredDoctors = doctors?.filter(doctor => {
    // Filter by search query
    if (
      filters.searchQuery &&
      !doctor.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filter by consultation mode
    if (filters.consultationMode === ConsultationMode.VIDEO && !doctor.video_consult) {
      return false;
    }

    if (filters.consultationMode === ConsultationMode.CLINIC && !doctor.in_clinic) {
      return false;
    }

    // Filter by specialties with null check
    if (
      filters.specialties.length > 0 &&
      (!doctor.specialities || !Array.isArray(doctor.specialities) ||
      !filters.specialties.some(specialty => 
        doctor.specialities.some(spec => spec?.name === specialty)
      ))
    ) {
      return false;
    }

    return true;
  });

  // Sort filtered doctors
  const sortedDoctors = [...(filteredDoctors || [])].sort((a, b) => {
    if (filters.sortBy === SortOption.FEES) {
      // Extract numeric values from fees strings
      const aFee = parseFloat((a.fees || "0").replace(/[^\d.]/g, '')) || 0;
      const bFee = parseFloat((b.fees || "0").replace(/[^\d.]/g, '')) || 0;
      return aFee - bFee;
    } else if (filters.sortBy === SortOption.EXPERIENCE) {
      // Extract numeric values from experience
      const aExp = typeof a.experience === 'number' ? a.experience : 
        parseInt(String(a.experience || "0").match(/\d+/)?.[0] || '0', 10);
      const bExp = typeof b.experience === 'number' ? b.experience : 
        parseInt(String(b.experience || "0").match(/\d+/)?.[0] || '0', 10);
      return bExp - aExp;
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading doctors data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Find Your Doctor</h1>
        <SearchBar 
          doctors={doctors || []} 
          onSearch={handleSearch} 
          initialQuery={filters.searchQuery}
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <aside className="lg:col-span-1">
          <FilterPanel
            specialties={allSpecialties}
            selectedSpecialties={filters.specialties}
            consultationMode={filters.consultationMode}
            sortOption={filters.sortBy}
            onSpecialtyChange={handleSpecialtyChange}
            onConsultationModeChange={handleConsultationModeChange}
            onSortChange={handleSortChange}
          />
        </aside>

        {/* Doctor Listing */}
        <main className="lg:col-span-3">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              {sortedDoctors.length} {sortedDoctors.length === 1 ? "Doctor" : "Doctors"} Found
            </h2>
          </div>
          <div className="space-y-4">
            {sortedDoctors.length > 0 ? (
              sortedDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))
            ) : (
              <p className="text-center py-10 text-gray-500">No doctors found matching your criteria.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorListingPage;
