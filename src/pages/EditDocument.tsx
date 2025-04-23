import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload } from "lucide-react";

const EditDocument = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, budgetDocuments, domains, cities, updateBudgetDocument } = useApp();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cityId, setCityId] = useState("");
  const [domainId, setDomainId] = useState("");
  const [year, setYear] = useState("");
  const [quarter, setQuarter] = useState("");
  const [amount, setAmount] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const document = budgetDocuments.find(doc => doc.id === id);
  
  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setDescription(document.description);
      setCityId(document.cityId);
      setDomainId(document.domainId);
      setYear(document.year.toString());
      setQuarter(document.quarter);
      setAmount(document.amount.toString());
      setDocumentUrl(document.documentUrl);
    }
  }, [document]);
  
  if (!document) {
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to edit budget documents.</p>
          <Button onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </div>
      </Layout>
    );
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await updateBudgetDocument(document.id, {
      title,
      description,
      cityId,
      domainId,
      year: parseInt(year),
      quarter,
      amount: parseFloat(amount),
      documentUrl: "" // will be set by file upload logic if file provided
    }, file || undefined);

    setIsSubmitting(false);
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Budget Document</CardTitle>
            <CardDescription>
              Update the details for this budget document
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  placeholder="Enter a title for the budget document"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the budget allocation and purpose"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={cityId}
                    onValueChange={setCityId}
                    required
                  >
                    <SelectTrigger id="city">
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
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Select
                    value={domainId}
                    onValueChange={setDomainId}
                    required
                  >
                    <SelectTrigger id="domain">
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {domains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          {domain.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2020"
                    max="2030"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quarter">Quarter</Label>
                  <Select
                    value={quarter}
                    onValueChange={setQuarter}
                    required
                  >
                    <SelectTrigger id="quarter">
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1">Q1 (Jan-Mar)</SelectItem>
                      <SelectItem value="Q2">Q2 (Apr-Jun)</SelectItem>
                      <SelectItem value="Q3">Q3 (Jul-Sep)</SelectItem>
                      <SelectItem value="Q4">Q4 (Oct-Dec)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Budget Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="e.g. 5000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">Replace Budget Document</Label>
                <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <input
                    id="document"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">Current: {documentUrl ? documentUrl.split('/').pop() : "None"} (PDF only)</p>
                </div>
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
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default EditDocument;
