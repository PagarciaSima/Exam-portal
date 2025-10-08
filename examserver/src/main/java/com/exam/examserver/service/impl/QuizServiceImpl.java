package com.exam.examserver.service.impl;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.repository.QuestionRepository;
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
    @Autowired
    private QuestionRepository questionRepository;

    /**
     * Adds a new quiz.
     *
     * @param quiz the quiz to add
     * @return the saved quiz
     */
    @Override
    @Transactional
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
    @Transactional
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
    @Transactional(readOnly = true)
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
    @Transactional (readOnly = true)
    public Quiz getQuiz(Long quizId) {
        LOGGER.info("Fetching quiz with ID: {}", quizId);
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);

        if (quizOpt.isEmpty()) {
            LOGGER.warn("Quiz with ID {} not found", quizId);
            throw new IllegalArgumentException("Quiz not found with ID: " + quizId);
        }

        Quiz quiz = quizOpt.get();

        return quiz;
    }

    /**
     * Deletes a quiz by its ID.
     *
     * @param quizId the ID of the quiz to delete
     * @throws IllegalArgumentException if quiz is not found
     */
    @Override
    @Transactional
    public void deleteQuiz(Long quizId) {
        LOGGER.info("Deleting quiz with ID: {}", quizId);
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found with ID: " + quizId));

        // Romper la relación con la categoría
        if (quiz.getCategory() != null) {
            quiz.getCategory().getQuizzes().remove(quiz);
            quiz.setCategory(null);
        }

        quizRepository.delete(quiz);
        LOGGER.info("Quiz with ID {} deleted successfully", quizId);
    }
    
    /**
     * Retrieve quizzes in a paginated and alphabetically ordered manner.
     *
     * <p>This method fetches quizzes from the database ordered by their title in ascending order
     * and returns a {@link Page} containing the requested page of quizzes.
     * Pagination parameters allow clients to specify which page and how many items per page
     * should be returned.</p>
     *
     * <p>If the requested page exceeds the total number of pages, an empty page will be returned.</p>
     *
     * @param page the zero-based page index (0 = first page)
     * @param size the number of quizzes to return per page
     * @return a {@link Page} of {@link Quiz} objects, sorted by title in ascending order
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Quiz> getQuizzesPaged(int page, int size) {
        LOGGER.info("Fetching quizzes paginated: page {}, size {}, ordered by title ASC", page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "title"));

        return quizRepository.findAll(pageable);
    }

    /**
     * Retrieves paginated questions for a specific quiz.
     *
     * <p>This method first verifies that the quiz exists. Then, it retrieves the questions
     * associated with that quiz using pagination and sorting (by question ID ascending).</p>
     *
     * @param qid  the ID of the quiz
     * @param page the zero-based page index (0 = first page)
     * @param size the number of questions per page
     * @return a {@link Page} of {@link Question} objects belonging to the quiz
     * @throws IllegalArgumentException if the quiz does not exist
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Question> getQuestionsByQuizPaged(Long qid, int page, int size) {
        LOGGER.info("Fetching paginated questions for quiz ID {} (page {}, size {})", qid, page, size);

        // Verificar que el quiz existe
        Quiz quiz = quizRepository.findById(qid)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found with ID: " + qid));

        // limit total size to 20
        int maxTotalQuestions = 20;

        List<Question> questionsList = questionRepository.findByQuiz_qId(quiz.getqId());
        if (questionsList.size() > maxTotalQuestions) {
            questionsList = questionsList.subList(0, maxTotalQuestions);
        }

        // Crate limited list
        int start = Math.min(page * size, questionsList.size());
        int end = Math.min(start + size, questionsList.size());
        List<Question> pagedList = questionsList.subList(start, end);
       

        // pagination
        Page<Question> questionsPage = new PageImpl<>(pagedList, PageRequest.of(page, size), questionsList.size());

        LOGGER.info("Fetched {} questions (page {} of {}) for quiz '{}'",
                questionsPage.getNumberOfElements(),
                questionsPage.getNumber() + 1,
                questionsPage.getTotalPages(),
                quiz.getTitle());

        return questionsPage;
    }
    
    /**
     * Searches quizzes by a given term and returns a paginated result.
     * <p>
     * The search is performed using the repository method to fetch quizzes matching the term. 
     * Results are then sorted alphabetically by title and paginated manually according to the requested page and size.
     * </p>
     *
     * @param term the search term to filter quizzes by title or other relevant fields
     * @param page the page number to retrieve (0-based)
     * @param size the number of quizzes per page
     * @return a Page of {@link Quiz} containing the paginated search results
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Quiz> searchQuizzesPaged(String term, int page, int size) {
        LOGGER.info("Searching quizzes paginated by term '{}' (page {}, size {})", term, page, size);

        List<Quiz> results = quizRepository.searchQuizzes(term);

        // Ordenar por título alfabéticamente
        results.sort((a, b) -> a.getTitle().compareToIgnoreCase(b.getTitle()));

        // Calcular paginación manual
        int start = Math.min(page * size, results.size());
        int end = Math.min(start + size, results.size());
        List<Quiz> paged = results.subList(start, end);

        return new PageImpl<>(paged, PageRequest.of(page, size), results.size());
    }

    /**
     * Searches questions within a specific quiz by a given search term and returns a paginated result.
     * <p>
     * The search includes the question's content, all options (option1-4), and the answer. 
     * It uses the repository method to perform the query directly in the database, 
     * which is efficient for large quizzes.
     * </p>
     *
     * @param qid  the ID of the quiz whose questions are being searched
     * @param term the search term to filter questions; matches against content, options, or answer
     * @param page the page number to retrieve (0-based)
     * @param size the number of questions per page
     * @return a Page of {@link Question} containing the search results for the requested page
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Question> searchQuestionsByQuizPaged(Long qid, String term, int page, int size) {
        LOGGER.info("Searching questions for quiz ID {} with term '{}' (page {}, size {})", qid, term, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Question> result = questionRepository.searchQuestionsByQuiz(qid, term, pageable);
        LOGGER.info("Search returned {} questions out of total {}", result.getNumberOfElements(), result.getTotalElements());
        return result;
    }


}