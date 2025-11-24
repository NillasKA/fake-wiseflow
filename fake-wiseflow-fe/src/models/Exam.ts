import type { Submission } from "./Submission";

export interface Exam {
    id: string;
    title: string;
    date: Date;
    description: String;
    type: String;
    submissions: Array<Submission>;
}