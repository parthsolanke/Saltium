import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUploadCard from '@/components/UploadForm';
import { useFileUpload } from '@/hooks/useFileUpload';
import { handleApiError } from '@/utils/errorUtils';

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
    if (files.length + newFiles.length > 10) {
      setWarning('Cannot upload more than 10 files at once.');
      return;
    }
    addFiles(Array.from(newFiles));
  };

  const handleP2PShare = async () => {
    if (files.length === 0) {
      setWarning('Please select at least one file to share.');
      return;
    }
    setWarning('');
    
    // TODO: Implement actual P2P sharing logic
    setWarning('P2P sharing is not yet implemented');
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
      if (files.length > 10) {
        throw new Error('Cannot upload more than 10 files at once.');
      }
      const { fileDataArray } = await uploadFiles();
      setFiles([]);
      navigate('/generate-link', { state: { fileDataArray } });
    } catch (error) {
      setIsUploading(false); // Reset uploading state immediately on error
      const errorInfo = handleApiError(error);
      if (errorInfo.shouldRedirect) {
        navigate(errorInfo.redirectTo);
      }
      setWarning(errorInfo.message);
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
        onP2PShare={handleP2PShare}
      />
      <Footer />
    </div>
  );
}
