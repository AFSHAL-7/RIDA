
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import DataUpload from "@/components/upload/DataUpload";

export default function UploadPage() {
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
          <h1 className="text-3xl font-bold tracking-tight animate-float">Data Upload</h1>
          <p className="text-muted-foreground">
            Import accident data from various sources.
          </p>
        </div>
        
        <div 
          className={`transition-all duration-500 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <DataUpload />
        </div>
      </div>
    </Layout>
  );
}
