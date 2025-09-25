package com.exam.examserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.examserver.model.exam.question.Question;

public interface QuestionRepository extends JpaRepository<Question, Long>{

}
