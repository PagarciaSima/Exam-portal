package com.exam.examserver.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;

public interface QuestionRepository extends JpaRepository<Question, Long>{

	 Set<Question> findByQuiz(Quiz quiz);

	Page<Question> findByQuiz_qId(Long getqId, Pageable pageable);

	List<Question> findByQuiz_qId(Long getqId);

}
