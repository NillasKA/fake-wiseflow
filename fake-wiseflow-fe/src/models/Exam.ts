export interface Exam {
    id: string;
    title: string;
    date: Date;
    description: string;
    type: string;
    submissionIds: Array<string>;
    institutionId: string;
}

export type ExamPartial = Omit<Exam, 'id' | 'submissionIds'>;