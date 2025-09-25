package com.exam.examserver.service.impl;

import java.util.LinkedHashSet;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.repository.QuizRepository;
import com.exam.examserver.service.IQuizService;

/**
 * Implementation of the Quiz service.
 * Provides CRUD operations for Quiz entities.
 */
@Service
public class QuizServiceImpl implements IQuizService {

    private static final Logger LOGGER = LoggerFactory.getLogger(QuizServiceImpl.class);

    @Autowired
    private QuizRepository quizRepository;

    /**
     * Adds a new quiz.
     *
     * @param quiz the quiz to add
     * @return the saved quiz
     */
    @Override
    public Quiz addQuiz(Quiz quiz) {
        LOGGER.info("Adding new quiz: {}", quiz.getTitle());
        return quizRepository.save(quiz);
    }

    /**
     * Updates an existing quiz.
     *
     * @param quiz the quiz to update
     * @return the updated quiz
     */
    @Override
    public Quiz updateQuiz(Quiz quiz) {
        LOGGER.info("Updating quiz with ID: {}", quiz.getqId());
        if (!quizRepository.existsById(quiz.getqId())) {
            LOGGER.warn("Quiz with ID {} does not exist. Cannot update.", quiz.getqId());
            throw new IllegalArgumentException("Quiz not found with ID: " + quiz.getqId());
        }
        return quizRepository.save(quiz);
    }

    /**
     * Retrieves all quizzes.
     *
     * @return a set of all quizzes
     */
    @Override
    public Set<Quiz> getQuizzes() {
        LOGGER.info("Fetching all quizzes");
        return new LinkedHashSet<>(quizRepository.findAll());
    }

    /**
     * Retrieves a quiz by its ID.
     *
     * @param quizId the ID of the quiz
     * @return the found quiz
     * @throws IllegalArgumentException if quiz is not found
     */
    @Override
    public Quiz getQuiz(Long quizId) {
        LOGGER.info("Fetching quiz with ID: {}", quizId);
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        if (quizOpt.isEmpty()) {
            LOGGER.warn("Quiz with ID {} not found", quizId);
            throw new IllegalArgumentException("Quiz not found with ID: " + quizId);
        }
        return quizOpt.get();
    }

    /**
     * Deletes a quiz by its ID.
     *
     * @param quizId the ID of the quiz to delete
     * @throws IllegalArgumentException if quiz is not found
     */
    @Override
    public void deleteQuiz(Long quizId) {
        LOGGER.info("Deleting quiz with ID: {}", quizId);
        if (!quizRepository.existsById(quizId)) {
            LOGGER.warn("Quiz with ID {} does not exist. Cannot delete.", quizId);
            throw new IllegalArgumentException("Quiz not found with ID: " + quizId);
        }
        quizRepository.deleteById(quizId);
        LOGGER.info("Quiz with ID {} deleted successfully", quizId);
    }
}