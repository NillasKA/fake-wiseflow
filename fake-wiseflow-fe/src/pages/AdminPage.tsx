import "../stylesheets/pages/AdminPage.css"
import InstitutionModule from "../components/administration/InstitutionModule.tsx";

export default function AdminPage() {
    return (
        <div className="admin-container">
            <InstitutionModule />
            <InstitutionModule />
        </div>
    );
}
