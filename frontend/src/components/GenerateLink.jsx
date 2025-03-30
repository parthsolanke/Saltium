import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Link, Check, Clock, Share2, AlertTriangle, QrCode, Download, X } from 'lucide-react';
import FileDownloadList from './FileDownloadList';

export default function GenerateLinkCard({
    link,
    copied,
    uploadedFiles,
    loading,
    warning,
    showGenerateButton,
    onGenerateLink,
    onCopyLink
}) {
    const [showQR, setShowQR] = useState(false);
    const qrRef = useRef(null);

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'download-qr.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card className="w-full max-w-md mx-auto relative bg-stone-50">
            <CardHeader>
                <FileDownloadList files={uploadedFiles} />
            </CardHeader>
            <CardContent className="space-y-4">
                {warning && (
                    <div className="text-red-500 text-sm text-center">
                        {warning}
                    </div>
                )}
                {!showGenerateButton && (
                    <>
                        <div className="flex space-x-2">  
                            <input
                                value={link}
                                readOnly
                                className="flex-grow p-2 border rounded-md"
                                aria-label="Generated link"
                                title="Share this link for file sharing"
                            />
                            <Button 
                                onClick={onCopyLink}
                                variant="outline"
                                size="icon"
                                aria-label="Copy link"
                                title="Click to copy the link"
                            >
                                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                            <Button
                                onClick={() => setShowQR(!showQR)}
                                variant="outline"
                                size="icon"
                                aria-label="Toggle QR Code"
                                title="Show/Hide QR Code"
                            >
                                <QrCode className="h-4 w-4" />
                            </Button>
                        </div>

                        {showQR && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-stone-50 p-6 rounded-lg shadow-lg border z-10">
                                <div className="space-y-4">
                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => setShowQR(false)}
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div ref={qrRef} className="flex justify-center">
                                        <QRCodeCanvas
                                            value={link}
                                            size={200}
                                            level="H"
                                            imageSettings={{
                                                src: "/salt.svg",
                                                x: undefined,
                                                y: undefined,
                                                height: 70,
                                                width: 70,
                                            }}
                                        />
                                    </div>
                                    <Button 
                                        onClick={downloadQR}
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Save QR Code
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col space-y-2 text-sm text-emerald-600">
                            <div className="flex items-center">
                                <Share2 className="h-4 w-4 mr-2" />
                                <span>Share this link with others to download the files</span>
                            </div>
                            <div className="flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                <span>This is a one-time download link</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>Link expires in 30 minutes</span>
                            </div>
                        </div>
                    </>
                )}
                {showGenerateButton && (
                    <Button 
                        onClick={onGenerateLink} 
                        className="w-full bg-black hover:bg-black/90" 
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : <><Link className="mr-2 h-4 w-4" />Generate Download Link</>}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

GenerateLinkCard.propTypes = {
    link: PropTypes.string.isRequired,
    copied: PropTypes.bool.isRequired,
    uploadedFiles: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    warning: PropTypes.string.isRequired,
    showGenerateButton: PropTypes.bool.isRequired,
    onGenerateLink: PropTypes.func.isRequired,
    onCopyLink: PropTypes.func.isRequired
};
