package com.exam.examserver.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.exam.examserver.files.IFileService;
import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.service.IQuestionService;
import com.exam.examserver.service.IQuizService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/question")
@CrossOrigin("*")
@Tag(name = "Questions", description = "API for managing questions")
public class QuestionController {

    private static final Logger LOGGER = LoggerFactory.getLogger(QuestionController.class);

    @Autowired
    private IQuestionService questionService;
    @Autowired
    private IQuizService quizService;
    @Autowired
    private IFileService fileService;

    /**
     * Create a new question.
     *
     * @param question the question to create
     * @return the created question
     */
    @Operation(
        summary = "Create a new question",
        description = "Adds a new question to the system",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Question created successfully",
                content = @Content(schema = @Schema(implementation = Question.class))
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Invalid question data"
            )
        }
    )
    @PostMapping()
    public ResponseEntity<?> addQuestion(@RequestBody Question question) {
        LOGGER.info("Received request to add question: {}", question.getContent());
        Question createdQuestion = questionService.addQuestion(question);
        LOGGER.info("Question created with ID: {}", createdQuestion.getQuesId());
        return ResponseEntity.ok(createdQuestion);
    }

    /**
     * Handles HTTP POST requests to create a new question with optional image.
     *
     * @param question  the Question object
     * @param imageFile optional image to associate with the question
     * @return the created question
     */
    @Operation(
        summary = "Create a question with optional image",
        description = "Adds a new question and optionally associates an uploaded image",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Question created successfully with image if provided",
                content = @Content(schema = @Schema(implementation = Question.class))
            ),
            @ApiResponse(
                responseCode = "500",
                description = "Error saving the image"
            )
        }
    )
    @PostMapping("/add")
    public ResponseEntity<?> addQuestion(
            @RequestPart("question") Question question,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        try {
            fileService.createQuestionImageLocal(question, imageFile);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error guardando la imagen");
        }

        Question createdQuestion = questionService.addQuestion(question);
        return ResponseEntity.ok(createdQuestion);
    }

    /**
     * Update an existing question.
     *
     * @param question the question with updated fields
     * @return the updated question
     */
    @Operation(
        summary = "Update a question",
        description = "Updates an existing question with new data",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Question updated successfully",
                content = @Content(schema = @Schema(implementation = Question.class))
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Question not found"
            )
        }
    )
    @PutMapping()
    public ResponseEntity<?> updateQuestion(@RequestBody Question question) {
        LOGGER.info("Received request to update question with ID: {}", question.getQuesId());
        Question updatedQuestion = questionService.updateQuestion(question);
        LOGGER.info("Question updated with ID: {}", updatedQuestion.getQuesId());
        return ResponseEntity.ok(updatedQuestion);
    }

    /**
     * Retrieve questions for a specific quiz.
     *
     * @param qid the ID of the quiz
     * @return a list of questions for the quiz
     */
    @Operation(
        summary = "Get questions by quiz",
        description = "Retrieves questions for a specific quiz and limits to configured number",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Questions retrieved successfully",
                content = @Content(schema = @Schema(implementation = Question.class))
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Quiz not found"
            )
        }
    )
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
     * Retrieves a paginated list of questions for a specific quiz.
     *
     * @param qid    the ID of the quiz
     * @param page   the page number to retrieve (0-based)
     * @param size   the number of questions per page
     * @param search optional search term
     * @return a page of questions matching criteria
     */
    @Operation(
        summary = "Get paginated questions by quiz",
        description = "Retrieves paginated questions for a quiz, optionally filtered by search term",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Paginated questions retrieved successfully",
                content = @Content(schema = @Schema(implementation = Page.class))
            )
        }
    )
    @GetMapping("/quiz/{qid}/paged")
    public ResponseEntity<?> getQuestionsByQuizPaged(
            @PathVariable Long qid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search
    ) {
        Page<Question> questions;

        if (search != null && !search.isBlank()) {
            String trimmed = search.trim();
            questions = quizService.searchQuestionsByQuizPaged(qid, trimmed, page, size);
        } else {
            questions = quizService.getQuestionsByQuizPaged(qid, page, size);
        }

        return ResponseEntity.ok(questions);
    }

    /**
     * Delete a question by ID.
     *
     * @param questionId the ID of the question to delete
     * @return a response entity with status
     */
    @Operation(
        summary = "Delete a question",
        description = "Deletes a question by its ID",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Question deleted successfully"
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Question not found"
            )
        }
    )
    @DeleteMapping("/{questionId}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long questionId) {
        LOGGER.info("Received request to delete question with ID: {}", questionId);
        questionService.deleteQuestion(questionId);
        LOGGER.info("Question deleted with ID: {}", questionId);
        return ResponseEntity.ok().build();
    }

    /**
     * Retrieve a specific question by its ID.
     *
     * @param questionId the ID of the question to retrieve
     * @return the question with the given ID
     */
    @Operation(
        summary = "Get a question by ID",
        description = "Retrieves a single question by its ID",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Question retrieved successfully",
                content = @Content(schema = @Schema(implementation = Question.class))
            ),
            @ApiResponse(
                responseCode = "404",
                description = "Question not found"
            )
        }
    )
    @GetMapping("/{questionId}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long questionId) {
        LOGGER.info("Received request to fetch question with ID: {}", questionId);
        Question question = questionService.getQuestion(questionId);
        return ResponseEntity.ok(question);
    }
}
