
import { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function Layout({ children, className }: LayoutProps) {
  // Add staggered animation effect when page loads
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('page-fade-in');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn("pl-0 lg:pl-[280px] transition-all", className)}>
        <div className="container mx-auto p-4 md:p-6 pt-16 lg:pt-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
