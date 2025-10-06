package com.exam.examserver.controller;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.service.IQuizService;

/**
 * REST controller for managing Quiz entities.
 * Provides endpoints for CRUD operations.
 */
@RestController
@RequestMapping("/quiz")
@CrossOrigin("*")
public class QuizController {

    private static final Logger LOGGER = LoggerFactory.getLogger(QuizController.class);

    @Autowired
    private IQuizService quizService;

    /**
     * Create a new quiz.
     *
     * @param quiz the quiz to create
     * @return the created quiz
     */
    @PostMapping()
    public ResponseEntity<?> addQuiz(@RequestBody Quiz quiz) {
        LOGGER.info("Received request to add quiz: {}", quiz.getTitle());
        Quiz createdQuiz = quizService.addQuiz(quiz);
        return ResponseEntity.ok(createdQuiz);
    }

    /**
     * Update an existing quiz.
     *
     * @param quiz the quiz with updated fields
     * @return the updated quiz
     */
    @PutMapping()
    public ResponseEntity<?> updateQuiz(@RequestBody Quiz quiz) {
        LOGGER.info("Received request to update quiz with ID: {}", quiz.getqId());
        Quiz updatedQuiz = quizService.updateQuiz(quiz);
        return ResponseEntity.ok(updatedQuiz);
    }

    /**
     * Retrieve all quizzes.
     *
     * @return a set of all quizzes
     */
    @GetMapping()
    public ResponseEntity<?> getQuizzes() {
        LOGGER.info("Received request to fetch all quizzes");
        Set<Quiz> quizzes = quizService.getQuizzes();
        return ResponseEntity.ok(quizzes);
    }
    
    /**
     * Retrieve quizzes in a paginated and alphabetically ordered manner.
     *
     * <p>This endpoint returns a page of quizzes sorted by their title in ascending order.
     * Clients can specify the page number and the number of quizzes per page using query parameters.
     * The response includes pagination metadata such as total pages, total elements, and current page.</p>
     *
     * <p>Example request:</p>
     * <pre>
     * GET /quiz/paged?page=0&size=10
     * </pre>
     *
     * @param page the zero-based page index (default is 0)
     * @param size the number of quizzes per page (default is 10)
     * @return a {@link ResponseEntity} containing a {@link Page} of {@link Quiz} objects
     *         with pagination metadata
     */
    @GetMapping("/paged")
    public ResponseEntity<?> getQuizzesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        LOGGER.info("Received request to fetch paginated quizzes: page {}, size {}", page, size);
        Page<Quiz> quizzes = quizService.getQuizzesPaged(page, size);
        return ResponseEntity.ok(quizzes);
    }
    
    /**
     * Retrieve a quiz by ID.
     *
     * @param quizId the ID of the quiz to fetch
     * @return the found quiz
     */
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuiz(@PathVariable Long quizId) {
        LOGGER.info("Received request to fetch quiz with ID: {}", quizId);
        Quiz quiz = quizService.getQuiz(quizId);
        return ResponseEntity.ok(quiz);
    }

    /**
     * Delete a quiz by ID.
     *
     * @param quizId the ID of the quiz to delete
     * @return a response entity with status
     */
    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long quizId) {
        LOGGER.info("Received request to delete quiz with ID: {}", quizId);
        quizService.deleteQuiz(quizId);
        return ResponseEntity.ok().build();
    }
}