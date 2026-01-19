import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Exam } from '../models/Exam';
import type { Submission } from '../models/Submission';
import '../stylesheets/pages/StudentDashboard.css';
import FilePreviewModal from '../components/FilePreviewModal';
import { useExams } from "../hooks/useExams.ts";
import type {Evaluation} from "../models/Evaluation.ts";

export default function ExaminatorDashboard() {
    const { user } = useAuth();
    // Reusing useSubmissions but we need custom logic to fetch "exams for examinator" and "submissions for exam".
    // We already added endpoints: GET /api/Examinator/{id}/exams and /api/Examinator/exams/{examId}/submissions
    // We need to fetch this data. We can add this to hooks or just fetch here for now since it's dashboard specific.
    // Let's use existing hooks if possible or extend them.
    // We added useExaminators hook previously, let's check it.
    // Wait, we added endpoints to ExaminatorController, so we should add methods to useExaminators hook.

    const [exams, setExams] = useState<Exam[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [loading, setLoading] = useState(true);

    const [grade, setGrade] = useState<string>("");
    const [feedback, setFeedback] = useState<string>("");
    const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Fetch exams for examinator
    useEffect(() => {
        if (user) {
            console.log("ExaminatorDashboard: Fetching exams for user", user);
            setLoading(true);
            // Fetch exams assigned to this examinator
            fetch(`https://localhost:7130/api/Examinator/${user.id}/exams`, { credentials: "include" })
                .then(res => {
                    if (!res.ok) throw new Error("Failed request");
                    return res.json();
                })
                .then(data => {
                    console.log("ExaminatorDashboard: Fetched exams", data);
                    setExams(data);
                })
                .catch(err => {
                    console.error("Failed to fetch exams", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user]);

    useEffect(() => {
        if (selectedExam) {
            fetch(`https://localhost:7130/api/Examinator/exams/${selectedExam.id}/submissions`, { credentials: "include" })
                .then(res => res.json())
                .then(data => {
                    setSubmissions(data);
                    setSelectedSubmission(null);
                })
                .catch(err => console.error("Failed to fetch submissions", err));
        }
    }, [selectedExam]);

    useEffect(() => {
        setGrade("");
        setFeedback("");
    }, [selectedSubmission]);
    
    const [viewMode, setViewMode] = useState<'list' | 'grading'>('list');

    const handleExamClick = (exam: Exam) => {
        setSelectedExam(exam);
        setSelectedSubmission(null);
        setViewMode('list');
    };

    const handleSubmissionClick = (submission: Submission) => {
        setSelectedSubmission(submission);
        setViewMode('grading');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedSubmission(null);
    };

    const handlePreview = () => {
        if (selectedSubmission) {
            const url = `https://localhost:7130/api/Submissions/${selectedSubmission.id}/file-as-examinator`;
            setPreviewUrl(url);
            setIsPreviewOpen(true);
        }
    };

    const handleGradeSubmit = async () => {
        if (!selectedSubmission || !grade || !feedback) {
            alert("Udfyld venligst både karakter og kommentar.");
            return;
        }

        setIsSubmittingGrade(true);
        try {
            const evaluation: Evaluation = {
                id: crypto.randomUUID(),
                grade: grade,
                feedback: feedback,
                evaluationDate: new Date()
            };

            const res = await fetch(`https://localhost:7130/api/Submissions/${selectedSubmission.id}/evaluation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(evaluation)
            });

            if (!res.ok) throw new Error("Failed to submit grade");

            alert("Bedømmelse gemt!");
            
            setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? { ...s, status: "2", evaluationId: evaluation.id } : s)); // 2 = Graded
            
            handleBackToList();

        } catch (error) {
            console.error("Error submitting grade:", error);
            alert("Der skete en fejl under indsendelsen.");
        } finally {
            setIsSubmittingGrade(false);
        }
    };

    const grades = ["-3", "00", "02", "04", "07", "10", "12"];

    if (loading) return <div className="p-8">Henter eksamener...</div>;

    return (
        <div className="student-dashboard">
            {/* Sidebar - Exam List */}
            <div className="exam-list-container">
                <div className="exam-list-header">
                    <span className="header-col">Eksamener</span>
                    {/* <span className="header-col text-center">Dato</span> */}
                </div>
                <div className="exam-list-body">
                    {exams.map(exam => (
                        <div
                            key={exam.id}
                            className={`exam-list-item ${selectedExam?.id === exam.id ? 'selected' : ''}`}
                            onClick={() => handleExamClick(exam)}
                        >
                            <span style={{fontWeight: 'bold'}}>{exam.title}</span>
                            <br/>
                            <span style={{fontSize: '0.8em', color: '#666'}}>{new Date(exam.date).toLocaleDateString('da-DK')}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="exam-detail-container">
                {selectedExam ? (
                    viewMode === 'list' ? (
                        <div className="exam-detail-content" style={{display: 'block'}}>
                            <div className="exam-detail-header" style={{marginBottom: '20px'}}>
                                <h3>{selectedExam.title} - Afleveringer</h3>
                                <span>{submissions.length} afleveringer</span>
                            </div>
                            
                            {submissions.length === 0 ? (
                                <p>Ingen afleveringer fundet.</p>
                            ) : (
                                <table className="module-table" style={{width: '100%'}}>
                                    <thead>
                                        <tr>
                                            <th>Student ID</th>
                                            <th>Status</th>
                                            <th>Dato</th>
                                            <th>Handling</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submissions.map(sub => (
                                            <tr key={sub.id}>
                                                <td>{sub.userId}</td>
                                                <td>
                                                    {sub.status.toString() === "2" ? 
                                                        <span className="status-badge status-success">Bedømt</span> : 
                                                        <span className="status-badge status-warning">Afventer</span>
                                                    }
                                                </td>
                                                <td>{new Date(sub.uploadDate!).toLocaleString('da-DK')}</td>
                                                                                                <td>
                                                                                                    {sub.status.toString() === "2" ? (
                                                                                                        <span style={{ color: 'green', fontSize: '1.5em', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                                                            ✓
                                                                                                        </span>
                                                                                                    ) : (
                                                                                                        <button
                                                                                                            className="primary-btn"
                                                                                                            onClick={() => handleSubmissionClick(sub)}
                                                                                                        >
                                                                                                            Bedøm
                                                                                                        </button>
                                                                                                    )}
                                                                                                </td>                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    ) : (
                        <div className="exam-detail-content">
                            <div className="detail-left" style={{width: '100%'}}>
                                <button className="btn-cancel" onClick={handleBackToList} style={{marginBottom: '15px'}}>
                                    ← Tilbage til liste
                                </button>
                                
                                <h2 className="exam-title-display">Bedømmelse af aflevering</h2>
                                <p className="exam-description">
                                    <strong>Opgave:</strong> {selectedExam.title}<br/>
                                    <strong>Studerende ID:</strong> {selectedSubmission?.userId}
                                </p>

                                <div className="upload-section">
                                    <div className="file-display" style={{marginBottom: '20px'}}>
                                        <span className="file-name">{selectedSubmission?.fileName || "Fil"}</span>
                                        <div className="file-actions">
                                            <button 
                                                className="primary-btn" 
                                                onClick={handlePreview}
                                                style={{display: 'flex', alignItems: 'center', gap: '5px'}}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                Se Besvarelse / Download
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grading-section" style={{background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee'}}>
                                        <h3 style={{marginTop: 0}}>Afgiv bedømmelse</h3>
                                        
                                        <div className="form-group" style={{marginBottom: '15px'}}>
                                            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Karakter (7-trinsskala)</label>
                                            <select 
                                                value={grade} 
                                                onChange={(e) => setGrade(e.target.value)}
                                                style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                                            >
                                                <option value="">Vælg karakter</option>
                                                {grades.map(g => (
                                                    <option key={g} value={g}>{g}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group" style={{marginBottom: '15px'}}>
                                            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Feedback / Kommentar</label>
                                            <textarea 
                                                value={feedback} 
                                                onChange={(e) => setFeedback(e.target.value)}
                                                rows={5}
                                                style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical'}}
                                                placeholder="Skriv din feedback her..."
                                            />
                                        </div>

                                        <button 
                                            className="btn-submit-final" 
                                            onClick={handleGradeSubmit}
                                            disabled={isSubmittingGrade}
                                        >
                                            {isSubmittingGrade ? "Gemmer..." : "Gem Bedømmelse"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="center-content" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#666'}}>
                        <p>Vælg en eksamen fra listen for at se afleveringer.</p>
                    </div>
                )}
            </div>

            <FilePreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                fileUrl={previewUrl}
                fileName={selectedSubmission?.fileName || "Fil"}
                fileType={selectedSubmission?.contentType || ""}
            />
        </div>
    );
}
