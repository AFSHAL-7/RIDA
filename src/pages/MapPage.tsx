
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import AccidentMap from "@/components/map/AccidentMap";

export default function MapPage() {
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
          <h1 className="text-3xl font-bold tracking-tight animate-float">Accident Map</h1>
          <p className="text-muted-foreground">
            Interactive visualization of accident locations and hotspots.
          </p>
        </div>
        
        <div 
          className={`transition-all duration-500 delay-200 ${
            isVisible ? "opacity-100 scale-in" : "opacity-0 scale-90"
          }`}
        >
          <AccidentMap />
        </div>
      </div>
    </Layout>
  );
}
