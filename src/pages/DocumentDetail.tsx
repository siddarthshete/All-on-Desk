
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Download, Edit, FileText, Trash } from "lucide-react";
import QueryCard from "@/components/QueryCard";

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { budgetDocuments, domains, cities, queries, user, deleteBudgetDocument } = useApp();
  
  // Find the budget document, its domain, and city
  const document = budgetDocuments.find(doc => doc.id === id);
  const domain = document ? domains.find(d => d.id === document.domainId) : null;
  const city = document ? cities.find(c => c.id === document.cityId) : null;
  
  // Find related queries for this document
  const documentQueries = queries.filter(q => q.budgetDocumentId === id);
  
  // Handle document not found
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
  
  const handleDelete = () => {
    deleteBudgetDocument(document.id);
    navigate("/");
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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{document.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge style={{ backgroundColor: domain.color }}>
                {domain.name}
              </Badge>
              <span className="text-gray-600">
                {city.name}, {city.state}
              </span>
            </div>
          </div>
          
          {user?.role === "admin" && (
            <div className="flex gap-2 mt-4 md:mt-0">
              <Link to={`/edit-document/${document.id}`}>
                <Button variant="outline" className="flex items-center gap-1">
                  <Edit size={16} />
                  <span>Edit</span>
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex items-center gap-1">
                    <Trash size={16} />
                    <span>Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the budget document and all associated queries.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Budget Details</CardTitle>
            <CardDescription>
              {document.year} - {document.quarter}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{document.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
                  <p className="mt-1 text-2xl font-bold text-aod-purple-700">{formatCurrency(document.amount)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Domain</h3>
                  <p className="mt-1">{domain.name}</p>
                  <p className="text-xs text-gray-500">{domain.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="mt-1">{city.name}, {city.state}</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Document Information</h3>
                <div className="p-4 mt-2 border rounded-md bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-10 w-10 text-aod-purple-600 mr-3" />
                    <div>
                      <p className="font-medium">Budget Document</p>
                      <p className="text-xs text-gray-500">
                        Updated on {formatDate(document.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Download size={16} />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-gray-500 border-t pt-4">
            <div>
              <p>Created: {formatDate(document.createdAt)}</p>
              <p>Last Updated: {formatDate(document.updatedAt)}</p>
            </div>
          </CardFooter>
        </Card>
        
        {/* Queries Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Queries</h2>
            {user?.role === "user" && (
              <Link to={`/raise-query/${document.id}`}>
                <Button className="bg-aod-purple-600 hover:bg-aod-purple-700">Raise a Query</Button>
              </Link>
            )}
          </div>
          
          {documentQueries.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border">
              <p className="text-gray-600">No queries have been submitted for this budget document yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documentQueries.map((query) => (
                <QueryCard key={query.id} query={query} document={document} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DocumentDetail;
