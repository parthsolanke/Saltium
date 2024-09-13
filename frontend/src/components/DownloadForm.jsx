import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileDown, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export default function FileDownloadCard() {
  const [downloadStatus, setDownloadStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  const simulateDownload = () => {
    setDownloadStatus("downloading");
    setProgress(0);
  };

  useEffect(() => {
    if (downloadStatus === "downloading") {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            // Simulate a 20% chance of failure
            const success = Math.random() > 0.2;
            setDownloadStatus(success ? "completed" : "failed");
            return 100;
          }
          return prevProgress + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [downloadStatus]);

  const getStatusDisplay = () => {
    switch (downloadStatus) {
      case "idle":
        return (
          <Button onClick={simulateDownload} className="w-full">
            <FileDown className="mr-2 h-4 w-4" />
            Download
          </Button>
        );
      case "downloading":
        return (
          <div className="w-full text-center text-sm font-medium text-muted-foreground">
            Downloading... {progress}%
          </div>
        );
      case "completed":
        return (
          <div className="w-full flex items-center justify-center text-sm font-medium text-green-600">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Download Complete
          </div>
        );
      case "failed":
        return (
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center justify-center text-sm font-medium text-red-600 mb-2">
              <XCircle className="mr-2 h-4 w-4" />
              Download Failed
            </div>
            <Button onClick={simulateDownload} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Download
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Download File</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">file_name.pdf</span>
          <span className="text-sm text-muted-foreground">2.5 MB</span>
        </div>
        <Progress 
          value={progress} 
          className="w-full" 
          aria-label={`Download progress: ${progress}%`}
        />
      </CardContent>
      <CardFooter>{getStatusDisplay()}</CardFooter>
    </Card>
  );
}
