
import React, { useEffect } from "react";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import DomainSelector from "@/components/DomainSelector";
import BudgetCard from "@/components/BudgetCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const { budgetDocuments, domains, selectedCity, selectedDomain } = useApp();
  const [searchTerm, setSearchTerm] = React.useState("");

  // Filter budget documents based on selected city, domain, and search term
  const filteredDocuments = budgetDocuments.filter(doc => {
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

  return (
    <Layout>
      <section className="mb-8 mt-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-aod-purple-800 to-aod-purple-500 bg-clip-text text-transparent">
            Government Budget Transparency
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
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
          
          <DomainSelector />
        </div>

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
            
            {filteredDocuments.length === 0 ? (
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
