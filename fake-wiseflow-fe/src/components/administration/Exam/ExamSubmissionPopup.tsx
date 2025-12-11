import { useState, useEffect } from "react";
import { useStudents } from "../../../hooks/useStudents";
import { useSubmissions } from "../../../hooks/useSubmissions";
import { useAuth } from "../../../hooks/useAuth";
import { useExams } from "../../../hooks/useExams.ts";
import { useExaminators } from "../../../hooks/useExaminators.ts";
import "../../../stylesheets/components/Modal.css";
import "../../../stylesheets/components/ExamSubmissionPopup.css";

// @ts-ignore
export default function ExamSubmissionPopup({ examId, onClose }) {
    const { users, loading: studentsLoading, getAllByInstitutionId } = useStudents();
    const { submissions, loading: submissionsLoading, getByExamId, createBulk } = useSubmissions();
    const { getById } = useExams();
    const { examinators, loading: examinatorsLoading, getByInstitutionId: getExaminatorsByInstitutionId } = useExaminators();
    const { user } = useAuth();

    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [selectedExaminatorId, setSelectedExaminatorId] = useState<string>("");
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const exam = await getById(examId);

                await getAllByInstitutionId(exam.institutionId);
                await getByExamId(examId);
                await getExaminatorsByInstitutionId(exam.institutionId);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [examId, user?.institutionId]);

    // Filter out users who already have a submission
    const existingUserIds = submissions.map(sub => sub.userId);
    const availableStudents = users.filter(user => !existingUserIds.includes(user.id));

    function toggleStudentSelection(userId: string) {
        setSelectedStudentIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (selectedStudentIds.length === 0) {
                setError("Vælg mindst én studerende");
                setLoading(false);
                return;
            }

            if (!selectedExaminatorId) {
                setError("Vælg en eksaminator");
                setLoading(false);
                return;
            }

            const newSubmissions = selectedStudentIds.map(userId => ({
                userId,
                examId,
                examinatorId: selectedExaminatorId
            }));

            await createBulk(examId, newSubmissions);
            setShowSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Kunne ikke oprette afleveringer");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {showSuccess ? (
                <div className="modal-body">
                    <div className="success-container">
                        <p className="success-title">✓ Afleveringer oprettet succesfuldt!</p>
                        <p className="success-message">
                            Luk denne popup for at se de nye afleveringer!
                        </p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <div className="modal-error">{error}</div>}

                        <div className="submission-section">
                            <h3 className="section-title">Nuværende afleveringer</h3>
                            {submissionsLoading ? (
                                <p className="loading-text">Henter afleveringer...</p>
                            ) : submissions.length === 0 ? (
                                <p className="info-text">Ingen afleveringer endnu</p>
                            ) : (
                                <ul className="submissions-list">
                                    {submissions.map(submission => {
                                        const student = users.find(u => u.id === submission.userId);
                                        const examinator = examinators.find(e => e.id === submission.examinatorId);

                                        return (
                                            <li key={submission.id} className="submission-item">
                                                <strong>{student ? `${student.userName}` : 'Ukendt studerende'}</strong>
                                                <span className="examinator-info">
                                                    Eksaminator: {examinator ? examinator.userName : 'Ikke tildelt'}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        <div className="submission-section">
                            <h3 className="section-title">Vælg eksaminator *</h3>
                            <div className="form-group">
                                <select
                                    id="examinator"
                                    value={selectedExaminatorId}
                                    onChange={(e) => setSelectedExaminatorId(e.target.value)}
                                    required
                                    disabled={loading || examinatorsLoading}
                                    className="examinator-select"
                                >
                                    <option value="">-- Vælg eksaminator --</option>
                                    {examinators.map(examinator => (
                                        <option key={examinator.id} value={examinator.id}>
                                            {examinator.userName} ({examinator.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="submission-section">
                            <h3 className="section-title">Tilføj nye studerende til denne eksamen</h3>
                            {studentsLoading ? (
                                <p className="loading-text">Henter studerende...</p>
                            ) : availableStudents.length === 0 ? (
                                <p className="info-text">Alle studerende er allerede tilføjet</p>
                            ) : (
                                <div className="students-selection">
                                    {availableStudents.map(student => (
                                        <div key={student.id} className="student-checkbox">
                                            <input
                                                type="checkbox"
                                                id={`student-${student.id}`}
                                                checked={selectedStudentIds.includes(student.id)}
                                                onChange={() => toggleStudentSelection(student.id)}
                                                disabled={loading}
                                            />
                                            <label htmlFor={`student-${student.id}`}>
                                                {`${student.userName}`}
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
                            Annuller
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={loading || selectedStudentIds.length === 0 || !selectedExaminatorId}
                        >
                            {loading ? "Opretter..." : "Opret afleveringer"}
                        </button>
                    </div>
                </form>
            )}
        </>
    );
}