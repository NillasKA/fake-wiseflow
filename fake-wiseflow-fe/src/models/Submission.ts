export interface Submission {
    id: string;
    examId: string;
    userId: string;
    fileName: string;
    uploadDate: Date;
    status: string;
    contentType: string;
    evaluationId?: string;
}

export type SubmissionPartial = Omit<Submission, 'id' | 'fileName' | 'uploadDate' | 'status' | 'contentType' | 'evaluationId'>;
