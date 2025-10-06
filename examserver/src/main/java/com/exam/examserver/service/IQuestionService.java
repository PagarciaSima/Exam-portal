package com.exam.examserver.service;

import java.util.Set;

import org.springframework.data.domain.Page;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;


public interface IQuestionService {
	public Question addQuestion(Question Question);
	public Question updateQuestion(Question Question);
	public Question getQuestion(Long QuestionId);
	public void deleteQuestion(Long QuestionId);
	public Set<Question> getQuestions(Quiz quiz);
}
