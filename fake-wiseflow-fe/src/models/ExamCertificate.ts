import type { Exam } from "./Exam";

export interface ExamCertificate {
    id: number;
    dateIssued: Date;
    exam: Exam;
}