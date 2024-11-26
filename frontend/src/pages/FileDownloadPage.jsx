import { useState, useEffect } from "react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileDownloadCard from '@/components/DownloadForm';

export default function DownloadPage() {
  const [downloadStatus, setDownloadStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const mockFiles = [
        { name: 'document1.pdf', size: '1.2 MB', status: 'pending' },
        { name: 'image1.jpg', size: '3.5 MB', status: 'pending' },
        { name: 'spreadsheet.xlsx', size: '0.8 MB', status: 'pending' },
        { name: 'presentation.pptx', size: '2.1 MB', status: 'pending' },
        { name: 'document2.pdf', size: '1.5 MB', status: 'pending' },
      ];
      setFiles(mockFiles);
    };

    fetchFiles();
  }, []);

  const simulateDownload = () => {
    setDownloadStatus('downloading');
    setProgress(0);
    setFiles(files.map(file => ({ ...file, status: 'pending' })));
  };

  useEffect(() => {
    if (downloadStatus === 'downloading') {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            const success = Math.random() > 0.2;
            setDownloadStatus(success ? 'completed' : 'failed');
            setFiles(files.map(file => ({
              ...file,
              status: success ? 'success' : 'failed'
            })));
            return 100;
          }
          const completedFiles = Math.floor((prevProgress / 100) * files.length);
          setFiles(files.map((file, index) => ({
            ...file,
            status: index < completedFiles ? 'success' : 'pending'
          })));
          return prevProgress + 5;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [downloadStatus, files]);

  const totalSize = files.reduce((acc, file) => acc + parseFloat(file.size), 0).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <FileDownloadCard 
        files={files}
        downloadStatus={downloadStatus}
        progress={progress}
        totalSize={totalSize}
        onDownload={simulateDownload}
      />
      <Footer />
    </div>
  );
}
