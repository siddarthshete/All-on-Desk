
import React from "react";
import { BudgetDocument, Domain } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, FileQuestion } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";

interface BudgetCardProps {
  document: BudgetDocument;
  domain: Domain;
}

const BudgetCard: React.FC<BudgetCardProps> = ({ document, domain }) => {
  const { user } = useApp();
  
  return (
    <Card className="overflow-hidden border-t-4" style={{ borderTopColor: domain.color }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{document.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{document.year} - {document.quarter}</span>
          <span className="font-semibold text-aod-purple-800">{formatCurrency(document.amount)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">{document.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t bg-muted/30">
        <Link to={`/documents/${document.id}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <File size={16} />
            <span>View</span>
          </Button>
        </Link>
        {user && user.role === "user" && (
          <Link to={`/raise-query/${document.id}`}>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-aod-purple-600">
              <FileQuestion size={16} />
              <span>Raise Query</span>
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default BudgetCard;
