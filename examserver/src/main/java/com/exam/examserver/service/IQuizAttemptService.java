package com.exam.examserver.service;

import java.util.List;
import java.util.Optional;

import com.exam.examserver.model.dto.QuizAttemptDTO;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.model.exam.quizattempt.QuizAttempt;
import com.exam.examserver.model.user.User;

public interface IQuizAttemptService {
	QuizAttempt saveAttempt(QuizAttempt attempt);
    List<QuizAttemptDTO> getLastAttempts(User user);
	List<QuizAttempt> findByUserAndQuizOrderByAttemptDateAsc(User user, Quiz currentQuiz);
	void deleteAttempt(QuizAttempt oldest);
	Optional<QuizAttemptDTO> getLastAttempt(User user);
}
