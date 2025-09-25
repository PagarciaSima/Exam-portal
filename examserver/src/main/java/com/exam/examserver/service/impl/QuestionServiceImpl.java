package com.exam.examserver.service.impl;

import java.util.LinkedHashSet;
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
}