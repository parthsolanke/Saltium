import PropTypes from 'prop-types';
import { CheckCircle2, File, XCircle } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FileDownloadList({ files }) {
  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      {files.map((file, index) => {
        return (
          <div key={index} className="flex items-center justify-between py-2">
            <File className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500 flex-grow">{file.name}</span>
            {file.status === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        );
      })}
    </ScrollArea>
  );
}

FileDownloadList.propTypes = {
  files: PropTypes.array.isRequired
};
