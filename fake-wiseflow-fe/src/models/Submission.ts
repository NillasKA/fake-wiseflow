export interface Submission {
    id: string;
    userId: string;
    fileName: string;
    uploadDate: Date;
    status: string;
}

export type SubmissionPartial = Omit<Submission, 'id' | 'fileName' | 'uploadDate' | 'status'>;
