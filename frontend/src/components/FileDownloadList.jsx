import PropTypes from 'prop-types';
import { File } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FileDownloadList({ files }) {
  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      {files.length === 0 ? (
        <div className="text-red-500 text-sm text-center">
          No files available for download.
        </div>
      ) : (
        files.map((file) => (
          <div key={file.id} className="flex items-center py-2">
            <File className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500 flex-grow">{file.filename}</span>
          </div>
        ))
      )}
    </ScrollArea>
  );
}

FileDownloadList.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired
    })
  ).isRequired
};
