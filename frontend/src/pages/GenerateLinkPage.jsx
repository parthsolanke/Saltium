import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GenerateLinkCard from '@/components/GenerateLink';
import { handleApiError } from '@/utils/errorUtils';

const API_URL = import.meta.env.VITE_API_URL;

export default function GenerateLinkPage() {
    const [link, setLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showGenerateButton, setShowGenerateButton] = useState(true);
    const [warning, setWarning] = useState('');
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.fileDataArray) {
            setUploadedFiles(location.state.fileDataArray);
        }
    }, [location.state?.fileDataArray]);

    const generateDownloadUrl = (token) => {
        const origin = window.location.origin;
        return `${origin}/download?token=${token}`;
    };

    const fetchGeneratedLink = async () => {
        setLoading(true);
        try {
            const fileIds = uploadedFiles.map(file => file.id);
            const response = await axios.post(
                `${API_URL}/private/files/generate-token`,
                { fileIds },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            
            const downloadUrl = generateDownloadUrl(response.data.token);
            setLink(downloadUrl);
            setShowGenerateButton(false);
        } catch (error) {
            const errorInfo = handleApiError(error);
            if (errorInfo.shouldRedirect) {
                navigate(errorInfo.redirectTo);
            }
            setWarning(errorInfo.message);
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
                warning={warning}
                showGenerateButton={showGenerateButton}
                onGenerateLink={fetchGeneratedLink}
                onCopyLink={copyToClipboard}
            />
            <Footer />
        </div>
    );
}