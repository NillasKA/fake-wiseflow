import { useEffect, useState } from "react";
import UserModal from "./UserModal";
import "../../stylesheets/components/InstitutionModule.css";

export type User = {
    id: string;
    email: string;
    userName: string;
    role: string;
    institutionId?: string;
};

const STUDENT_API = "https://localhost:7130/api/Student";
const EXAMINATOR_API = "https://localhost:7130/api/Examinator";

interface UserModuleProps {
    institutionId?: string | null;
    isSuperAdmin?: boolean;
}

export default function UserModule({ institutionId, isSuperAdmin }: UserModuleProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function getAllUsers() {
        setLoading(true);
        setError("");
        try {
            let studentsUrl = `${STUDENT_API}/all`;
            let examinatorsUrl = `${EXAMINATOR_API}/all`;

            // If institutionId is provided, fetch users for that institution
            if (institutionId) {
                studentsUrl = `${STUDENT_API}/institution/${institutionId}`;
                examinatorsUrl = `${EXAMINATOR_API}/institution/${institutionId}`;
            }

            const [studentsRes, examinatorsRes] = await Promise.all([
                fetch(studentsUrl, { credentials: "include" }),
                fetch(examinatorsUrl, { credentials: "include" })
            ]);

            if (!studentsRes.ok || !examinatorsRes.ok) {
                throw new Error("Failed to fetch users");
            }

            const students = await studentsRes.json();
            const examinators = await examinatorsRes.json();

            setUsers([...students, ...examinators]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    async function deleteUser(id: string, role: string) {
        if (!confirm("Er du sikker på at du vil slette denne bruger?")) return;
        
        try {
            const endpoint = role === "Student" ? STUDENT_API : EXAMINATOR_API;
            const res = await fetch(`${endpoint}/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to delete user");
            await getAllUsers();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete user");
        }
    }

    useEffect(() => {
        getAllUsers();
    }, [institutionId]);

    const filtered = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.userName.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    // Determine if Add button should be disabled
    const canAddUser = isSuperAdmin ? institutionId !== null : true;

    return (
        <>
            <div className="module-card">
                <div className="module-header">
                    <div className="module-title">
                        Brugere
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
                            onClick={() => setIsModalOpen(true)}
                            disabled={!canAddUser}
                            title={!canAddUser ? "Vælg en institution først" : ""}
                        >
                            Tilføj
                        </button>
                    </div>
                </div>

                {error && <div className="module-error">{error}</div>}

                {isSuperAdmin && !institutionId && (
                    <div className="info-message">
                        👈 Vælg en institution til venstre for at se brugere og oprette nye
                    </div>
                )}

                <table className="module-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Brugernavn</th>
                            <th>Rolle</th>
                            <th>Handling</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="center">Henter data...</td>
                            </tr>
                        ) : filtered.length ? (
                            filtered.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td>{user.userName}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button 
                                            className="danger-btn" 
                                            onClick={() => deleteUser(user.id, user.role)}
                                        >
                                            Slet
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="center">
                                    {institutionId 
                                        ? "Ingen brugere fundet for denne institution" 
                                        : "Ingen brugere fundet"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    getAllUsers();
                }}
                institutionId={institutionId}
            />
        </>
    );
}