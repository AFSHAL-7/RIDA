
import { useState } from "react";
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  Check,
  X,
  Database,
  Link,
  Sheet
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// File types we support for accident data
const SUPPORTED_FORMATS = [
  { extension: ".csv", type: "text/csv" },
  { extension: ".xlsx", type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { extension: ".json", type: "application/json" },
  { extension: ".geojson", type: "application/geo+json" }
];

export default function DataUpload() {
  const [activeTab, setActiveTab] = useState("file");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [structureType, setStructureType] = useState("default");
  const [customMapping, setCustomMapping] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      setSelectedFile(null);
      return;
    }
    
    const file = files[0];
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const isSupported = SUPPORTED_FORMATS.some(format => 
      format.extension === fileExtension || format.type === file.type
    );
    
    if (!isSupported) {
      setValidationError(`Unsupported file format. Please upload one of: ${SUPPORTED_FORMATS.map(f => f.extension).join(', ')}`);
      setSelectedFile(null);
      return;
    }
    
    setSelectedFile(file);
  };

  // Simulate file upload
  const handleUpload = () => {
    if (activeTab === "file" && !selectedFile) {
      setValidationError("Please select a file to upload");
      return;
    }
    
    if (activeTab === "api" && !apiEndpoint) {
      setValidationError("API endpoint is required");
      return;
    }
    
    setValidationError(null);
    setUploadStatus("uploading");
    setUploadProgress(0);
    
    // Simulate progress
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setUploadStatus("success");
          }, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 500);
  };

  const resetUpload = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setSelectedFile(null);
    setApiEndpoint("");
    setApiKey("");
    setValidationError(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Data Upload</CardTitle>
        <CardDescription>
          Import accident data from files or external APIs
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {uploadStatus === "success" ? (
          <div className="space-y-4">
            <Alert className="bg-safety-50 border-safety-200">
              <Check className="h-4 w-4 text-safety-600" />
              <AlertTitle>Upload Successful</AlertTitle>
              <AlertDescription>
                Your data has been successfully uploaded and is being processed. It will be available for analysis soon.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end">
              <Button onClick={resetUpload}>Upload Another File</Button>
            </div>
          </div>
        ) : uploadStatus === "error" ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>
                There was an error uploading your data. Please try again or contact support.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end">
              <Button onClick={resetUpload} variant="outline">Try Again</Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="file">
                <FileText className="h-4 w-4 mr-2" />
                File Upload
              </TabsTrigger>
              <TabsTrigger value="api">
                <Link className="h-4 w-4 mr-2" />
                API Connection
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              {validationError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}
              
              <TabsContent value="file" className="space-y-4">
                {uploadStatus === "uploading" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Uploading {selectedFile?.name}</p>
                        <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% complete</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setUploadStatus("idle")}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                ) : (
                  <>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="file-upload">Upload Accident Data File</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="file-upload" 
                          type="file" 
                          className="flex-1"
                          onChange={handleFileChange}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Supported formats: {SUPPORTED_FORMATS.map(f => f.extension).join(', ')}
                      </p>
                    </div>
                    
                    {selectedFile && (
                      <div className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{selectedFile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Unknown type'}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-4 mt-6">
                      <h3 className="font-medium text-sm">Data Structure Options</h3>
                      
                      <RadioGroup
                        value={structureType}
                        onValueChange={setStructureType}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="default" id="default" />
                          <Label htmlFor="default">Default Structure</Label>
                          <Badge variant="outline" className="ml-2">Recommended</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="custom" id="custom" />
                          <Label htmlFor="custom">Custom Field Mapping</Label>
                        </div>
                      </RadioGroup>
                      
                      {structureType === "custom" && (
                        <div className="mt-4">
                          <Label htmlFor="custom-mapping">Custom Field Mapping (JSON)</Label>
                          <Textarea
                            id="custom-mapping"
                            placeholder='{"timestamp": "accident_date", "latitude": "lat", "longitude": "lng"}'
                            className="h-24 mt-1 font-mono text-sm"
                            value={customMapping}
                            onChange={(e) => setCustomMapping(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Map your data fields to our system fields using JSON format
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="api" className="space-y-4">
                {uploadStatus === "uploading" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Connecting to API</p>
                        <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% complete</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setUploadStatus("idle")}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="api-endpoint">API Endpoint URL</Label>
                        <Input 
                          id="api-endpoint" 
                          type="url" 
                          placeholder="https://api.example.com/accidents" 
                          value={apiEndpoint}
                          onChange={(e) => setApiEndpoint(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="api-key">API Key (Optional)</Label>
                        <Input 
                          id="api-key" 
                          type="password"
                          placeholder="Enter API key" 
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="api-type">API Type</Label>
                        <RadioGroup defaultValue="rest" className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rest" id="rest" />
                            <Label htmlFor="rest">REST API</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="graphql" id="graphql" />
                            <Label htmlFor="graphql">GraphQL</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      <Alert>
                        <Database className="h-4 w-4" />
                        <AlertTitle>Connection Information</AlertTitle>
                        <AlertDescription>
                          The system will periodically connect to the API to fetch new accident data. Make sure your API endpoint is accessible and provides data in JSON format.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </>
                )}
              </TabsContent>
            </div>
          </Tabs>
        )}
      </CardContent>
      
      {uploadStatus === "idle" && (
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={resetUpload}>Cancel</Button>
          <Button onClick={handleUpload}>
            {activeTab === "file" ? (
              <>
                <Upload className="h-4 w-4 mr-2" /> Upload Data
              </>
            ) : (
              <>
                <Link className="h-4 w-4 mr-2" /> Connect API
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
