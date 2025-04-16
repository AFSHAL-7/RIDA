
import { useState } from "react";
import { 
  FileText, 
  Download, 
  Printer, 
  Mail, 
  Calendar,
  BarChart2,
  Map,
  CheckCircle2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportGenerator() {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [reportType, setReportType] = useState("comprehensive");
  const [dateRange, setDateRange] = useState("last30");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 3000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Report Generator</CardTitle>
        <CardDescription>
          Generate detailed safety reports based on accident data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {reportGenerated ? (
          <div className="space-y-6">
            <div className="rounded-md border p-4 bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/20 p-2">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Report Generated Successfully</h3>
                  <p className="text-sm text-muted-foreground">
                    Your report is ready to download, print, or share
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">
                    {reportType === "comprehensive" ? "Comprehensive Safety Report" : 
                     reportType === "hotspot" ? "Accident Hotspot Analysis" :
                     "Safety Measures Recommendation Report"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedFormat.toUpperCase()} • {new Date().toLocaleDateString()} • 15 pages
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" className="flex gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" className="flex gap-2">
                <Mail className="h-4 w-4" />
                Email Report
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">1. Report Type</h3>
              <RadioGroup 
                value={reportType} 
                onValueChange={setReportType}
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 rounded-md border p-3">
                  <RadioGroupItem value="comprehensive" id="comprehensive" />
                  <div className="space-y-1">
                    <Label htmlFor="comprehensive" className="font-medium">Comprehensive Safety Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Complete overview of accident data, trends, and suggested safety measures
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 rounded-md border p-3">
                  <RadioGroupItem value="hotspot" id="hotspot" />
                  <div className="space-y-1">
                    <Label htmlFor="hotspot" className="font-medium">Accident Hotspot Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Geographic analysis of accident clusters and high-risk zones
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 rounded-md border p-3">
                  <RadioGroupItem value="measures" id="measures" />
                  <div className="space-y-1">
                    <Label htmlFor="measures" className="font-medium">Safety Measures Recommendation</Label>
                    <p className="text-sm text-muted-foreground">
                      AI-suggested infrastructure and policy improvements
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-sm">2. Report Period</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date-range">Time Period</Label>
                  <Select 
                    value={dateRange} 
                    onValueChange={setDateRange}
                  >
                    <SelectTrigger id="date-range" className="w-full mt-1">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last30">Last 30 Days</SelectItem>
                      <SelectItem value="last90">Last 90 Days</SelectItem>
                      <SelectItem value="last6m">Last 6 Months</SelectItem>
                      <SelectItem value="last12m">Last 12 Months</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {dateRange === "custom" && (
                  <div>
                    <Label htmlFor="custom-range">Custom Range</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="date" 
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      />
                      <span>to</span>
                      <input 
                        type="date" 
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-sm">3. Report Content</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-summary" defaultChecked />
                    <Label htmlFor="include-summary">Executive Summary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-trends" defaultChecked />
                    <Label htmlFor="include-trends">Trend Analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-maps" defaultChecked />
                    <Label htmlFor="include-maps">Maps & Visualizations</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-recommendations" defaultChecked />
                    <Label htmlFor="include-recommendations">Safety Recommendations</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-raw" />
                    <Label htmlFor="include-raw">Raw Data Tables</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-methodology" />
                    <Label htmlFor="include-methodology">Methodology Details</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-sm">4. Report Format</h3>
              <Tabs 
                defaultValue="pdf" 
                value={selectedFormat} 
                onValueChange={setSelectedFormat}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pdf">PDF</TabsTrigger>
                  <TabsTrigger value="excel">Excel</TabsTrigger>
                  <TabsTrigger value="csv">CSV</TabsTrigger>
                </TabsList>
                <TabsContent value="pdf" className="p-4 border rounded-md mt-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">PDF Report</p>
                      <p className="text-xs text-muted-foreground">
                        Complete report with visualizations and analysis
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="excel" className="p-4 border rounded-md mt-2">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Excel Report</p>
                      <p className="text-xs text-muted-foreground">
                        Detailed data tables with charts and pivot options
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="csv" className="p-4 border rounded-md mt-2">
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">CSV Export</p>
                      <p className="text-xs text-muted-foreground">
                        Raw data export compatible with GIS and analysis tools
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </CardContent>
      
      {!reportGenerated && (
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => setReportType("comprehensive")}>
            Reset
          </Button>
          <Button 
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </CardFooter>
      )}
      
      {reportGenerated && (
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => setReportGenerated(false)}>
            Create Another Report
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
