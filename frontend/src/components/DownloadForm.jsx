import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileDown, RefreshCw, CheckCircle2, XCircle, File } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FileDownloadCard() {
  const [downloadStatus, setDownloadStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const mockFiles = [
        { name: 'document1.pdf', size: '1.2 MB', status: 'pending' },
        { name: 'image1.jpg', size: '3.5 MB', status: 'pending' },
        { name: 'spreadsheet.xlsx', size: '0.8 MB', status: 'pending' },
        { name: 'presentation.pptx', size: '2.1 MB', status: 'pending' },
        { name: 'document2.pdf', size: '1.5 MB', status: 'pending' },
      ];
      setFiles(mockFiles);
    };

    fetchFiles();
  }, []);

  const simulateDownload = () => {
    setDownloadStatus('downloading');
    setProgress(0);
    setFiles(files.map(file => ({ ...file, status: 'pending' })));
  };

  useEffect(() => {
    if (downloadStatus === 'downloading') {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            const success = Math.random() > 0.2;
            setDownloadStatus(success ? 'completed' : 'failed');
            setFiles(files.map(file => ({
              ...file,
              status: success ? 'success' : 'failed'
            })));
            return 100;
          }
          const completedFiles = Math.floor((prevProgress / 100) * files.length);
          setFiles(files.map((file, index) => ({
            ...file,
            status: index < completedFiles ? 'success' : 'pending'
          })));
          return prevProgress + 5;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [downloadStatus, files]);

  const totalSize = files.reduce((acc, file) => acc + parseFloat(file.size), 0).toFixed(1);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Download Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center flex-grow">
                  <File className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 flex-grow">{file.name}</span>
                </div>
                <span className="text-sm text-gray-400 mr-2">{file.size}</span>
              </div>
            ))}
        </ScrollArea>

        {downloadStatus !== 'idle' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">files.zip</span>
              <span className="text-gray-500">{totalSize} MB</span>
            </div>
            <Progress 
              value={progress} 
              className="w-full" 
              aria-label={`Download progress: ${progress}%`}
            />
          </div>
        )}

        {downloadStatus === 'idle' && (
          <Button onClick={simulateDownload} className="w-full bg-gray-900 hover:bg-gray-800 text-white">
            <FileDown className="mr-2 h-4 w-4" />
            Download Zip
          </Button>
        )}

        {downloadStatus === 'downloading' && (
          <Button disabled className="w-full bg-gray-400 text-white cursor-not-allowed">
            Downloading... {progress}%
          </Button>
        )}

        {downloadStatus === 'completed' && (
          <div className="flex items-center justify-center text-sm font-medium text-green-600">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Download Complete
          </div>
        )}

        {downloadStatus === 'failed' && (
          <div className="space-y-2">
            <div className="flex items-center justify-center text-sm font-medium text-red-600">
              <XCircle className="mr-2 h-4 w-4" />
              Download Failed
            </div>
            <Button onClick={simulateDownload} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Download
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
