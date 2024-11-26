import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUploadCard from '@/components/UploadForm';
import { useFileUpload } from '@/hooks/useFileUpload';

export default function UploadPage() {
  const navigate = useNavigate();
  const {
    files,
    warning,
    isUploading,
    addFiles,
    removeFile,
    uploadFiles,
    setWarning,
    setIsUploading,
    setFiles
  } = useFileUpload();

  const handleFilesAdded = (newFiles) => {
    addFiles(Array.from(newFiles));
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
      const result = await uploadFiles();
      if (result.fileDataArray) {
        setFiles([]);
        navigate('/generate-link', { state: { fileDataArray: result.fileDataArray } });
      }
    } catch (error) {
      if (error.response?.data.message === "Invalid or expired token") {
        localStorage.removeItem('token');
        setWarning('Your session has expired. Please log in again.');
        navigate('/login');
      } else {
        setWarning('An error occurred while uploading files. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <FileUploadCard
        files={files}
        warning={warning}
        isUploading={isUploading}
        onFilesAdded={handleFilesAdded}
        onFileRemove={removeFile}
        onUpload={handleUpload}
      />
      <Footer />
    </div>
  );
}
