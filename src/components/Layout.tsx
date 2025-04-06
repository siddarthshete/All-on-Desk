
import React from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut } from "lucide-react";
import CitySelector from "./CitySelector";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-aod-purple-50">
      {/* Header */}
      <header className="bg-aod-purple-600 text-white shadow-md">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">All On Desk</span>
          </Link>
          
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
            <div>
              <h3 className="text-xl font-bold mb-4">All On Desk</h3>
              <p className="text-aod-purple-200">
                Government contract budget transparency platform.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-aod-purple-200 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-aod-purple-200 hover:text-white">About</Link></li>
                <li><Link to="/faq" className="text-aod-purple-200 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
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
