
import { Doctor, ConsultationMode } from "@/types/doctor";

const API_URL = "https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json";

export async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      id: item.id || "",
      name: item.name || "",
      name_initials: item.name_initials || "",
      photo: item.photo || "",
      doctor_introduction: item.doctor_introduction || "",
      specialities: item.specialities || [],
      fees: item.fees || "₹ 0",
      experience: item.experience || "0 Years of experience",
      languages: item.languages || [],
      clinic: {
        name: item.clinic?.name || "",
        address: {
          locality: item.clinic?.address?.locality || "",
          city: item.clinic?.address?.city || "",
          address_line1: item.clinic?.address?.address_line1 || "",
          location: item.clinic?.address?.location || "",
          logo_url: item.clinic?.address?.logo_url || "",
        },
      },
      video_consult: item.video_consult || false,
      in_clinic: item.in_clinic || false,
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw error;
  }
}
