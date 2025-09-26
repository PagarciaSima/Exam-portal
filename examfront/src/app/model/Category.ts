export interface Category {
  cid: number;
  title: string;
  description: string;
  // quizzes is optional, as it's usually not sent from backend in list endpoints
  quizzes?: any[];
}