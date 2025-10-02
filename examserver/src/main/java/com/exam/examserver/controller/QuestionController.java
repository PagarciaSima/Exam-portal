package com.exam.examserver.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.service.IQuestionService;
import com.exam.examserver.service.IQuizService;

/**
 * REST controller for managing Question entities.
 * Provides endpoints for CRUD operations.
 */
@RestController
@RequestMapping("/question")
@CrossOrigin("*")
public class QuestionController {

    private static final Logger LOGGER = LoggerFactory.getLogger(QuestionController.class);

    @Autowired
    private IQuestionService questionService;
    @Autowired
    private IQuizService quizService;

    /**
     * Create a new question.
     *
     * @param question the question to create
     * @return the created question
     */
    @PostMapping()
    public ResponseEntity<?> addQuestion(@RequestBody Question question) {
        LOGGER.info("Received request to add question: {}", question.getContent());
        Question createdQuestion = questionService.addQuestion(question);
        LOGGER.info("Question created with ID: {}", createdQuestion.getQuesId());
        return ResponseEntity.ok(createdQuestion);
    }

    /**
     * Update an existing question.
     *
     * @param question the question with updated fields
     * @return the updated question
     */
    @PutMapping("/")
    public ResponseEntity<?> updateQuestion(@RequestBody Question question) {
        LOGGER.info("Received request to update question with ID: {}", question.getQuesId());
        Question updatedQuestion = questionService.updateQuestion(question);
        LOGGER.info("Question updated with ID: {}", updatedQuestion.getQuesId());
        return ResponseEntity.ok(updatedQuestion);
    }

    /**
     * Retrieve questions for a specific quiz.
     * Limits the number of questions returned to the quiz's configured number.
     *
     * @param qid the ID of the quiz
     * @return a list of questions for the quiz
     */
    @GetMapping("/quiz/{qid}")
    public ResponseEntity<?> getQuestionsByQuiz(@PathVariable Long qid) {
        Quiz quiz = quizService.getQuiz(qid);
        Set<Question> questionsOfQuiz = quiz.getQuestions();
        List<Question> list = new ArrayList<>(questionsOfQuiz);
        
        Collections.shuffle(list);
        
        if (list.size() > quiz.getNumberOfQuestions()) {
            list = list.subList(0, quiz.getNumberOfQuestions());
        }

        LOGGER.info("Fetched {} questions for Quiz ID {}: '{}'", list.size(), quiz.getqId(), quiz.getTitle());
        return ResponseEntity.ok(list);
    }

    /**
     * Delete a question by ID.
     *
     * @param questionId the ID of the question to delete
     * @return a response entity with status
     */
    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        LOGGER.info("Received request to delete question with ID: {}", questionId);
        questionService.deleteQuestion(questionId);
        LOGGER.info("Question deleted with ID: {}", questionId);
        return ResponseEntity.ok().build();
    }
}