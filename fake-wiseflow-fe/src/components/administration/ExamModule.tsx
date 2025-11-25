import { useEffect, useState } from "react";
import { useExams } from "../../hooks/UseExams";
import "../../stylesheets/components/InstitutionModule.css";
import ExamPopup from "./ExamPopup";
import PopupModal from "./PopupModal"

export default function ExamModule() {
    const { exams, loading, getAll, remove } = useExams();
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getAll();
    }, []);

    const filtered = exams.filter(i =>
        i.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
        <div className="module-card">
            <div className="module-header">
                <div className="module-title">Eksamen</div>

                <div className="module-controls">
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="add-btn" onClick={() => setIsModalOpen(true)}>
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
                        <td colSpan={3} className="center">Henter data...</td>
                    </tr>
                ) : filtered.length ? (
                    filtered.map((i) => (
                        <tr key={i.id}>
                            <td>{i.id}</td>
                            <td>{i.title}</td>
                            <td>{new Date(i.date).toLocaleDateString("da-DK")}</td>
                            <td>{i.description}</td>
                            <td>{i.type}</td>
                            <td>
                                <button className="danger-btn" onClick={() => remove(i.id!)}>Slet</button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} className="center">Ingen institutioner fundet</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
         <PopupModal isOpen={isModalOpen} onClose={
                    () => {
                        setIsModalOpen(false);
                        getAll()}} header={"Opret Eksamen"}>
                    <ExamPopup />
                </PopupModal>
    </>
    );
}