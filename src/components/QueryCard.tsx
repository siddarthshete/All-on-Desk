
import React from "react";
import { Query, BudgetDocument } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface QueryCardProps {
  query: Query;
  document: BudgetDocument;
}

const QueryCard: React.FC<QueryCardProps> = ({ query, document }) => {
  const { user, respondToQuery } = useApp();
  const [response, setResponse] = React.useState("");
  const [isResponseOpen, setIsResponseOpen] = React.useState(false);
  
  const getStatusIcon = () => {
    switch (query.status) {
      case "pending":
        return <Clock className="text-yellow-500" size={16} />;
      case "resolved":
        return <CheckCircle className="text-green-500" size={16} />;
      case "rejected":
        return <AlertCircle className="text-red-500" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (query.status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "";
    }
  };

  const handleSubmitResponse = () => {
    if (response.trim()) {
      respondToQuery(query.id, response);
      setIsResponseOpen(false);
      setResponse("");
    }
  };

  return (
    <Card className={`border-l-4 ${getStatusColor()}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{query.title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            {getStatusIcon()}
            <span>{query.status.charAt(0).toUpperCase() + query.status.slice(1)}</span>
          </Badge>
        </div>
        <CardDescription>
          Related to: {document.title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{query.description}</p>
        
        {query.response && (
          <div className="mt-2 p-3 bg-muted rounded-md">
            <h4 className="text-sm font-medium mb-1">Response:</h4>
            <p className="text-sm">{query.response}</p>
          </div>
        )}
        
        {user?.role === "admin" && query.status === "pending" && (
          <>
            {isResponseOpen ? (
              <div className="mt-3">
                <textarea
                  className="w-full p-2 border rounded-md text-sm"
                  rows={3}
                  placeholder="Type your response here..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsResponseOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleSubmitResponse}
                  >
                    Submit Response
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setIsResponseOpen(true)}
              >
                Respond to Query
              </Button>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 pt-0">
        Submitted on {new Date(query.createdAt).toLocaleDateString()}
      </CardFooter>
    </Card>
  );
};

export default QueryCard;
