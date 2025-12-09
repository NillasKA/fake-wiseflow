import { useEffect, useState } from "react";
import { useExams } from "../../../hooks/useExams.ts";
import "../../../stylesheets/components/InstitutionModule.css";
import ExamPopup from "./ExamPopup.tsx";
import ExamSubmissionPopup from "./ExamSubmissionPopup.tsx";
import PopupModal from "../PopupModal.tsx"

interface ExamModuleProps {
    institutionId?: string | null;
    isSuperAdmin?: boolean;
}

export default function ExamModule({ institutionId, isSuperAdmin }: ExamModuleProps) {
    const { exams, loading, getAll, getAllForInstitution, remove } = useExams();
    const [search, setSearch] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

    useEffect(() => {
        if (institutionId) {
            getAllForInstitution(institutionId);
        } else if (isSuperAdmin) {
            getAll();
        }
    }, [institutionId, isSuperAdmin]);

    const filtered = exams.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase())
    );

    function copyExamId(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        navigator.clipboard.writeText(id.toString());
        alert("Eksamens ID kopieret til udklipsholder!");
    }

    function handleManageExam(examId: string) {
        setSelectedExamId(examId);
        setIsSubmissionModalOpen(true);
    }

    function handleSubmissionModalClose() {
        setIsSubmissionModalOpen(false);
        setSelectedExamId(null);

        if (institutionId) {
            getAllForInstitution(institutionId);
        } else if (isSuperAdmin) {
            getAll();
        }
    }

    const canAddExam = isSuperAdmin ? true : institutionId !== null && institutionId !== undefined;

    return (
        <>
            <div className="module-card">
                <div className="module-header">
                    <div className="module-title">
                        Eksamen
                        {institutionId && <span className="module-subtitle"> (Filtreret efter institution)</span>}
                    </div>

                    <div className="module-controls">
                        <input
                            type="text"
                            placeholder="Search"
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <button
                            className="add-btn"
                            onClick={() => setIsCreateModalOpen(true)}
                            disabled={!canAddExam}
                            title={!canAddExam ? "Vælg en institution først" : ""}
                        >
                            Tilføj
                        </button>
                    </div>
                </div>

                <table className="module-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titel</th>
                        <th>Dato</th>
                        <th>Beskrivelse</th>
                        <th>Type</th>
                        <th>Handling</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="center">Henter data...</td>
                        </tr>
                    ) : !institutionId && !isSuperAdmin ? (
                        <tr>
                            <td colSpan={6} className="center">Vælg en institution for at se eksamener</td>
                        </tr>
                    ) : filtered.length ? (
                        filtered.map((i) => (
                            <tr key={i.id}>
                                <td onClick={(e) => e.stopPropagation()}>
                                    <button
                                        className="copy-id-btn"
                                        onClick={(e) => copyExamId(i.id!, e)}
                                        title="Kopier ID"
                                    >
                                        📋 Kopier ID
                                    </button>
                                </td>
                                <td>{i.title}</td>
                                <td>{new Date(i.date).toLocaleDateString("da-DK")}</td>
                                <td>{i.description}</td>
                                <td>{i.type}</td>
                                <td>
                                    <button
                                        className="primary-btn"
                                        onClick={() => handleManageExam(i.id!)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        Håndter
                                    </button>
                                    <button
                                        className="danger-btn"
                                        onClick={() => remove(i.id!)}
                                    >
                                        Slet
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="center">Ingen eksamen fundet</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <PopupModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    if (institutionId) {
                        getAllForInstitution(institutionId);
                    } else if (isSuperAdmin) {
                        getAll();
                    }
                }}
                header={"Opret Eksamen"}
            >
                <ExamPopup institutionId={institutionId} />
            </PopupModal>

            <PopupModal
                isOpen={isSubmissionModalOpen}
                onClose={handleSubmissionModalClose}
                header={"Administrer Afleveringer"}
            >
                {selectedExamId && <ExamSubmissionPopup examId={selectedExamId} onClose={handleSubmissionModalClose} />}
            </PopupModal>
        </>
    );
}