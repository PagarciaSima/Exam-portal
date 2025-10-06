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
import org.springframework.web.bind.annotation.RequestBody;
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
    @Autowired
    private IFileService fileService;

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
     * Handles HTTP POST requests to create a new question.
     * <p>
     * This endpoint accepts a {@link Question} object along with an optional image file.
     * If an image is provided, it will be saved to the file system and its relative path 
     * will be linked to the {@link Question}. The question is then persisted in the database.
     * </p>
     *
     * @param question   the {@link Question} object containing the question details
     * @param imageFile  an optional {@link MultipartFile} representing the image to associate with the question;
     *                   may be {@code null} or empty
     * @return a {@link ResponseEntity} containing the created {@link Question} if successful,
     *         or an error response if the image could not be saved
     */
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
    @PutMapping()
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
     * Retrieve questions for a specific quiz in a paginated manner.
     * <p>
     * This endpoint returns the questions belonging to the given quiz ID,
     * ordered by their ID (or another field if desired), and paginated
     * using standard query parameters for page and size.
     * </p>
     *
     * <p>Example request:</p>
     * <pre>
     * GET /question/quiz/5/paged?page=0&size=10
     * </pre>
     *
     * @param qid  the ID of the quiz
     * @param page the page number (zero-based)
     * @param size the number of questions per page
     * @return a page of questions for the specified quiz
     */
    @GetMapping("/quiz/{qid}/paged")
    public ResponseEntity<?> getQuestionsByQuizPaged(
            @PathVariable Long qid,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        LOGGER.info("Received request to fetch paginated questions for quiz ID {}: page {}, size {}", qid, page, size);

        Page<Question> questionsPage = quizService.getQuestionsByQuizPaged(qid, page, size);
        return ResponseEntity.ok(questionsPage);
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
    
    /**
     * Retrieve a specific question by its ID.
     *
     * @param questionId the ID of the question to retrieve
     * @return the question with the given ID
     */
    @GetMapping("/{questionId}")
    public ResponseEntity<Question> getQuestion(@PathVariable Long questionId) {
        LOGGER.info("Received request to fetch question with ID: {}", questionId);
        Question question = questionService.getQuestion(questionId);
        return ResponseEntity.ok(question);
    }
}