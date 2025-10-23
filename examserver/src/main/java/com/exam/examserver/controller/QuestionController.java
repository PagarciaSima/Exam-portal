package com.exam.examserver.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.exam.examserver.model.exam.quizattempt.QuizAttempt;
import com.exam.examserver.model.questionattempt.QuestionAttempt;
import com.exam.examserver.model.user.User;
import com.exam.examserver.service.IQuestionService;
import com.exam.examserver.service.IQuizAttemptService;
import com.exam.examserver.service.IQuizService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
    @Autowired
    private IQuizAttemptService quizAttemptService;

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
    
    /**
     * Evaluates a submitted quiz and calculates the number of correct answers, attempted questions, and total marks.
     *
     * @param questions List of questions with the answers given by the user.
     * @return A ResponseEntity containing a map with keys: "marksGot", "correctAnswers", and "attempted".
     */
    @Operation(
            summary = "Evaluate Quiz",
            description = "Evaluates a submitted quiz and calculates the number of correct answers, attempted questions, and total marks."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Quiz evaluated successfully",
                    content = @Content(schema = @Schema(implementation = Map.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    @PostMapping("/eval-quiz")
    public ResponseEntity<Map<String, Object>> evalQuiz(@RequestBody List<Question> questions) {
        double marksGot = 0.0;
        double correctAnswers = 0.0;
        int attempted = 0;
        Quiz currentQuiz = questions.get(0).getQuiz();

        LOGGER.info("Evaluating quiz with {} questions", questions.size());

        for (Question q : questions) {
            Question question = questionService.getQuestion(q.getQuesId());
            LOGGER.debug("Evaluating Question ID: {}, Correct Answer: {}, Given Answer: {}", 
                         q.getQuesId(), question.getAnswer(), q.getGivenAnswer());

            if (question.getAnswer().trim().equals(q.getGivenAnswer().trim())) {
                correctAnswers++;
                double marksSingle = currentQuiz.getMaxMarks() / (double) questions.size();
                marksGot += marksSingle;
                LOGGER.debug("Question {} correct, marks awarded: {}", q.getQuesId(), marksSingle);
            }

            if (q.getGivenAnswer() != null && !q.getGivenAnswer().trim().equals("")) {
                attempted++;
            }
        }

        marksGot = Math.round(marksGot * 100.0) / 100.0; // Round to 2 decimals

        Map<String, Object> mapResponse = Map.of(
                "marksGot", marksGot,
                "correctAnswers", correctAnswers,
                "attempted", attempted
        );
        
        saveHistoryAttempt(marksGot, correctAnswers, attempted, currentQuiz, questions);

        LOGGER.info("Quiz evaluation finished: {}", mapResponse);

        return ResponseEntity.ok(mapResponse);
    }
    
    
    /**
     * Save multiple questions at once.
     *
     * @param questions the list of questions to save
     * @return the list of saved questions
     */
    @Operation(
            summary = "Save multiple questions",
            description = "Saves a list of questions at once"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Questions saved successfully",
                    content = @Content(schema = @Schema(implementation = Question.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input"
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Internal server error"
            )
    })
    @PostMapping("/save-all")
    public ResponseEntity<List<Question>> saveAllQuestions(@RequestBody List<Question> questions) {
        if (questions == null || questions.isEmpty()) {
            LOGGER.warn("Received empty list of questions to save");
            return ResponseEntity.badRequest().build();
        }
        try {
            List<Question> savedQuestions = questionService.saveAll(questions);
            LOGGER.info("Saved {} questions successfully", savedQuestions.size());
            return ResponseEntity.ok(savedQuestions);
        } catch (Exception e) {
            LOGGER.error("Error saving questions: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Receives a JSON file containing a list of questions from the frontend and saves all questions.
     * <p>
     * The file is read in-memory and deserialized to a list of {@link Question} objects.
     * No file is stored on the server; questions are directly persisted using {@link #saveAll(List)}.
     * </p>
     *
     * @param file JSON file uploaded from frontend, containing a list of questions
     * @return ResponseEntity with saved questions on success, or error message on failure
     */
    @PostMapping("/upload-json")
    public ResponseEntity<?> uploadQuestionsJson(@RequestPart("file") MultipartFile file) {
        if (file.isEmpty()) {
            LOGGER.warn("Received empty file for bulk question upload");
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            List<Question> questions = objectMapper.readValue(
                file.getInputStream(),
                new TypeReference<List<Question>>() {}
            );

            if (questions.isEmpty()) {
                LOGGER.warn("Uploaded JSON contains no questions");
                return ResponseEntity.badRequest().body("JSON file contains no questions");
            }

            LOGGER.info("Uploading {} questions from JSON file", questions.size());
            // Persist all questions
            List<Question> savedQuestions = questionService.saveAll(questions);
            LOGGER.info("Saved {} questions successfully from JSON file", savedQuestions.size());

            return ResponseEntity.ok(savedQuestions);

        } catch (IOException e) {
            LOGGER.error("Failed to parse or save questions from JSON file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error processing JSON file: " + e.getMessage());
        }
    }

    
    
    

    /**
     * Saves the user's attempt for a given quiz along with the answers to each question.
     *
     * <p>This method retrieves the currently authenticated user, creates a {@link QuizAttempt}
     * entity, and maps each {@link Question} provided into a {@link QuestionAttempt} associated
     * with the attempt. It calculates correctness for each question based on the given answer
     * versus the actual answer.</p>
     *
     * @param marksGot the total marks obtained by the user in this quiz attempt
     * @param correctAnswers the number of correctly answered questions
     * @param attempted the number of questions attempted by the user
     * @param currentQuiz the {@link Quiz} object representing the quiz being attempted
     * @param questions the list of {@link Question} objects containing the user's answers
     *
     * <p>The method persists the {@link QuizAttempt} with its associated {@link QuestionAttempt} entities
     * using {@link quizAttemptService}.</p>
     *
     * <p>Logs informational and debug messages about the saving process, and logs errors
     * if the attempt cannot be saved.</p>
     */
    private void saveHistoryAttempt(double marksGot, double correctAnswers, int attempted, Quiz currentQuiz, List<Question> questions) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = (User) authentication.getPrincipal();

            LOGGER.info("Saving quiz attempt for user '{}' in quiz '{}'", user.getUsername(), currentQuiz.getTitle());

            // 1. Obtener los intentos existentes del usuario para este quiz
            List<QuizAttempt> existingAttempts = quizAttemptService.findByUserAndQuizOrderByAttemptDateAsc(user, currentQuiz);

            // 2. Si hay más de 9 intentos, eliminar los más antiguos hasta que queden 9
            while (existingAttempts.size() >= 10) {
                QuizAttempt oldest = existingAttempts.get(0);
                quizAttemptService.deleteAttempt(oldest);
                existingAttempts.remove(0);
                LOGGER.debug("Deleted oldest quiz attempt (ID: {}) to maintain max 10 history entries", oldest.getId());
            }

            // 3. Crear el nuevo intento
            QuizAttempt attempt = new QuizAttempt(currentQuiz, user, marksGot, correctAnswers, attempted);
            for (Question q : questions) {
                Question question = questionService.getQuestion(q.getQuesId());
                boolean isCorrect = question.getAnswer().trim().equals(q.getGivenAnswer().trim());
                QuestionAttempt qa = new QuestionAttempt(attempt, question, q.getGivenAnswer(), isCorrect);
                qa.setQuizId(currentQuiz.getqId());
                attempt.getQuestionAttempts().add(qa);
            }

            // 4. Guardar el nuevo intento
            quizAttemptService.saveAttempt(attempt);
            LOGGER.debug("Quiz attempt successfully saved for user '{}'", user.getUsername());

        } catch (Exception ex) {
            LOGGER.error("Failed to save quiz attempt for quiz '{}': {}", currentQuiz.getTitle(), ex.getMessage(), ex);
        }
    }
    
   
}
