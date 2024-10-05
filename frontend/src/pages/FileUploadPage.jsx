import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUploadCard from '@/components/UploadForm';

export default function UploadPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Header />
      <FileUploadCard />
      <Footer />
    </div>
  );
}
