import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileDown, RefreshCw, CheckCircle2, XCircle, File } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import PropTypes from 'prop-types';

/**
 * @typedef {Object} FileDownloadCardProps
 * @property {Array<{name: string, size: string, status: 'pending' | 'success' | 'failed'}>} files
 * @property {'idle' | 'downloading' | 'completed' | 'failed'} downloadStatus
 * @property {number} progress
 * @property {number} totalSize
 * @property {() => void} onDownload
 */

export default function FileDownloadCard({ 
  files = [], 
  downloadStatus = 'idle', 
  progress = 0, 
  totalSize = 0, 
  onDownload = () => {} 
}) {
  return (
    <Card className="w-full max-w-md mx-auto bg-slate-50">
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
          <Button onClick={onDownload} className="w-full">
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
      name: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['pending', 'success', 'failed']).isRequired,
    })
  ).isRequired,
  downloadStatus: PropTypes.oneOf(['idle', 'downloading', 'completed', 'failed']).isRequired,
  progress: PropTypes.number.isRequired,
  totalSize: PropTypes.number.isRequired,
  onDownload: PropTypes.func.isRequired,
};
