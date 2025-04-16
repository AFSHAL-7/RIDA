
import { 
  BarChart2, 
  Car,
  AlertTriangle, 
  Timer,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: number;
  trendText?: string;
  iconColor?: string;
  className?: string;
  delay?: number;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendText,
  iconColor = "text-primary",
  className,
  delay = 0,
}: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const trendIsPositive = trend !== undefined ? trend > 0 : undefined;
  const TrendIcon = trendIsPositive ? TrendingUp : TrendingDown;
  
  // Staggered animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  const getTrendColor = () => {
    // Reverse the color logic for certain metrics where down is good
    const isDownPositive = title.includes("Accidents") || title.includes("Casualties") || title.includes("Risk");
    
    if (trend === undefined) return "text-muted-foreground";
    
    if (isDownPositive) {
      return trendIsPositive ? "text-danger-500" : "text-safety-500";
    } else {
      return trendIsPositive ? "text-safety-500" : "text-danger-500";
    }
  };
  
  const trendColor = getTrendColor();

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-500 transform hover-glow",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("rounded-full p-2 transition-all hover-rotate", iconColor + "/10")}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground pt-1">{description}</p>
        {trend !== undefined && (
          <div className="flex items-center pt-2 animate-pulse-ring">
            <TrendIcon className={cn("h-3 w-3 mr-1", trendColor)} />
            <span className={cn("text-xs font-medium", trendColor)}>
              {trend > 0 ? "+" : ""}
              {trend}% {trendText}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Accidents"
        value="1,432"
        description="Total recorded accidents in the system"
        icon={Car}
        trend={-12.5}
        trendText="from last month"
        iconColor="text-danger"
        delay={100}
      />
      <StatCard
        title="High Risk Zones"
        value="28"
        description="Areas identified as high accident risk"
        icon={AlertTriangle}
        trend={-3.6}
        trendText="from last month"
        iconColor="text-warning"
        delay={200}
      />
      <StatCard
        title="Avg. Response Time"
        value="18.2 min"
        description="Average emergency response time"
        icon={Timer}
        trend={-7.2}
        trendText="improvement"
        iconColor="text-primary"
        delay={300}
      />
      <StatCard
        title="Safety Score"
        value="73/100"
        description="Overall safety rating in monitored areas"
        icon={BarChart2}
        trend={5.3}
        trendText="improvement"
        iconColor="text-safety-500"
        delay={400}
      />
    </div>
  );
}
