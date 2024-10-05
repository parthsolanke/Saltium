import { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import FileUploadList from './FileUploadList';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function FileUploadCard() {
  const [files, setFiles] = useState([]);
  const [warning, setWarning] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    setWarning('');
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      setWarning('');
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file.name !== fileToRemove.name));
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const uploadFiles = async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${API_URL}/private/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message === "Invalid or expired token") {
        localStorage.removeItem('token');
        setWarning('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        console.error('Error during file upload:', error);
        throw error;
      }
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setWarning('Please log in first.');
      navigate('/login');
      return;
    }

    if (files.length === 0) {
      setWarning('Please select at least one file to upload.');
      return;
    }

    setIsUploading(true);
    setWarning('');

    try {
      const result = await uploadFiles(files);
      console.log('Upload result:', result);
      if (result.fileDataArray) {
        setFiles([]);
        navigate('/generate-link', { state: { fileDataArray: result.fileDataArray } });
      }
    } catch {
      setWarning('An error occurred while uploading files. Please try again.');
    } finally {
      setIsUploading(false);
    }
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
            <FileUploadList files={files} onRemove={removeFile} />
          </div>
        )}
        {warning && (
          <div className="mt-4 text-center text-red-500 text-sm">
            {warning}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleUpload} className="w-full" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </Button>
      </CardFooter>
    </Card>
  );
}
