package com.exam.examserver.service;

import java.util.Set;

import com.exam.examserver.model.exam.quiz.Quiz;

public interface IQuizService {
	
	public Quiz addQuiz(Quiz quiz);
	public Quiz updateQuiz(Quiz quiz);
	public Set<Quiz> getQuizzes();
	public Quiz getQuiz(Long quizId);
	public void deleteQuiz(Long quizId);

}
