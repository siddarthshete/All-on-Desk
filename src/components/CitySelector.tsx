
import React from "react";
import { useApp } from "@/context/AppContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CitySelector: React.FC = () => {
  const { cities, selectedCity, setSelectedCity } = useApp();

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId) || null;
    setSelectedCity(city);
  };

  return (
    <div className="w-[180px]">
      <Select
        onValueChange={handleCityChange}
        defaultValue={selectedCity?.id}
      >
        <SelectTrigger className="bg-white text-aod-purple-800">
          <SelectValue placeholder="Select a city" />
        </SelectTrigger>
        <SelectContent>
          {cities.map((city) => (
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
