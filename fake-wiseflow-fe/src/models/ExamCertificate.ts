import type { Exam } from "./Exam";

export interface ExamCertificate {
    id: string;
    dateIssued: Date;
    exam: Exam;
}