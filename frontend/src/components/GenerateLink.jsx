import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, RefreshCw, Check, X } from 'lucide-react';

export default function GenerateLinkCard() {
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    generateLink();
    // Simulating file uploads
    setUploadedFiles([
      { name: 'document.pdf', status: 'success' },
      { name: 'image.jpg', status: 'success' },
      { name: 'spreadsheet.xlsx', status: 'failed' },
      { name: 'presentation.pptx', status: 'success' },
      { name: 'video.mp4', status: 'failed' },
      { name: 'archive.zip', status: 'success' },
    ]);
  }, []);

  const generateLink = () => {
    const newLink = `https://example.com/share/${Math.random().toString(36).substr(2, 9)}`;
    setLink(newLink);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm">{file.name}</span>
              {file.status === 'success' ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-red-500" />
              )}
            </div>
          ))}
        </ScrollArea>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input 
            value={link}
            readOnly
            className="flex-grow"
            aria-label="Generated link"
          />
          <Button 
            onClick={copyToClipboard}
            variant="outline"
            size="icon"
            aria-label="Copy link"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={generateLink} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" /> Generate New Link
        </Button>
      </CardFooter>
    </Card>
  );
}
