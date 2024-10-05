import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileDownloadCard from '@/components/DownloadForm';

export default function DownloadPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <FileDownloadCard />
      <Footer />
    </div>
  );
}
