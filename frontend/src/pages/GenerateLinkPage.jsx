import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GenerateLinkCard from '@/components/GenerateLink';

export default function GenerateLinkPage() {
    const [link, setLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showGenerateButton, setShowGenerateButton] = useState(true);
    
    const location = useLocation();

    useEffect(() => {
        if (location.state?.fileDataArray) {
            setUploadedFiles(location.state.fileDataArray);
        }
    }, [location.state?.fileDataArray]);

    const fetchGeneratedLink = async () => {
        setLoading(true);
        try {
            const response = await new Promise((resolve) => {
                setTimeout(() => resolve({ data: `https://example.com/share/${Math.random().toString(36).substr(2, 9)}` }), 1000);
            });
            setLink(response.data);
            setShowGenerateButton(false);
        } catch (error) {
            console.error('Error generating link:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <Header />
            <GenerateLinkCard
                link={link}
                copied={copied}
                uploadedFiles={uploadedFiles}
                loading={loading}
                showGenerateButton={showGenerateButton}
                onGenerateLink={fetchGeneratedLink}
                onCopyLink={copyToClipboard}
            />
            <Footer />
        </div>
    );
}