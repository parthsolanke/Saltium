import PropTypes from 'prop-types';
import { CheckCircle2, File, XCircle } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FileDownloadList({ files }) {
  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      {files.length === 0 ? (
        <div className="text-red-500 text-sm text-center">
          No files available for download.
        </div>
      ) : (
        files.map((file) => {
          return (
            <div key={file._id} className="flex items-center justify-between py-2">
              <File className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500 flex-grow">{file.filename}</span>
              {file.encrypted ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          );
        })
      )}
    </ScrollArea>
  );
}

FileDownloadList.propTypes = {
  files: PropTypes.array.isRequired
};
