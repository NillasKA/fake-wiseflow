import { useEffect, useState } from "react";
import UserModal from "./UserModal";
import "../../stylesheets/components/InstitutionModule.css";

export type User = {
    id: string;
    email: string;
    userName: string;
    role: string;
};

const API_URL = "https://localhost:7130/api/Student";

export default function UserModule() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function getAllUsers() {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_URL}/all`, { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    async function createUser(userData: { name: string; email: string; role: string }) {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                userName: userData.name,
                email: userData.email,
                password: "TempPassword123!", // You might want to generate this or send email
                role: userData.role
            })
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(error || "Failed to create user");
        }

        await getAllUsers();
    }

    async function deleteUser(id: string) {
        if (!confirm("Er du sikker på at du vil slette denne bruger?")) return;
        
        try {
            const res = await fetch(`${API_URL}/${id}`, {
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
    }, []);

    const filtered = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.userName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <div className="module-card">
                <div className="module-header">
                    <div className="module-title">Brugere</div>

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

                {error && <div className="module-error">{error}</div>}

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
                                            onClick={() => deleteUser(user.id)}
                                        >
                                            Slet
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="center">Ingen brugere fundet</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={createUser}
            />
        </>
    );
}