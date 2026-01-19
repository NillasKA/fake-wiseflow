import { useEffect, useRef } from 'react';
import '../stylesheets/components/FilePreviewModal.css';

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string | null;
    fileName: string;
    fileType: string;
}

export default function FilePreviewModal({ isOpen, onClose, fileUrl, fileName, fileType }: FilePreviewModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !fileUrl) return null;

    const isImage = fileType.startsWith('image/');
    const isPDF = fileType === 'application/pdf';
    const isText = fileType === 'text/plain';

    return (
        <div className="file-preview-overlay" onClick={onClose}>
            <div className="file-preview-container" onClick={e => e.stopPropagation()} ref={modalRef}>
                <div className="file-preview-header">
                    <h3>{fileName}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <a 
                            href={fileUrl} 
                            download={fileName} 
                            className="btn-download-top" 
                            title="Download fil"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                            Download
                        </a>
                        <button className="btn-close" onClick={onClose}>&times;</button>
                    </div>
                </div>
                <div className="file-preview-content">
                    {isImage && (
                        <img src={fileUrl} alt={fileName} />
                    )}
                    {(isPDF || isText) && (
                        <iframe src={fileUrl} title={fileName} width="100%" height="600px" />
                    )}
                    {!isImage && !isPDF && !isText && (
                        <div className="preview-fallback">
                            <p>Visning ikke tilgængelig for denne filtype.</p>
                            <a href={fileUrl} download={fileName} className="btn-download">Download fil</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
