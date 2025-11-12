import "../stylesheets/pages/AdminPage.css"
import InstitutionModule from "../components/administration/InstitutionModule.tsx";
import UserModule from "../components/administration/UserModule";

export default function AdminPage() {
    return (
        <div className="admin-container">
            <InstitutionModule />
            <UserModule />
        </div>
    );
}
