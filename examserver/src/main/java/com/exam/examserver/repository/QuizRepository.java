package com.exam.examserver.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.exam.examserver.model.exam.quiz.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long>{

	@Query("SELECT q FROM Quiz q WHERE " +
           "LOWER(q.title) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(q.description) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "CAST(q.maxMarks AS string) LIKE CONCAT('%', :term, '%') OR " +
           "CAST(q.numberOfQuestions AS string) LIKE CONCAT('%', :term, '%')")
    List<Quiz> searchQuizzes(@Param("term") String term);
}
