import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubmissions } from '../hooks/useSubmissions';
import { useExams } from '../hooks/useExams';
import type { Submission } from '../models/Submission';
import type { Exam } from '../models/Exam';
import type { Evaluation } from '../models/Evaluation';
import '../stylesheets/pages/StudentDashboard.css';

export default function ResultsPage() {
    const { user } = useAuth();
    const { getByUserId } = useSubmissions();
    const { getById } = useExams();
    const [results, setResults] = useState<{
        submission: Submission;
        exam: Exam;
        evaluation: Evaluation | null;
    }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadResults() {
            if (!user) return;
            setLoading(true);
            try {
                const userSubmissions = await getByUserId(user.id);
                const gradedSubmissions = userSubmissions.filter((s: Submission) => s.status.toString() === "2");
                const resultsData = await Promise.all(gradedSubmissions.map(async (sub: Submission) => {
                    const exam = await getById(sub.examId);
                    let evaluation = null;
                    if (sub.evaluationId) {
                        try {
                             const res = await fetch(`https://localhost:7130/api/Submissions/evaluation/${sub.evaluationId}`, { credentials: "include" });
                             if (res.ok) {
                                 evaluation = await res.json();
                             }
                        } catch (e) {
                            console.error("Failed to fetch evaluation", e);
                        }
                    }
                    return { submission: sub, exam, evaluation };
                }));
                
                setResults(resultsData);
            } catch (error) {
                console.error("Failed to load results", error);
            } finally {
                setLoading(false);
            }
        }
        
        loadResults();
    }, [user]);
    
    return (
        <div className="results-page-container">
            <div className="exam-detail-container" style={{ width: '100%', background: 'transparent', boxShadow: 'none' }}>
                <div className="exam-detail-header" style={{ borderRadius: '8px' }}>
                    <h3>Mine Resultater</h3>
                </div>
                
                <div className="exam-detail-content" style={{ flexDirection: 'column', gap: '20px', padding: '32px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {loading ? (
                        <p>Henter resultater...</p>
                    ) : results.length === 0 ? (
                        <p>Ingen bedømte eksamener endnu.</p>
                    ) : (
                        results.map(item => (
                            <div key={item.submission.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <h4 style={{ margin: 0, color: '#333' }}>{item.exam?.title || "Ukendt Eksamen"}</h4>
                                    <span style={{ fontWeight: 'bold', color: '#5a8fb0' }}>{new Date(item.submission.uploadDate).toLocaleDateString()}</span>
                                </div>
                                
                                <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ width: '100px', fontWeight: 'bold' }}>Karakter:</span>
                                        <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#2ecc71' }}>
                                            {item.evaluation ? item.evaluation.grade : "Ingen karakter"}
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <span style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Feedback:</span>
                                        <p style={{ margin: 0, color: '#555', whiteSpace: 'pre-wrap' }}>
                                            {item.evaluation ? item.evaluation.feedback : "Ingen feedback tilgængelig."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
