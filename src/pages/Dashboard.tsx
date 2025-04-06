
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, HelpCircle, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import QueryCard from "@/components/QueryCard";
import BudgetCard from "@/components/BudgetCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, budgetDocuments, domains, queries, accessibleCities, hasAccessToCity } = useApp();
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  
  // If user is not logged in, redirect to login
  if (!user) {
    return (
      <Layout>
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
          <Button onClick={() => navigate("/login")}>
            Log In
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Filter documents based on user's city access
  const accessibleDocuments = budgetDocuments.filter(doc => {
    if (user.role === "admin") {
      return hasAccessToCity(doc.cityId);
    }
    return true; // Regular users can see all documents
  });
  
  // Find queries relevant to the user
  const userQueries = user.role === "admin" 
    ? queries.filter(q => {
        const document = budgetDocuments.find(doc => doc.id === q.budgetDocumentId);
        return document && hasAccessToCity(document.cityId);
      }) 
    : queries.filter(q => q.userId === user.id);
  
  const pendingQueries = userQueries.filter(q => q.status === "pending");
  
  // Get document for each query
  const getQueryDocument = (budgetDocumentId: string) => {
    return budgetDocuments.find(doc => doc.id === budgetDocumentId) || budgetDocuments[0];
  };
  
  // Get domain for each document
  const getDocumentDomain = (domainId: string) => {
    return domains.find(d => d.id === domainId) || domains[0];
  };
  
  // Filter documents by domain
  const filteredDocuments = activeDomain
    ? accessibleDocuments.filter(doc => doc.domainId === activeDomain)
    : accessibleDocuments;

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}!</p>
            {user.role === "admin" && user.assignedCityIds && user.assignedCityIds.length > 0 && (
              <p className="text-sm text-aod-purple-600 mt-1">
                You have access to: {accessibleCities.map(c => c.name).join(', ')}
              </p>
            )}
          </div>
          
          {user.role === "admin" && (
            <Link to="/add-document">
              <Button className="bg-aod-purple-600 hover:bg-aod-purple-700 mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" />
                Add New Document
              </Button>
            </Link>
          )}
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Documents</CardTitle>
              <CardDescription>Total budget documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-aod-purple-600 mr-3" />
                <span className="text-3xl font-bold">{accessibleDocuments.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Queries</CardTitle>
              <CardDescription>Total submitted queries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <HelpCircle className="h-8 w-8 text-aod-purple-600 mr-3" />
                <span className="text-3xl font-bold">{userQueries.length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
              <CardDescription>Queries awaiting response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-aod-purple-600 mr-3" />
                <span className="text-3xl font-bold">{pendingQueries.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Admin alert */}
        {user.role === "admin" && pendingQueries.length > 0 && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertDescription>
              You have {pendingQueries.length} pending {pendingQueries.length === 1 ? "query" : "queries"} that need your attention.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Main content tabs */}
        <Tabs defaultValue="documents" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="documents">Budget Documents</TabsTrigger>
            <TabsTrigger value="queries">Queries</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documents">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-4">Budget Documents</h2>
              
              {/* Domain filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  variant={activeDomain === null ? "default" : "outline"}
                  className={activeDomain === null ? "bg-aod-purple-600" : ""}
                  onClick={() => setActiveDomain(null)}
                >
                  All Domains
                </Button>
                {domains.map((domain) => (
                  <Button
                    key={domain.id}
                    variant={activeDomain === domain.id ? "default" : "outline"}
                    className={activeDomain === domain.id ? "" : ""}
                    style={activeDomain === domain.id ? { backgroundColor: domain.color } : {}}
                    onClick={() => setActiveDomain(domain.id)}
                  >
                    {domain.name}
                  </Button>
                ))}
              </div>
              
              {accessibleCities.length === 0 && user.role === "admin" ? (
                <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-gray-600">
                    You don't have access to any cities. Please contact the super administrator.
                  </p>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg border">
                  <p className="text-gray-600">
                    No budget documents found matching the current filters.
                  </p>
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
            </div>
          </TabsContent>
          
          <TabsContent value="queries">
            <div>
              <h2 className="text-xl font-bold mb-4">Your Queries</h2>
              
              {userQueries.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg border">
                  <p className="text-gray-600">
                    {user.role === "admin" 
                      ? "There are no queries in the system yet for your assigned cities." 
                      : "You haven't submitted any queries yet."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userQueries.map((query) => (
                    <QueryCard 
                      key={query.id} 
                      query={query} 
                      document={getQueryDocument(query.budgetDocumentId)} 
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
