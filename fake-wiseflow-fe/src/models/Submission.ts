export interface Submission {
    id: string | null;
    userId: string;
    examId: string;
    fileName: string;
    uploadDate: Date;
    status: string;
}

export type SubmissionPartial = Omit<Submission, 'id' | 'fileName' | 'uploadDate' | 'status'>;
