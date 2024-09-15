import PropTypes from 'prop-types';
import { File, X } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export default function FileUploadList({ files, onRemove }) {
  return (
    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
      {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <File className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500 flex-grow">{file.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(file)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
          </div>
      ))}
    </ScrollArea>
  );
}

FileUploadList.propTypes = {
  files: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired
};
