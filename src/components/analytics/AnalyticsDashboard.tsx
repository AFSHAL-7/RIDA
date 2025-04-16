
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

// Sample accident data for our analytics
const accidentsByMonthData = [
  { name: "Jan", accidents: 65 },
  { name: "Feb", accidents: 59 },
  { name: "Mar", accidents: 80 },
  { name: "Apr", accidents: 81 },
  { name: "May", accidents: 56 },
  { name: "Jun", accidents: 55 },
  { name: "Jul", accidents: 40 },
  { name: "Aug", accidents: 45 },
  { name: "Sep", accidents: 58 },
  { name: "Oct", accidents: 70 },
  { name: "Nov", accidents: 65 },
  { name: "Dec", accidents: 90 }
];

const accidentsBySeverityData = [
  { name: "Low", value: 400, color: "#009bb2" },
  { name: "Medium", value: 300, color: "#ffaf00" },
  { name: "High", value: 200, color: "#c30000" }
];

const accidentsByTimeData = [
  { time: "12am", accidents: 15 },
  { time: "3am", accidents: 8 },
  { time: "6am", accidents: 25 },
  { time: "9am", accidents: 85 },
  { time: "12pm", accidents: 45 },
  { time: "3pm", accidents: 65 },
  { time: "6pm", accidents: 95 },
  { time: "9pm", accidents: 35 }
];

const accidentsByWeatherData = [
  { name: "Clear", value: 35, color: "#3498db" },
  { name: "Rain", value: 40, color: "#2c3e50" },
  { name: "Snow", value: 15, color: "#ecf0f1" },
  { name: "Fog", value: 10, color: "#bdc3c7" }
];

const accidentsByRoadTypeData = [
  { name: "Highway", accidents: 120 },
  { name: "Urban Street", accidents: 280 },
  { name: "Rural Road", accidents: 90 },
  { name: "Intersection", accidents: 210 },
  { name: "Roundabout", accidents: 30 },
  { name: "Bridge", accidents: 20 }
];

const trendAnalysisData = [
  {
    month: "Jan",
    "This Year": 45,
    "Last Year": 60
  },
  {
    month: "Feb",
    "This Year": 52,
    "Last Year": 65
  },
  {
    month: "Mar",
    "This Year": 48,
    "Last Year": 62
  },
  {
    month: "Apr",
    "This Year": 61,
    "Last Year": 70
  },
  {
    month: "May",
    "This Year": 55,
    "Last Year": 68
  },
  {
    month: "Jun",
    "This Year": 48,
    "Last Year": 66
  }
];

export default function AnalyticsDashboard() {
  const [selectedChart, setSelectedChart] = useState("monthly");
  const [timeRange, setTimeRange] = useState("6m");
  
  // Function to map time range to user-friendly text
  const getTimeRangeText = (range: string) => {
    switch (range) {
      case "1m": return "Last Month";
      case "3m": return "Last 3 Months";
      case "6m": return "Last 6 Months";
      case "1y": return "Last Year";
      case "all": return "All Time";
      default: return "Last 6 Months";
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Accident Analytics</h2>
          <p className="text-muted-foreground">
            Analyze accident patterns and trends
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Label htmlFor="time-range">Time Range:</Label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger id="time-range" className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="monthly" value={selectedChart} onValueChange={setSelectedChart}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="severity">Severity Analysis</TabsTrigger>
          <TabsTrigger value="time">Time of Day</TabsTrigger>
          <TabsTrigger value="factors">Contributing Factors</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <TabsContent value="monthly" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Accident Trends</CardTitle>
                <CardDescription>
                  Total accidents recorded per month for {getTimeRangeText(timeRange)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={accidentsByMonthData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="accidents" fill="#009bb2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="monthly" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Comparison</CardTitle>
                <CardDescription>
                  Compare accident trends with previous year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendAnalysisData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="This Year"
                        stroke="#009bb2"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Last Year"
                        stroke="#bdc3c7"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="severity" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Accident Severity Distribution</CardTitle>
                <CardDescription>
                  Proportion of accidents by severity level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accidentsBySeverityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label
                      >
                        {accidentsBySeverityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="severity" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Accidents by Road Type</CardTitle>
                <CardDescription>
                  Distribution of accidents across different road types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={accidentsByRoadTypeData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="accidents" fill="#ffaf00" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="time" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Accidents by Time of Day</CardTitle>
                <CardDescription>
                  Distribution of accidents throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={accidentsByTimeData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="accidents"
                        stroke="#009bb2"
                        fill="#009bb2"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="time" className="m-0">
            <Card className="flex h-full">
              <div className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Peak Accident Times</CardTitle>
                  <CardDescription>
                    AI-identified high-risk time windows
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-6">
                    <div className="border rounded-md p-4 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning-500" />
                        <h3 className="font-semibold">Morning Rush Hour</h3>
                      </div>
                      <div className="mt-2 text-sm">
                        <p className="mb-1">7:30 AM - 9:00 AM</p>
                        <p className="text-muted-foreground">
                          27% of weekday accidents occur during this period, primarily at major intersections and highway on-ramps.
                        </p>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-danger-500" />
                        <h3 className="font-semibold">Evening Commute</h3>
                      </div>
                      <div className="mt-2 text-sm">
                        <p className="mb-1">5:00 PM - 7:00 PM</p>
                        <p className="text-muted-foreground">
                          32% of weekday accidents occur in this window, with highest concentration in urban areas and highways.
                        </p>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning-500" />
                        <h3 className="font-semibold">Late Night</h3>
                      </div>
                      <div className="mt-2 text-sm">
                        <p className="mb-1">11:00 PM - 2:00 AM</p>
                        <p className="text-muted-foreground">
                          18% of weekend accidents occur during these hours, with higher severity rates than daytime incidents.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="factors" className="m-0">
            <Card>
              <CardHeader>
                <CardTitle>Weather Conditions</CardTitle>
                <CardDescription>
                  Accidents distributed by weather conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={accidentsByWeatherData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {accidentsByWeatherData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="factors" className="m-0">
            <Card className="flex h-full">
              <div className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Contributing Risk Factors</CardTitle>
                  <CardDescription>
                    AI-identified key risk factors in high-accident areas
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Poor Visibility</Label>
                        <span className="text-xs text-muted-foreground">42%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-danger-500" style={{ width: "42%" }} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Inadequate Signage</Label>
                        <span className="text-xs text-muted-foreground">38%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-danger-500" style={{ width: "38%" }} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Road Surface Conditions</Label>
                        <span className="text-xs text-muted-foreground">35%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-warning-500" style={{ width: "35%" }} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Traffic Congestion</Label>
                        <span className="text-xs text-muted-foreground">28%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-warning-500" style={{ width: "28%" }} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Intersection Design</Label>
                        <span className="text-xs text-muted-foreground">26%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-warning-500" style={{ width: "26%" }} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Speed Limits</Label>
                        <span className="text-xs text-muted-foreground">22%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-safety-500" style={{ width: "22%" }} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Lighting Conditions</Label>
                        <span className="text-xs text-muted-foreground">19%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full rounded-full bg-safety-500" style={{ width: "19%" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
