
import React from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Menu } from "lucide-react";
import CitySelector from "./CitySelector";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useApp();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-aod-purple-50">
      {/* Header */}
      <header className="bg-aod-purple-600 text-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/ae1ff7ee-d261-49b5-b929-b41a26ce09ec.png" 
              alt="All On Desk Logo" 
              className="h-10 w-10 rounded-full bg-black"
            />
            <span className="text-2xl font-bold hidden sm:inline">All On Desk</span>
          </Link>
          
          {isMobile ? (
            <div className="flex items-center gap-2">
              <CitySelector />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white">
                    <Menu />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-aod-purple-800 text-white">
                  <div className="flex flex-col gap-6 pt-10">
                    <div className="flex justify-center mb-4">
                      <img 
                        src="/lovable-uploads/ae1ff7ee-d261-49b5-b929-b41a26ce09ec.png" 
                        alt="All On Desk Logo" 
                        className="h-20 w-20 rounded-full bg-black"
                      />
                    </div>
                    <div className="flex flex-col gap-4 items-center">
                      {user ? (
                        <>
                          <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-aod-purple-200 py-2">
                            <UserCircle size={20} />
                            <span>{user.name}</span>
                          </Link>
                          <Button 
                            variant="outline" 
                            className="w-full text-white border-white hover:text-aod-purple-200" 
                            onClick={logout}
                          >
                            <LogOut size={20} className="mr-2" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-col w-full gap-3">
                          <Link to="/login" className="w-full">
                            <Button variant="outline" className="w-full bg-white text-aod-purple-600 hover:bg-aod-purple-100">
                              Login
                            </Button>
                          </Link>
                          <Link to="/register" className="w-full">
                            <Button className="w-full bg-aod-purple-500 text-white hover:bg-aod-purple-600">
                              Register
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4 text-center">Quick Links</h3>
                      <div className="flex flex-col gap-3">
                        <Link to="/" className="text-aod-purple-200 hover:text-white py-2 text-center">Home</Link>
                        <Link to="/about" className="text-aod-purple-200 hover:text-white py-2 text-center">About</Link>
                        <Link to="/faq" className="text-aod-purple-200 hover:text-white py-2 text-center">FAQ</Link>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* City Selector */}
              <CitySelector />
              
              {/* User menu / Auth buttons */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard" className="flex items-center gap-1 text-white hover:text-aod-purple-200">
                    <UserCircle size={20} />
                    <span>{user.name}</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-aod-purple-200" 
                    onClick={logout}
                  >
                    <LogOut size={20} />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login">
                    <Button variant="outline" className="bg-white text-aod-purple-600 hover:bg-aod-purple-100">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-aod-purple-800 text-white hover:bg-aod-purple-900">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto py-6 px-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-aod-purple-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start items-center gap-2 mb-4">
                <img 
                  src="/lovable-uploads/ae1ff7ee-d261-49b5-b929-b41a26ce09ec.png" 
                  alt="All On Desk Logo" 
                  className="h-8 w-8 rounded-full bg-black"
                />
                <h3 className="text-xl font-bold">All On Desk</h3>
              </div>
              <p className="text-aod-purple-200">
                Government contract budget transparency platform.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-aod-purple-200 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-aod-purple-200 hover:text-white">About</Link></li>
                <li><Link to="/faq" className="text-aod-purple-200 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-aod-purple-200">
                Email: contact@allondesk.gov<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-aod-purple-700 pt-4 text-center text-aod-purple-300">
            <p>&copy; {new Date().getFullYear()} All On Desk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
