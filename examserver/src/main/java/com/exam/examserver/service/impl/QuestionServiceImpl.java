package com.exam.examserver.service.impl;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.repository.QuestionRepository;
import com.exam.examserver.service.IQuestionService;

/**
 * Implementation of the Question service.
 * Provides CRUD operations for Question entities.
 */
@Service
public class QuestionServiceImpl implements IQuestionService {

    private static final Logger LOGGER = LoggerFactory.getLogger(QuestionServiceImpl.class);

    @Autowired
    private QuestionRepository questionRepository;

    /**
     * Adds a new question.
     *
     * @param question the question to add
     * @return the saved question
     */
    @Override
    @Transactional()
    public Question addQuestion(Question question) {
        LOGGER.info("Adding new question: {}", question.getContent());
        return questionRepository.save(question);
    }

    /**
     * Updates an existing question.
     *
     * @param question the question to update
     * @return the updated question
     */
    @Override
    @Transactional()
    public Question updateQuestion(Question question) {
        LOGGER.info("Updating question with ID: {}", question.getQuesId());
        if (!questionRepository.existsById(question.getQuesId())) {
            LOGGER.warn("Question with ID {} does not exist. Cannot update.", question.getQuesId());
            throw new IllegalArgumentException("Question not found with ID: " + question.getQuesId());
        }
        return questionRepository.save(question);
    }

    /**
     * Retrieves all questions associated with a specific quiz.
     *
     * @param quiz the quiz whose questions are to be fetched
     * @return a set of questions belonging to the given quiz
     */
    @Override
    @Transactional(readOnly = true)
    public Set<Question> getQuestions(Quiz quiz) {
        LOGGER.info("Fetching all questions for Quiz ID {} with title '{}'", quiz.getqId(), quiz.getTitle());
        return new LinkedHashSet<>(questionRepository.findByQuiz(quiz));
    }

    /**
     * Retrieves a question by its ID.
     *
     * @param questionId the ID of the question
     * @return the found question
     * @throws IllegalArgumentException if question is not found
     */
    @Override
    @Transactional(readOnly = true)
    public Question getQuestion(Long questionId) {
        LOGGER.info("Fetching question with ID: {}", questionId);
        Optional<Question> questionOpt = questionRepository.findById(questionId);
        if (questionOpt.isEmpty()) {
            LOGGER.warn("Question with ID {} not found", questionId);
            throw new IllegalArgumentException("Question not found with ID: " + questionId);
        }
        
        return questionOpt.get();
    }

    /**
     * Deletes a question by its ID.
     *
     * @param questionId the ID of the question to delete
     * @throws IllegalArgumentException if question is not found
     */
    @Override
    @Transactional()
    public void deleteQuestion(Long questionId) {
        LOGGER.info("Deleting question with ID: {}", questionId);
        if (!questionRepository.existsById(questionId)) {
            LOGGER.warn("Question with ID {} does not exist. Cannot delete.", questionId);
            throw new IllegalArgumentException("Question not found with ID: " + questionId);
        }
        questionRepository.deleteById(questionId);
        LOGGER.info("Question with ID {} deleted successfully", questionId);
    }
    
    /**
     * Persists a list of {@link Question} entities in the database.
     * <p>
     * This method performs a bulk save of all questions provided in the input list. 
     * It logs the number of questions received and the number successfully saved. 
     * If the input list is {@code null} or empty, the method logs a warning and 
     * returns an empty list without performing any database operations.
     * </p>
     *
     * <p><b>Transactional:</b> The method is annotated with {@code @Transactional}, 
     * so all save operations are performed in a single transaction. If any 
     * save operation fails, the transaction will be rolled back.</p>
     *
     * @param questions the list of {@link Question} objects to persist; may not be {@code null}, but can be empty
     * @return a list of {@link Question} entities that were successfully saved; returns an empty list if input is {@code null} or empty
     *
     * @throws DataAccessException if a data access error occurs during the save operation
     *
     * <p><b>Logging:</b>
     * <ul>
     *   <li>Logs a warning if the input list is empty or null.</li>
     *   <li>Logs info before saving the questions and after successful persistence.</li>
     * </ul>
     * </p>
     */
    @Override
    @Transactional
    public List<Question> saveAll(List<Question> questions) {
        if (questions == null || questions.isEmpty()) {
            LOGGER.warn("No questions to save. Received empty list.");
            return List.of();
        }
        LOGGER.info("Saving {} questions", questions.size());
        List<Question> savedQuestions = questionRepository.saveAll(questions);
        LOGGER.info("Saved {} questions successfully", savedQuestions.size());
        return savedQuestions;
    }
}