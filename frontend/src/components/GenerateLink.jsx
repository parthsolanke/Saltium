import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Link, Check } from 'lucide-react';
import FileDownloadList from './FileDownloadList';

export default function GenerateLinkCard({
    link,
    copied,
    uploadedFiles,
    loading,
    showGenerateButton,
    onGenerateLink,
    onCopyLink
}) {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <FileDownloadList files={uploadedFiles} />
            </CardHeader>
            <CardContent className="space-y-4">
                {!showGenerateButton && (
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
                    </div>
                )}
                {showGenerateButton && (
                    <Button onClick={onGenerateLink} className="w-full" disabled={loading}>
                        {loading ? <span>Generating...</span> : <><Link className="mr-2 h-4 w-4" />Generate Link</>}
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
    showGenerateButton: PropTypes.bool.isRequired,
    onGenerateLink: PropTypes.func.isRequired,
    onCopyLink: PropTypes.func.isRequired
};
