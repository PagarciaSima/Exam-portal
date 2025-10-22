package com.exam.examserver.service;

import java.util.List;
import java.util.Set;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;


public interface IQuestionService {
	public Question addQuestion(Question Question);
	public Question updateQuestion(Question Question);
	public Question getQuestion(Long QuestionId);
	public void deleteQuestion(Long QuestionId);
	public Set<Question> getQuestions(Quiz quiz);
	public List<Question> saveAll(List<Question> questions);
}
