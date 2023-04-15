import { ZodIssue } from 'zod';

export const getIssuesZod = (issues: ZodIssue[]) => issues.map((issue) => `${issue.message}`);
