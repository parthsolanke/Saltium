import { useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import FileUploadList from './FileUploadList';

export default function FileUploadCard({ files, warning, isUploading, onFilesAdded, onFileRemove, onUpload }) {
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFilesAdded(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      onFilesAdded(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Upload Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary"
          onClick={openFileDialog}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to select files</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          multiple
        />
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Selected files:</h3>
            <FileUploadList files={files} onRemove={onFileRemove} />
          </div>
        )}
        {warning && (
          <div className="mt-4 text-center text-red-500 text-sm">
            {warning}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={onUpload} className="w-full" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </CardFooter>
    </Card>
  );
}

FileUploadCard.propTypes = {
  files: PropTypes.array.isRequired,
  warning: PropTypes.string.isRequired,
  isUploading: PropTypes.bool.isRequired,
  onFilesAdded: PropTypes.func.isRequired,
  onFileRemove: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired
};
