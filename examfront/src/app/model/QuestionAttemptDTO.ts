export interface QuestionAttemptDTO {
  id: number;
  content: string;
  givenAnswer: string;
  answer: string;
  image: string;
}

export interface QuizAttemptDTO {
    id: number;
    marksGot: number;
    correctAnswers: number;
    attempted: number;
    attemptDate: string; 
    questions: QuestionAttemptDTO[];
    maxMarks: number;
}