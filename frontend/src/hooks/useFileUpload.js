
import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [warning, setWarning] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = (newFiles) => {
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
    setWarning('');
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file.name !== fileToRemove.name));
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await axios.post(`${API_URL}/private/files/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    return response.data;
  };

  return {
    files,
    warning,
    isUploading,
    addFiles,
    removeFile,
    uploadFiles,
    setWarning,
    setIsUploading,
    setFiles
  };
};