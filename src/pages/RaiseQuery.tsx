
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

const RaiseQuery = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { budgetDocuments, domains, cities, user, createQuery } = useApp();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the budget document, its domain, and city
  const document = budgetDocuments.find(doc => doc.id === id);
  const domain = document ? domains.find(d => d.id === document.domainId) : null;
  const city = document ? cities.find(c => c.id === document.cityId) : null;
  
  // Handle document not found or user not logged in
  if (!document || !domain || !city) {
    return (
      <Layout>
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Document Not Found</h2>
          <p className="text-gray-600 mb-6">The budget document you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout>
        <div className="text-center p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to raise a query about this budget document.</p>
          <Button onClick={() => navigate("/login")}>
            Log In
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    createQuery({
      title,
      description,
      budgetDocumentId: document.id,
    });
    
    // Navigate back to the document page
    setTimeout(() => {
      navigate(`/documents/${document.id}`);
    }, 1000);
  };

  return (
    <Layout>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Document
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Raise a Query</CardTitle>
            <CardDescription>
              Submit your question about "{document.title}" for {city.name}, {city.state}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Query Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a concise title for your query"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Query Details</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your question or concern in detail..."
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-aod-purple-600 hover:bg-aod-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Query"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default RaiseQuery;
