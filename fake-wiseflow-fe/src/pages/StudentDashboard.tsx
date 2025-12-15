import { useEffect, useState, useRef } from 'react';
import { useExams } from '../hooks/useExams';
import { useAuth } from '../hooks/useAuth';
import { useSubmissions } from '../hooks/useSubmissions';
import type { Exam } from '../models/Exam';
import type { Submission } from '../models/Submission';
import '../stylesheets/pages/StudentDashboard.css';
import FilePreviewModal from '../components/FilePreviewModal';

export default function StudentDashboard() {
    const { getByUserId, create } = useSubmissions();
    const { getBySubmissionId } = useExams();
    const { user } = useAuth();

    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [submissionStatus, setSubmissionStatus] = useState<number>(0); // 0: None, 1: Uploaded, 2: Submitted
    const [loading, setLoading] = useState(true);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setLoading(true);
            getByUserId(user.id)
                .then(subs => {
                    setSubmissions(subs);
                    const examPromises = subs.map((sub: Submission) => getBySubmissionId(sub.id));
                    return Promise.all(examPromises);
                })
                .then(fetchedExams => {
                    setExams(fetchedExams.filter(exam => exam !== null) as Exam[]);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch submissions or exams", error);
                    setLoading(false);
                });
        }
    }, [user]);

    useEffect(() => {
        if (submissions.length > 0 && !selectedSubmission) {
            setSelectedSubmission(submissions[0]);
        }
    }, [submissions, selectedSubmission]);

    // Mock derived status for list
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getExamStatus = (_exam: Exam) => {
        return "Ikke afleveret";
    };

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setUploadedFile(file);
            setSubmissionStatus(1);
        }
    };

    const handleSubmit = async () => {
        if (!selectedSubmission || !selectedSubmission.id || !uploadedFile || !user) return;

        try {
            await create(selectedSubmission.id, uploadedFile);
            setSubmissionStatus(2);
            alert("Afleveret succesfuldt!");
        } catch (error) {
            console.error("Failed to submit", error);
            alert("Fejl ved aflevering.");
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('da-DK', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePreview = () => {
        if (uploadedFile) {
            const url = URL.createObjectURL(uploadedFile);
            setPreviewUrl(url);
            setIsPreviewOpen(true);
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    if (loading) return <div className="p-8">Loading exams...</div>;

    return (
        <div className="student-dashboard">
            {/* Sidebar - Exam List */}
            <div className="exam-list-container">
                <div className="exam-list-header">
                    <span className="header-col">Eksamen</span>
                    <span className="header-col text-center">Dato</span>
                    <span className="header-col">Status</span>
                </div>
                <div className="exam-list-body">
                    {exams.map(exam => {
                        const submission = submissions.find(s => s.examId === exam.id);
                        return (
                            <div
                                key={exam.id}
                                className={`exam-list-item ${selectedSubmission?.examId === exam.id ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedSubmission(submission!);
                                    setUploadedFile(null);
                                    setSubmissionStatus(0);
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                            >
                                <span>{exam.title}</span>
                                <span className="text-center">{new Date(exam.date).toLocaleDateString('da-DK')}</span>
                                <span className="text-right">{getExamStatus(exam)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Content - Detail */}
            {selectedSubmission && (
                <div className="exam-detail-container">
                    <div className="exam-detail-header">
                        <h3>{exams.find(e => e.id === selectedSubmission.examId)?.title}</h3>
                        <span>Aflevering senest: {formatDate(exams.find(e => e.id === selectedSubmission.examId)!.date)}</span>
                    </div>

                    <div className="exam-detail-content">
                        <div className="detail-left">
                            <h2 className="exam-title-display">Beskrivelse</h2>
                            <p className="exam-description">
                                {exams.find(e => e.id === selectedSubmission.examId)?.description}
                            </p>

                            <div className="upload-section">
                                <div className="upload-controls">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="display-none"
                                        onChange={handleFileChange}
                                    />
                                    <button className="btn-upload-trigger" onClick={handleFileUpload}>
                                        Upload besvarelse
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                    </button>

                                    {uploadedFile && (
                                        <div className="file-display">
                                            <span className="file-name">{uploadedFile.name}</span>
                                            <div className="file-actions">
                                                <svg
                                                    onClick={handlePreview}
                                                    className="action-icon action-preview"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                >
                                                    <title>Forhåndsvisning</title>
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                <button
                                                    onClick={() => {
                                                        setUploadedFile(null);
                                                        setSubmissionStatus(0);
                                                        if (fileInputRef.current) fileInputRef.current.value = "";
                                                    }}
                                                    className="action-icon action-remove"
                                                    title="Fjern fil"
                                                >
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="progress-container">
                                    <div className="progress-bar">
                                        <div
                                            className={`progress-fill ${submissionStatus === 0 ? 'progress-fill-none' : submissionStatus === 1 ? 'progress-fill-uploaded' : 'progress-fill-submitted'}`}
                                        ></div>
                                    </div>
                                    <div className="progress-labels">
                                        <span>Ikke afleveret</span>
                                        <span>Besvarelse uploadet</span>
                                        <span>Afleveret</span>
                                    </div>
                                </div>

                                <button
                                    className={`btn-submit-final ${submissionStatus === 2 ? 'submit-disabled' : ''}`}
                                    onClick={handleSubmit}
                                    disabled={submissionStatus !== 1}
                                >
                                    {submissionStatus === 2 ? 'Afleveret' : 'Aflever'}
                                </button>
                            </div>
                        </div>

                        <div className="detail-right">
                            <h4 className="spec-title">Specifikationer</h4>
                            <p className="spec-info">Ansvarlig: Allan Helboe</p>
                            {/* <p className="spec-info">Type: {selectedExam.type}</p> */}


                            <FilePreviewModal
                                isOpen={isPreviewOpen}
                                onClose={() => setIsPreviewOpen(false)}
                                fileUrl={previewUrl}
                                fileName={uploadedFile?.name || "Fil"}
                                fileType={uploadedFile?.type || ""}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
