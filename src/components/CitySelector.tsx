
import React from "react";
import { useApp } from "@/context/AppContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const CitySelector: React.FC = () => {
  const { accessibleCities, selectedCity, setSelectedCity } = useApp();
  const isMobile = useIsMobile();

  const handleCityChange = (cityId: string) => {
    const city = accessibleCities.find(c => c.id === cityId) || null;
    setSelectedCity(city);
  };

  return (
    <div className={isMobile ? "w-full" : "w-[180px]"}>
      <Select
        onValueChange={handleCityChange}
        defaultValue={selectedCity?.id}
      >
        <SelectTrigger className="bg-white text-aod-purple-800 flex items-center gap-2">
          <MapPin size={16} className="text-aod-purple-600" />
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {accessibleCities.map((city) => (
            <SelectItem key={city.id} value={city.id}>
              {city.name}, {city.state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
