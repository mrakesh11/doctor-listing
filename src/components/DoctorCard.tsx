
import { Doctor } from "@/types/doctor";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Briefcase, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const getExperienceYears = (experience: string | number): number => {
    if (typeof experience === 'number') return experience;
    const match = experience?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const experienceYears = getExperienceYears(doctor.experience);

  return (
    <Card 
      data-testid="doctor-card" 
      className="hover:shadow-md transition-shadow duration-200"
    >
      <CardContent className="flex p-4">
        <div className="flex-shrink-0 mr-4">
          <img 
            src={doctor.photo || "/placeholder.svg"} 
            alt={doctor.name} 
            className="w-24 h-24 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 data-testid="doctor-name" className="text-lg font-semibold text-gray-900">
                {doctor.name}
              </h3>
              
              {doctor.specialities?.[0] && (
                <p className="text-gray-600 mt-1">
                  {doctor.specialities[0].name}
                </p>
              )}
            </div>
            <Button className="gap-2" size="sm">
              <CalendarPlus className="h-4 w-4" />
              Book Appointment
            </Button>
          </div>
          
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <Briefcase className="w-4 h-4" />
            <span>{experienceYears} yrs exp.</span>
          </div>
          
          {doctor.clinic?.name && (
            <p className="text-gray-600 mt-1 line-clamp-1">
              {doctor.clinic.name}
            </p>
          )}
          
          {doctor.clinic?.address?.locality && (
            <div className="flex items-start gap-1 mt-1 text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5" />
              <p className="flex-1">{doctor.clinic.address.locality}</p>
            </div>
          )}

          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {doctor.fees}
            </span>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            {doctor.video_consult && (
              <Badge variant="default">Video Consult</Badge>
            )}
            {doctor.in_clinic && (
              <Badge variant="secondary">In Clinic</Badge>
            )}
          </div>

          {doctor.languages && doctor.languages.length > 0 && (
            <div className="mt-2 text-sm text-gray-500">
              Languages: {doctor.languages.join(", ")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
