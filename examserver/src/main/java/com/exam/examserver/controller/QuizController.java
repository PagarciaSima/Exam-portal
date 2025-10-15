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
     * Retrieves a paginated list of quizzes, optionally filtered by search term and/or category.
     * <p>
     * This endpoint supports the following use cases:
     * <ul>
     *   <li>If {@code categoryId} is provided, only quizzes from that category are returned.</li>
     *   <li>If {@code search} is provided, quizzes are filtered by matching the search term in
     *       the title, description, max marks, or number of questions.</li>
     *   <li>If both {@code categoryId} and {@code search} are provided, results are filtered by
     *       category and search term.</li>
     *   <li>If neither parameter is provided, all quizzes are returned paginated.</li>
     * </ul>
     *
     * @param page the page number to retrieve (0-based). Defaults to 0.
     * @param size the number of quizzes per page. Defaults to 10.
     * @param search optional search term to filter quizzes by title, description, max marks, or number of questions.
     * @param categoryId optional category ID to filter quizzes by a specific category.
     * @return a {@link ResponseEntity} containing a {@link Page} of {@link Quiz} matching the provided filters.
     */
    @GetMapping("/paged")
    public ResponseEntity<?> getQuizzesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Boolean active
    		) {

        Page<Quiz> quizzes;

        if (categoryId != null) {
            // con filtro de categoría
            if (search != null && !search.isBlank()) {
                LOGGER.debug("Search '{}' with category {} -> page {}", search, categoryId, page);
                quizzes = quizService.searchQuizByCategoryPaged(categoryId, search.trim(), page, size, active);
            } else {
                LOGGER.debug("Category {} -> page {}", categoryId, page);
                quizzes = quizService.getQuizByCategoryPaged(categoryId, page, size, active);
            }
        } else {
            // sin filtro de categoría
            if (search != null && !search.isBlank()) {
                quizzes = quizService.searchQuizzesPaged(search.trim(), page, size, active);
            } else {
                quizzes = quizService.getQuizzesPaged(page, size, active);
            }
        }

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