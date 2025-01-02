import { z } from "zod";

export const AnswerToBriefSchema = z.record(z.array(z.string()));

export type AnswerToBriefDto = z.infer<typeof AnswerToBriefSchema>;
