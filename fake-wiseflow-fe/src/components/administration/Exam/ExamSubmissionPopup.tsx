import { useState, useEffect } from "react";
import { useStudents } from "../../../hooks/useStudents";
import { useSubmissions } from "../../../hooks/useSubmissions";
import { useAuth } from "../../../hooks/useAuth";
import { useExams } from "../../../hooks/useExams.ts";
import { useExaminators } from "../../../hooks/useExaminators";
import "../../../stylesheets/components/Modal.css";
import "../../../stylesheets/components/ExamSubmissionPopup.css";

interface ExamSubmissionPopupProps {
    examId: string;
    onClose: () => void;
}

export default function ExamSubmissionPopup({ examId, onClose }: ExamSubmissionPopupProps) {
    const { users, loading: studentsLoading, getAllByInstitutionId: getStudents } = useStudents();
    const { submissions, loading: submissionsLoading, getByExamId, createBulk, remove } = useSubmissions();
    const { examinators, loading: examinatorsLoading, getAllByInstitutionId: getExaminators } = useExaminators();
    const { getById, assignExaminators } = useExams();
    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<'students' | 'examinators'>('students');
    // selectedStudentIds tracks the currently selected students in the UI
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    // originalStudentIds tracks the state from the database to calculate diffs
    const [originalStudentIds, setOriginalStudentIds] = useState<string[]>([]);
    
    const [selectedExaminatorIds, setSelectedExaminatorIds] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const exam = await getById(examId);

                await getStudents(exam.institutionId);
                await getExaminators(exam.institutionId);
                const currentSubmissions = await getByExamId(examId);
                
                // Initialize student selection state based on current submissions
                const studentIds = currentSubmissions.map((s: any) => s.userId);
                setSelectedStudentIds(studentIds);
                setOriginalStudentIds(studentIds);
                
                if (exam.examinatorIds) {
                    setSelectedExaminatorIds(exam.examinatorIds);
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [examId, user?.institutionId]);

    // Students Logic
    function toggleStudentSelection(userId: string) {
        setSelectedStudentIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    }

    async function handleStudentSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Calculate Diffs
            const toAdd = selectedStudentIds.filter(id => !originalStudentIds.includes(id));
            const toRemove = originalStudentIds.filter(id => !selectedStudentIds.includes(id));

            if (toAdd.length === 0 && toRemove.length === 0) {
                 setShowSuccess(true); // Nothing to do, but show success to indicate "Saved" (no changes)
                 setLoading(false);
                 return;
            }

            // 1. Add new submissions
            if (toAdd.length > 0) {
                const newSubmissions = toAdd.map(userId => ({
                    userId,
                    examId
                }));
                await createBulk(examId, newSubmissions);
            }

            // 2. Remove deleted submissions
            if (toRemove.length > 0) {
                // We need submissionIds for the userIds to remove.
                // Submissions state should be fresh from loadData or last save?
                // Warning: 'submissions' from useSubmissions might be stale if we didn't refresh it right before?
                // loadData calls getByExamId, which updates 'submissions'.
                // So 'submissions' should contain the data matching 'originalStudentIds'.
                
                const submissionsToRemove = submissions.filter(s => toRemove.includes(s.userId));
                
                // Remove one by one (Promise.all)
                await Promise.all(submissionsToRemove.map(s => remove(s.id)));
            }

            // Refresh data to update state
            const updatedSubmissions = await getByExamId(examId);
            const updatedStudentIds = updatedSubmissions.map((s: any) => s.userId);
            setSelectedStudentIds(updatedStudentIds);
            setOriginalStudentIds(updatedStudentIds);
            
            setShowSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kunne ikke gemme ændringer");
            // If partial failure, we should probably reload data to reflect reality.
            await getByExamId(examId);
        } finally {
            setLoading(false);
        }
    }

    // Examinators Logic
    function toggleExaminatorSelection(examinatorId: string) {
        setSelectedExaminatorIds(prev =>
            prev.includes(examinatorId)
                ? prev.filter(id => id !== examinatorId)
                : [...prev, examinatorId]
        );
    }

    async function handleExaminatorSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await assignExaminators(examId, selectedExaminatorIds);
            setShowSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kunne ikke tildele examinatorer");
        } finally {
            setLoading(false);
        }
    }

    // Reset success message when switching tabs
    useEffect(() => {
        if (showSuccess) {
            setShowSuccess(false);
        }
    }, [activeTab]);


    return (
        <>
            <div className="tab-header" style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '15px' }}>
                <button 
                    type="button"
                    onClick={() => setActiveTab('students')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'students' ? '#f0f7fa' : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'students' ? '2px solid #5a8fb0' : 'none',
                        fontWeight: activeTab === 'students' ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                >
                    Studerende
                </button>
                <button 
                    type="button"
                    onClick={() => setActiveTab('examinators')}
                    style={{
                        padding: '10px 20px',
                        background: activeTab === 'examinators' ? '#f0f7fa' : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'examinators' ? '2px solid #5a8fb0' : 'none',
                        fontWeight: activeTab === 'examinators' ? 'bold' : 'normal',
                        cursor: 'pointer'
                    }}
                >
                    Examinatorer
                </button>
            </div>

            {showSuccess ? (
                <div className="modal-body">
                    <div className="success-container">
                        <p className="success-title">✓ Ændringer gemt succesfuldt!</p>
                        <button 
                            type="button" 
                            className="btn-submit" 
                            onClick={() => setShowSuccess(false)}
                            style={{ marginTop: '10px' }}
                        >
                            Fortsæt redigering
                        </button>
                    </div>
                </div>
            ) : (
                activeTab === 'students' ? (
                    <form onSubmit={handleStudentSubmit}>
                        <div className="modal-body">
                            {error && <div className="modal-error">{error}</div>}

                            <div className="submission-section">
                                <h3 className="section-title">Vælg Studerende</h3>
                                <p className="info-text" style={{marginBottom: '10px'}}>
                                    Vælg de studerende der skal deltage i denne eksamen.
                                </p>
                                {studentsLoading ? (
                                    <p className="loading-text">Henter studerende...</p>
                                ) : users.length === 0 ? (
                                    <p className="info-text">Ingen studerende fundet for denne institution.</p>
                                ) : (
                                    <div className="students-selection">
                                        {users.map(student => (
                                            <div key={student.id} className="student-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`student-${student.id}`}
                                                    checked={selectedStudentIds.includes(student.id)}
                                                    onChange={() => toggleStudentSelection(student.id)}
                                                    disabled={loading}
                                                />
                                                <label htmlFor={`student-${student.id}`}>
                                                    {`${student.userName}`} <span style={{color: '#888', fontSize: '0.9em'}}>({student.email})</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Luk
                            </button>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={loading}
                            >
                                {loading ? "Gemmer..." : "Gem ændringer"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleExaminatorSubmit}>
                        <div className="modal-body">
                            {error && <div className="modal-error">{error}</div>}

                            <div className="submission-section">
                                <h3 className="section-title">Vælg Examinatorer</h3>
                                <p className="info-text" style={{marginBottom: '10px'}}>
                                    Vælg de examinatorer der skal være tilknyttet denne eksamen.
                                </p>
                                {examinatorsLoading ? (
                                    <p className="loading-text">Henter examinatorer...</p>
                                ) : examinators.length === 0 ? (
                                    <p className="info-text">Ingen examinatorer fundet for denne institution.</p>
                                ) : (
                                    <div className="students-selection">
                                        {examinators.map(examinator => (
                                            <div key={examinator.id} className="student-checkbox">
                                                <input
                                                    type="checkbox"
                                                    id={`examinator-${examinator.id}`}
                                                    checked={selectedExaminatorIds.includes(examinator.id)}
                                                    onChange={() => toggleExaminatorSelection(examinator.id)}
                                                    disabled={loading}
                                                />
                                                <label htmlFor={`examinator-${examinator.id}`}>
                                                    {examinator.userName} <span style={{color: '#888', fontSize: '0.9em'}}>({examinator.email})</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Luk
                            </button>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={loading}
                            >
                                {loading ? "Gemmer..." : "Gem ændringer"}
                            </button>
                        </div>
                    </form>
                )
            )}
        </>
    );
}