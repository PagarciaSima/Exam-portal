package com.exam.examserver.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.exam.examserver.model.dto.PopularQuizStatsDTO;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.model.exam.quizattempt.QuizAttempt;
import com.exam.examserver.model.user.User;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
	List<QuizAttempt> findTop10ByUserOrderByAttemptDateDesc(User user);

	List<QuizAttempt> findByUserAndQuizOrderByAttemptDateAsc(User user, Quiz quiz);

	Optional<QuizAttempt> findTopByUserOrderByAttemptDateDesc(User user);
	
	// Top tries
	@Query("SELECT new com.exam.examserver.model.dto.PopularQuizStatsDTO(q.id, q.title, COUNT(a), AVG(a.marksGot)) " +
	       "FROM QuizAttempt a JOIN a.quiz q " +
	       "GROUP BY q.id, q.title " +
	       "ORDER BY COUNT(a) DESC")
	List<PopularQuizStatsDTO> findTopQuizzesByAttempts();

	// Top average score
	@Query("SELECT new com.exam.examserver.model.dto.PopularQuizStatsDTO(q.id, q.title, COUNT(a), AVG(a.marksGot)) " +
	       "FROM QuizAttempt a JOIN a.quiz q " +
	       "GROUP BY q.id, q.title " +
	       "ORDER BY AVG(a.marksGot) DESC")
	List<PopularQuizStatsDTO> findTopQuizzesByAverageScore();

}
