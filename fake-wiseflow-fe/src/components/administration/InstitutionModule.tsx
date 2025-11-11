import { useEffect, useState } from "react";
import { useInstitutions } from "../../hooks/useInstitutions";
import "../../stylesheets/components/InstitutionModule.css";

export default function InstitutionModule() {
    const { institutions, loading, getAll, remove } = useInstitutions();
    const [search, setSearch] = useState("");

    useEffect(() => {
        getAll();
    }, []);

    const filtered = institutions.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="module-card">
            <div className="module-header">
                <div className="module-title">Institutioner</div>

                <div className="module-controls">
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button className="add-btn" onClick={() => alert("Mangler")}>Tilføj</button>
                </div>
            </div>

            <table className="module-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Navn</th>
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
                            <td>{i.name}</td>
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
    );
}
