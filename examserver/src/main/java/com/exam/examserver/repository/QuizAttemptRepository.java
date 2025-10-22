package com.exam.examserver.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.model.exam.quizattempt.QuizAttempt;
import com.exam.examserver.model.user.User;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findTop10ByUserOrderByAttemptDateDesc(User user);

	List<QuizAttempt> findByUserAndQuizOrderByAttemptDateAsc(User user, Quiz quiz);

    Optional<QuizAttempt> findTopByUserOrderByAttemptDateDesc(User user);
}
