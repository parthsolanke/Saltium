import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GenerateLinkCard from '@/components/GenerateLink';

export default function GenerateLinkPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Header />
        <GenerateLinkCard />
        <Footer />
        </div>
    );
}