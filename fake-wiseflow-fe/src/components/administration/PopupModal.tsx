import "../../stylesheets/components/Modal.css";
import "../../stylesheets/components/UserModal.css";


interface PopupProps {
    onClose: () => void;
    isOpen: boolean;
    header: string;
    children: React.ReactNode;
}

export default function PopupModal({ onClose, isOpen, header, children }: PopupProps) {
    
    function handleClose() {
        onClose();
    }
    
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{header}</h2>
                    <button className="modal-close" onClick={handleClose}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
}
