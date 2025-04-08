
import React from "react";
import { useApp } from "@/context/AppContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DomainSelector: React.FC = () => {
  const { domains, selectedDomain, setSelectedDomain } = useApp();

  const handleDomainChange = (domainId: string) => {
    if (domainId === "all") {
      setSelectedDomain(null);
      return;
    }
    const domain = domains.find(d => d.id === domainId) || null;
    setSelectedDomain(domain);
  };

  return (
    <Tabs 
      defaultValue="all" 
      className="w-full mb-6"
      onValueChange={handleDomainChange}
    >
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="all" className="rounded-md">
          All Domains
        </TabsTrigger>
        {domains.map((domain) => (
          <TabsTrigger 
            key={domain.id} 
            value={domain.id} 
            className="rounded-md"
            style={{ 
              borderBottom: `3px solid ${domain.color}`,
            }}
          >
            {domain.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default DomainSelector;
