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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()} ref={modalRef}>
                <div className="modal-header">
                    <h3>{fileName}</h3>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-content">
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
