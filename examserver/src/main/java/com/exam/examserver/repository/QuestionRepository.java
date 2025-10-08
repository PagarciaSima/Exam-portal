package com.exam.examserver.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;

public interface QuestionRepository extends JpaRepository<Question, Long> {

	Set<Question> findByQuiz(Quiz quiz);

	Page<Question> findByQuiz_qId(Long getqId, Pageable pageable);

	List<Question> findByQuiz_qId(Long getqId);

	@Query("SELECT q FROM Question q WHERE q.quiz.qId = :qid AND "
			+ "(LOWER(q.content) LIKE LOWER(CONCAT('%', :term, '%')) "
			+ "OR LOWER(q.option1) LIKE LOWER(CONCAT('%', :term, '%')) "
			+ "OR LOWER(q.option2) LIKE LOWER(CONCAT('%', :term, '%')) "
			+ "OR LOWER(q.option3) LIKE LOWER(CONCAT('%', :term, '%')) "
			+ "OR LOWER(q.option4) LIKE LOWER(CONCAT('%', :term, '%')) "
			+ "OR LOWER(q.answer) LIKE LOWER(CONCAT('%', :term, '%')))")
	Page<Question> searchQuestionsByQuiz(@Param("qid") Long qid, @Param("term") String term, Pageable pageable);

}
