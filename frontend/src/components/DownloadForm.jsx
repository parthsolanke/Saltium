import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, RefreshCw, CheckCircle2, XCircle, File } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/**
 * @typedef {Object} FileDownloadCardProps
 * @property {Array<{filename: string, id: string}>} files
 * @property {'idle' | 'downloading' | 'completed' | 'failed'} downloadStatus
 * @property {string} warning
 * @property {() => void} onDownload
 */

export default function FileDownloadCard({ 
  files = [], 
  downloadStatus = 'idle',
  warning = '',
  onDownload = () => {} 
}) {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md mx-auto bg-stone-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Download Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {files.length === 0 ? (
            <div className={`text-sm text-center ${warning ? 'text-red-500' : 'text-gray-500'}`}>
              {warning || "Loading files..."}
            </div>
          ) : (
            files.map((file) => (
              <div key={file.id} className="flex items-center justify-between py-2">
                <div className="flex items-center flex-grow">
                  <File className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500 flex-grow">{file.filename}</span>
                </div>
              </div>
            ))
          )}
        </ScrollArea>

        {files.length === 0 && warning && (
          <Button 
            className="w-full" 
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Upload
          </Button>
        )}

        {downloadStatus === 'idle' && files.length > 0 && (
          <Button onClick={onDownload} className="w-full">
            <FileDown className="mr-2 h-4 w-4" />
            Download Files
          </Button>
        )}

        {downloadStatus === 'downloading' && (
          <Button disabled className="w-full bg-gray-400 text-white cursor-not-allowed">
            Downloading...
          </Button>
        )}

        {downloadStatus === 'completed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-sm font-medium text-green-600">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Download Complete
            </div>
            <Button 
              className="w-full" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Upload
            </Button>
          </div>
        )}

        {downloadStatus === 'failed' && (
          <div className="space-y-2">
            <div className="flex items-center justify-center text-sm font-medium text-red-500">
              <XCircle className="mr-2 h-4 w-4" />
              {warning || "Download Failed"}
            </div>
            <Button onClick={onDownload} variant="outline" className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Download
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

FileDownloadCard.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      filename: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  downloadStatus: PropTypes.oneOf(['idle', 'downloading', 'completed', 'failed']).isRequired,
  warning: PropTypes.string,
  onDownload: PropTypes.func.isRequired,
};
