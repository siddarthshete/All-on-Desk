
import React, { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import DomainSelector from "@/components/DomainSelector";
import BudgetCard from "@/components/BudgetCard";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Slider } from "@/components/ui/slider";
import { Domain } from "@/types";

const Index = () => {
  const { budgetDocuments, domains, selectedCity, selectedDomain, setSelectedDomain, user, hasAccessToCity, accessibleCities } = useApp();
  const [searchTerm, setSearchTerm] = React.useState("");
  const isMobile = useIsMobile();
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Sliding domains feature
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Filter budget documents based on selected city, domain, and search term
  // and respect city-specific admin access
  const filteredDocuments = budgetDocuments.filter(doc => {
    // Check admin city access first
    if (user?.role === "admin" && !hasAccessToCity(doc.cityId)) {
      return false;
    }
    
    // Filter by city
    if (selectedCity && doc.cityId !== selectedCity.id) return false;
    
    // Filter by domain
    if (selectedDomain && doc.domainId !== selectedDomain.id) return false;
    
    // Filter by search term
    if (searchTerm && !doc.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !doc.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get domain for each document
  const getDocumentDomain = (domainId: string) => {
    return domains.find(d => d.id === domainId) || domains[0];
  };

  const handleDomainClick = (domain: Domain | null) => {
    setSelectedDomain(domain);
  };

  return (
    <Layout>
      <section className="mb-8 mt-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-aod-purple-800 to-aod-purple-500 bg-clip-text text-transparent">
            Government Budget Transparency
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Explore government contract budgets across various domains and raise queries for clarification.
          </p>
        </div>

        {/* Search and filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search budget documents..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="bg-aod-purple-600 hover:bg-aod-purple-700"
              onClick={() => setSearchTerm("")}
            >
              Clear Filters
            </Button>
          </div>
          
          {/* Sliding domain bar */}
          <div className="relative mb-4">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-aod-purple-100 text-aod-purple-800 hover:bg-aod-purple-200"
                onClick={scrollLeft}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            
            <div 
              ref={sliderRef}
              className="flex overflow-x-auto py-2 px-8 gap-3 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div 
                key="all" 
                onClick={() => handleDomainClick(null)}
                className={`flex-shrink-0 cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${!selectedDomain 
                    ? 'bg-aod-purple-600 text-white' 
                    : 'bg-aod-purple-100 text-aod-purple-800 hover:bg-aod-purple-200'
                  }`}
              >
                All Domains
              </div>
              
              {domains.map(domain => (
                <div
                  key={domain.id}
                  onClick={() => handleDomainClick(domain)}
                  className={`flex-shrink-0 cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${selectedDomain?.id === domain.id 
                      ? 'bg-aod-purple-600 text-white' 
                      : 'bg-aod-purple-100 text-aod-purple-800 hover:bg-aod-purple-200'
                    }`}
                  style={{
                    backgroundColor: selectedDomain?.id === domain.id ? domain.color : 'rgb(243 232 255)',
                    color: selectedDomain?.id === domain.id ? 'white' : 'rgb(107 33 168)'
                  }}
                >
                  {domain.name}
                </div>
              ))}
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-aod-purple-100 text-aod-purple-800 hover:bg-aod-purple-200"
                onClick={scrollRight}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Regular domain selector (hidden on mobile) */}
          <div className={isMobile ? "hidden" : ""}>
            <DomainSelector />
          </div>
        </div>

        {/* Admin city access restriction notice */}
        {user?.role === "admin" && user.assignedCityIds && user.assignedCityIds.length > 0 && (
          <div className="text-center p-4 mb-4 bg-aod-purple-100 rounded-lg border border-aod-purple-200">
            <p className="text-aod-purple-800">
              You have access to: {accessibleCities.map(c => c.name).join(', ')}
            </p>
          </div>
        )}

        {/* City selection prompt if no city selected */}
        {!selectedCity && (
          <div className="text-center p-8 mb-8 bg-aod-purple-100 rounded-lg border border-aod-purple-200">
            <h3 className="text-xl font-semibold text-aod-purple-800 mb-2">Select a City</h3>
            <p className="text-gray-600">
              Please select a city from the dropdown in the header to view relevant budget documents.
            </p>
          </div>
        )}

        {/* Budget documents grid */}
        {selectedCity && (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Budget Documents for {selectedCity.name}, {selectedCity.state}
            </h2>
            
            {/* Show message if admin doesn't have access to this city */}
            {user?.role === "admin" && !hasAccessToCity(selectedCity.id) ? (
              <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-gray-700">You don't have access to view or manage budgets for {selectedCity.name}.</p>
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg border">
                <p className="text-gray-600">No budget documents found with the current filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <BudgetCard 
                    key={document.id} 
                    document={document} 
                    domain={getDocumentDomain(document.domainId)} 
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
};

export default Index;
