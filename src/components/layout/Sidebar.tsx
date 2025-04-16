
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart2, 
  Map, 
  Upload, 
  AlertTriangle, 
  Settings, 
  FileText, 
  Menu, 
  X,
  Home,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  description: string;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview of road safety metrics"
  },
  {
    title: "Accident Map",
    href: "/map",
    icon: Map,
    description: "Interactive accident visualization"
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart2,
    description: "Advanced data analysis"
  },
  {
    title: "Data Upload",
    href: "/upload",
    icon: Upload,
    description: "Import accident data"
  },
  {
    title: "Risk Assessment",
    href: "/risk",
    icon: AlertTriangle,
    description: "AI-powered risk analysis"
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    description: "Generate safety reports"
  },
  {
    title: "User Management",
    href: "/users",
    icon: Users,
    description: "Manage user access"
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "System configuration"
  }
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Sidebar backdrop for mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-[280px] flex-col border-r bg-sidebar shadow-sm transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2" onClick={isMobile ? toggleSidebar : undefined}>
            <div className="rounded-full bg-primary p-1">
              <AlertTriangle size={18} className="text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl">Road Guardian</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={isMobile ? toggleSidebar : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="border-t p-4">
          <div className="rounded-md bg-sidebar-accent/50 p-4">
            <h3 className="font-medium text-sm">Road Guardian Insights</h3>
            <p className="text-xs text-muted-foreground mt-1">
              AI-powered road safety analytics and visualization platform
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
