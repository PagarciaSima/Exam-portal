import { Category } from "./Category";

/**
 * Interface representing a Quiz entity.
 */
export interface Quiz {
  qId: number;
  title: string;
  description: string;
  maxMarks: number;
  numberOfQuestions: number;
  active: boolean;
  category?: Category;
  // questions is optional, as it's usually not sent from backend in list endpoints
  questions?: any[];
}