package com.exam.examserver.service;

import java.util.Set;

import com.exam.examserver.model.exam.question.Question;


public interface IQuestionService {
	public Question addQuestion(Question Question);
	public Question updateQuestion(Question Question);
	public Set<Question> getQuestions();
	public Question getQuestion(Long QuestionId);
	public void deleteQuestion(Long QuestionId);
}
