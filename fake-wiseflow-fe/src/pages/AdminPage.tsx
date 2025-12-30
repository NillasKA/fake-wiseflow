import { useState } from "react";
import "../stylesheets/pages/AdminPage.css"
import InstitutionModule from "../components/administration/InstitutionModule.tsx";
import UserModule from "../components/administration/UserModule";
import ExamModule from "../components/administration/Exam/ExamModule.tsx";
import { useAuth } from "../hooks/useAuth";

export default function AdminPage() {
    const { user } = useAuth();
    const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null);

    // Determine if user is SuperAdmin
    const isSuperAdmin = user?.roles?.includes("SuperAdmin");
    const isInstitutionAdmin = user?.roles?.includes("InstitutionAdmin");

    // For InstitutionAdmin, automatically set their institution
    const effectiveInstitutionId = isSuperAdmin 
        ? selectedInstitutionId 
        : (isInstitutionAdmin && user?.institutionId ? user.institutionId : null);

    return (
        <div className="admin-container">
            {/* Only show InstitutionModule for SuperAdmin */}
            {isSuperAdmin && (
                <InstitutionModule 
                    onInstitutionSelect={setSelectedInstitutionId}
                    selectedInstitutionId={selectedInstitutionId}
                />
            )}
            
            <UserModule 
                institutionId={effectiveInstitutionId}
                isSuperAdmin={isSuperAdmin}
            />

            <ExamModule
                institutionId={effectiveInstitutionId}
                isSuperAdmin={isSuperAdmin}
            />

        </div>
    );
}
