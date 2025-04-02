import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileDownloadCard from '@/components/DownloadForm';
import { handleApiError } from "@/utils/errorUtils";

const API_URL = import.meta.env.VITE_API_URL;

export default function DownloadPage() {
  const { shareId } = useParams();
  const [downloadStatus, setDownloadStatus] = useState('idle');
  const [warning, setWarning] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/public/files/list/${shareId}`);
        setFiles(response.data.files);
        setWarning('');
      } catch (error) {
        const { message } = handleApiError(error);
        setWarning(message);
        setFiles([]);
      }
    };

    if (shareId) {
      fetchFiles();
    }
  }, [shareId]);

  const handleDownload = async () => {
    try {
      setDownloadStatus('downloading');
      setWarning('');
      const response = await axios.get(`${API_URL}/public/files/download/${shareId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'files.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setDownloadStatus('completed');
    } catch (error) {
      const { message } = handleApiError(error);
      setWarning(message);
      setDownloadStatus('failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <FileDownloadCard 
        files={files}
        downloadStatus={downloadStatus}
        warning={warning}
        onDownload={handleDownload}
      />
      <Footer />
    </div>
  );
}
