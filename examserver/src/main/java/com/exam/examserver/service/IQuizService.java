package com.exam.examserver.service;

import java.util.Set;

import org.springframework.data.domain.Page;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;

public interface IQuizService {
	
	public Quiz addQuiz(Quiz quiz);
	public Quiz updateQuiz(Quiz quiz);
	public Set<Quiz> getQuizzes();
	public Quiz getQuiz(Long quizId);
	public void deleteQuiz(Long quizId);
	public Page<Quiz> getQuizzesPaged(int page, int size, Boolean active);
	public Page<Question> getQuestionsByQuizPaged(Long qid, int page, int size);
	Page<Quiz> searchQuizzesPaged(String term, int page, int size, Boolean active);
	Page<Question> searchQuestionsByQuizPaged(Long qid, String term, int page, int size);
	public Page<Quiz> searchQuizByCategoryPaged(Long categoryId, String trim, int page, int size, Boolean active);
	public Page<Quiz> getQuizByCategoryPaged(Long categoryId, int page, int size, Boolean active);

}
