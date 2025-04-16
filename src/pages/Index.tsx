
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AccidentMap from "@/components/map/AccidentMap";

export default function Index() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div 
          className={`flex flex-col space-y-2 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-3xl font-bold tracking-tight animate-float">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Road Guardian Insights - your comprehensive traffic safety analysis platform.
          </p>
        </div>
        
        <div className={`transition-all duration-500 delay-100 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <DashboardStats />
        </div>
        
        <div 
          className={`mt-8 transition-all duration-500 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4 animate-float">Accident Hotspots</h2>
          <div className="scale-in">
            <AccidentMap />
          </div>
        </div>
      </div>
    </Layout>
  );
}
