package com.exam.examserver.controller;

import java.util.Map;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.service.IQuizService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/quiz")
@CrossOrigin("*")
@Tag(name = "Quizzes", description = "API for managing quizzes")
public class QuizController {

    private static final Logger LOGGER = LoggerFactory.getLogger(QuizController.class);

    @Autowired
    private IQuizService quizService;

    /**
     * Creates a new quiz.
     *
     * @param quiz the quiz object to create
     * @return ResponseEntity containing the created quiz
     */
    @Operation(
        summary = "Create a new quiz",
        description = "Adds a new quiz to the system",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Quiz created successfully",
                content = @Content(schema = @Schema(implementation = Quiz.class))
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Invalid quiz data",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @PostMapping()
    public ResponseEntity<?> addQuiz(@RequestBody Quiz quiz) {
        LOGGER.info("Received request to add quiz: {}", quiz.getTitle());
        Quiz createdQuiz = quizService.addQuiz(quiz);
        return ResponseEntity.ok(createdQuiz);
    }

    /**
     * Updates an existing quiz.
     *
     * @param quiz the quiz object with updated fields
     * @return ResponseEntity containing the updated quiz
     */
    @Operation(
        summary = "Update a quiz",
        description = "Updates an existing quiz with new data",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Quiz updated successfully",
                content = @Content(schema = @Schema(implementation = Quiz.class))
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Quiz not found",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @PutMapping()
    public ResponseEntity<?> updateQuiz(@RequestBody Quiz quiz) {
        LOGGER.info("Received request to update quiz with ID: {}", quiz.getqId());
        Quiz updatedQuiz = quizService.updateQuiz(quiz);
        return ResponseEntity.ok(updatedQuiz);
    }

    /**
     * Retrieves all quizzes from the system.
     *
     * @return ResponseEntity containing a set of all quizzes
     */
    @Operation(
        summary = "Get all quizzes",
        description = "Retrieves all quizzes from the system",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Quizzes retrieved successfully",
                content = @Content(schema = @Schema(implementation = Set.class))
            )
        }
    )
    @GetMapping()
    public ResponseEntity<?> getQuizzes() {
        LOGGER.info("Received request to fetch all quizzes");
        Set<Quiz> quizzes = quizService.getQuizzes();
        return ResponseEntity.ok(quizzes);
    }

    /**
     * Retrieves paginated quizzes, optionally filtered by search term or category.
     *
     * @param page the page number (0-based), default is 0
     * @param size the number of quizzes per page, default is 10
     * @param search optional search term to filter quizzes
     * @param categoryId optional category ID to filter quizzes
     * @param active optional filter for active quizzes
     * @return ResponseEntity containing a paginated list of quizzes
     */
    @Operation(
        summary = "Get paginated quizzes",
        description = "Retrieves quizzes paginated and optionally filtered by search term or category",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Paginated quizzes retrieved successfully",
                content = @Content(schema = @Schema(implementation = Page.class))
            )
        }
    )
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
            if (search != null && !search.isBlank()) {
                LOGGER.debug("Search '{}' with category {} -> page {}", search, categoryId, page);
                quizzes = quizService.searchQuizByCategoryPaged(categoryId, search.trim(), page, size, active);
            } else {
                LOGGER.debug("Category {} -> page {}", categoryId, page);
                quizzes = quizService.getQuizByCategoryPaged(categoryId, page, size, active);
            }
        } else {
            if (search != null && !search.isBlank()) {
                quizzes = quizService.searchQuizzesPaged(search.trim(), page, size, active);
            } else {
                quizzes = quizService.getQuizzesPaged(page, size, active);
            }
        }

        return ResponseEntity.ok(quizzes);
    }

    /**
     * Retrieves a quiz by its ID.
     *
     * @param quizId the ID of the quiz to fetch
     * @return ResponseEntity containing the quiz
     */
    @Operation(
        summary = "Get a quiz by ID",
        description = "Retrieves a single quiz by its ID",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Quiz retrieved successfully",
                content = @Content(schema = @Schema(implementation = Quiz.class))
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Quiz not found",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @GetMapping("/{quizId}")
    public ResponseEntity<?> getQuiz(@PathVariable Long quizId) {
        LOGGER.info("Received request to fetch quiz with ID: {}", quizId);
        Quiz quiz = quizService.getQuiz(quizId);
        return ResponseEntity.ok(quiz);
    }

    /**
     * Deletes a quiz by its ID.
     *
     * @param quizId the ID of the quiz to delete
     * @return ResponseEntity with status indicating the deletion result
     */
    @Operation(
        summary = "Delete a quiz",
        description = "Deletes a quiz by its ID",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Quiz deleted successfully"
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Quiz not found",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @DeleteMapping("/{quizId}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long quizId) {
        LOGGER.info("Received request to delete quiz with ID: {}", quizId);
        quizService.deleteQuiz(quizId);
        return ResponseEntity.ok().build();
    }

    /**
     * Submits a quiz and clears the corresponding session data.
     *
     * @param quizId the ID of the quiz being submitted
     * @param userId the ID of the user submitting the quiz
     * @param session the HTTP session from which quiz data will be cleared
     * @return ResponseEntity confirming that the quiz has been submitted and session cleared
     */
    @Operation(
        summary = "Submit a quiz",
        description = "Submits a quiz and clears the corresponding session",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Quiz submitted successfully and session cleared",
                content = @Content(schema = @Schema(implementation = String.class))
            )
        }
    )
    @PostMapping("/submit/{quizId}/{userId}")
    public ResponseEntity<?> submitQuiz(@PathVariable Long quizId, @PathVariable Long userId, HttpSession session) {
        String sessionKey = "quizOrder:" + userId + ":" + quizId;
        session.removeAttribute(sessionKey);
        return ResponseEntity.ok("Quiz submitted, session cleared");
    }
}
