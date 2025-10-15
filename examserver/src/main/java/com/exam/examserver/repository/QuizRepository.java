package com.exam.examserver.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.exam.examserver.model.exam.quiz.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

	@Query("SELECT q FROM Quiz q WHERE " + "LOWER(q.title) LIKE LOWER(CONCAT('%', :term, '%')) OR "
			+ "LOWER(q.description) LIKE LOWER(CONCAT('%', :term, '%')) OR "
			+ "CAST(q.maxMarks AS string) LIKE CONCAT('%', :term, '%') OR "
			+ "CAST(q.numberOfQuestions AS string) LIKE CONCAT('%', :term, '%')")
	List<Quiz> searchQuizzes(@Param("term") String term);

	@Query("""
			    SELECT q FROM Quiz q
			    WHERE q.category.cid = :categoryId
			    AND (
			        LOWER(q.title) LIKE LOWER(CONCAT('%', :term, '%')) OR
			        LOWER(q.description) LIKE LOWER(CONCAT('%', :term, '%')) OR
			        CAST(q.maxMarks AS string) LIKE CONCAT('%', :term, '%') OR
			        CAST(q.numberOfQuestions AS string) LIKE CONCAT('%', :term, '%')
			    )
			""")
	List<Quiz> searchQuizByCategory(@Param("categoryId") Long categoryId, @Param("term") String term);

	// Without active filter
	Page<Quiz> findAllByCategory_Cid(Long categoryId, Pageable pageable);

	// With optional active filter
	Page<Quiz> findAllByCategory_CidAndActive(Long categoryId, Boolean active, Pageable pageable);

	Page<Quiz> findAllByActive(Boolean active, Pageable pageable);

	@Query("""
			    SELECT q FROM Quiz q
			    WHERE q.active = :active AND (
			          LOWER(q.title) LIKE LOWER(CONCAT('%', :term, '%'))
			          OR LOWER(q.description) LIKE LOWER(CONCAT('%', :term, '%'))
			          OR CAST(q.maxMarks AS string) LIKE CONCAT('%', :term, '%')
			          OR CAST(q.numberOfQuestions AS string) LIKE CONCAT('%', :term, '%')
			    )
			""")
	List<Quiz> searchQuizzesByActive(@Param("term") String term, @Param("active") Boolean active);

}
