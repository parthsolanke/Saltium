import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to access passed state
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Link, Check } from 'lucide-react';
import FileDownloadList from './FileDownloadList';

export default function GenerateLinkCard() {
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [showGenerateButton, setShowGenerateButton] = useState(true);
  
  const location = useLocation(); // Get location object

  // useEffect to update uploaded files from state passed via router
  useEffect(() => {
    if (location.state?.files) {
      setUploadedFiles(location.state.files); // Set uploaded files from passed state
    }
  }, [location.state?.files]); // Dependency on files from location state

  const fetchGeneratedLink = async () => {
    setLoading(true);
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => resolve({ data: `https://example.com/share/${Math.random().toString(36).substr(2, 9)}` }), 1000);
      });
      setLink(response.data);
      setShowGenerateButton(false);
    } catch (error) {
      console.error('Error generating link:', error);
    } finally {
      setLoading(false);
    }
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
        <FileDownloadList files={uploadedFiles} />
      </CardHeader>
      <CardContent className="space-y-4">
        {!showGenerateButton && (
          <div className="flex space-x-2">  
            <input
              value={link}
              readOnly
              className="flex-grow p-2 border rounded-md"
              aria-label="Generated link"
              title="Share this link for file sharing"
            />
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              size="icon"
              aria-label="Copy link"
              title="Click to copy the link"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
        {showGenerateButton && (
          <Button onClick={fetchGeneratedLink} className="w-full" disabled={loading}>
            {loading ? <span>Generating...</span> : <><Link className="mr-2 h-4 w-4" />Generate Link</>}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
