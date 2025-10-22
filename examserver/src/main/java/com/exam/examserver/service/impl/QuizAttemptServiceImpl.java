package com.exam.examserver.service.impl;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.exam.examserver.model.dto.QuestionAttemptDTO;
import com.exam.examserver.model.dto.QuizAttemptDTO;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.model.exam.quizattempt.QuizAttempt;
import com.exam.examserver.model.questionattempt.QuestionAttempt;
import com.exam.examserver.model.user.User;
import com.exam.examserver.repository.QuizAttemptRepository;
import com.exam.examserver.service.IQuizAttemptService;

@Service
public class QuizAttemptServiceImpl implements IQuizAttemptService{

	@Autowired
    private QuizAttemptRepository repo;
    private static final Logger LOGGER = LoggerFactory.getLogger(QuizAttemptServiceImpl.class);

	 /**
     * Saves a new quiz attempt to the database.
     *
     * @param attempt the {@link QuizAttempt} object containing attempt details such as
     *                quiz, user, marks obtained, and number of correct answers.
     * @return the persisted {@link QuizAttempt} entity.
     */
    @Override
    public QuizAttempt saveAttempt(QuizAttempt attempt) {
        try {
            LOGGER.info("Saving quiz attempt for user '{}' and quiz '{}'",
                        attempt.getUser().getUsername(), attempt.getQuiz().getTitle());
            
            QuizAttempt saved = repo.save(attempt);
            LOGGER.debug("Quiz attempt saved successfully with ID: {}", saved.getId());
            return saved;
            
        } catch (Exception ex) {
            LOGGER.error("Error saving quiz attempt for user '{}': {}",
                         attempt.getUser().getUsername(), ex.getMessage(), ex);
            throw ex;
        }
    }

    /**
     * Retrieves the last 10 quiz attempts made by the specified user.
     *
     * <p>This method fetches the most recent quiz attempts from the repository,
     * maps each attempt to a {@link QuizAttemptDTO}, and returns them as a list.
     * If there are no attempts, an empty list is returned.</p>
     *
     * <p>Logs are generated for both successful retrieval and errors.</p>
     *
     * @param user the {@link User} whose last quiz attempts are to be fetched
     * @return a {@link List} of {@link QuizAttemptDTO} representing the user's last 10 quiz attempts;
     *         the list is empty if the user has no attempts
     * @throws RuntimeException if there is an error accessing the repository or mapping the attempts
     */
    @Override
    public List<QuizAttemptDTO> getLastAttempts(User user) {
        try {
            LOGGER.info("Fetching last 10 quiz attempts for user '{}'", user.getUsername());

            // Obtener los últimos 10 intentos
            List<QuizAttempt> attempts = repo.findTop10ByUserOrderByAttemptDateDesc(user);
            LOGGER.debug("Retrieved {} quiz attempts for user '{}'", attempts.size(), user.getUsername());

            // Mapear cada intento a DTO
            List<QuizAttemptDTO> dtoList = attempts.stream()
                .map(this::mapToDTO)
                .toList();

            return dtoList;

        } catch (Exception ex) {
            LOGGER.error("Error fetching quiz attempts for user '{}': {}", user.getUsername(), ex.getMessage(), ex);
            throw ex;
        }
    }
    
    /**
     * Retrieves the most recent quiz attempt made by the specified user.
     *
     * <p>This method queries the repository for the latest {@link QuizAttempt} based on
     * the attempt date, maps it to a {@link QuizAttemptDTO}, and returns it wrapped
     * in an {@link Optional}. If the user has not made any quiz attempts, the returned
     * {@code Optional} will be empty.</p>
     *
     * <p>Detailed logs are generated for both successful retrieval and error scenarios.</p>
     *
     * @param user the {@link User} whose last quiz attempt is to be retrieved
     * @return an {@link Optional} containing the most recent {@link QuizAttemptDTO} if available,
     *         or an empty {@link Optional} if the user has no quiz attempts
     * @throws RuntimeException if an unexpected error occurs while fetching or mapping the quiz attempt
     */
    @Override
    public Optional<QuizAttemptDTO> getLastAttempt(User user) {
        try {
            LOGGER.info("Fetching last quiz attempt for user '{}'", user.getUsername());

            // Devuelve Optional<QuizAttemptDTO>
            return repo.findTopByUserOrderByAttemptDateDesc(user)
                       .map(this::mapToDTO); 

        } catch (Exception ex) {
            LOGGER.error("Error fetching last quiz attempt for user '{}': {}", user.getUsername(), ex.getMessage(), ex);
            throw ex;
        }
    }
    
    /**
     * Maps a {@link QuizAttempt} entity to a {@link QuizAttemptDTO}.
     *
     * <p>This method transforms a {@link QuizAttempt} object into a data transfer object (DTO)
     * that contains only the information needed by the frontend. It also maps each
     * {@link QuestionAttempt} within the attempt to a {@link QuestionAttemptDTO}.</p>
     *
     * @param attempt the {@link QuizAttempt} entity to map
     * @return a {@link QuizAttemptDTO} containing:
     *         <ul>
     *             <li>Attempt ID</li>
     *             <li>Marks obtained</li>
     *             <li>Number of correct answers</li>
     *             <li>Number of attempted questions</li>
     *             <li>Attempt date</li>
     *             <li>List of {@link QuestionAttemptDTO} objects representing each question attempt</li>
     *         </ul>
     * @throws NullPointerException if {@code attempt} or its question attempts are null
     */
    public QuizAttemptDTO mapToDTO(QuizAttempt attempt) {
        List<QuestionAttemptDTO> questions = attempt.getQuestionAttempts().stream()
            .map(qa -> new QuestionAttemptDTO(
                qa.getId(),
                qa.getQuestion().getContent(),
                qa.getGivenAnswer(),
                qa.getQuestion().getAnswer(),
                qa.getQuestion().getImage()
            ))
            .toList();

        return new QuizAttemptDTO(
            attempt.getId(),
            attempt.getMarksGot(),
            attempt.getCorrectAnswers(),
            attempt.getAttempted(),
            attempt.getAttemptDate(),
            questions,
            attempt.getQuiz().getMaxMarks()
        );
    }

    /**
     * Retrieves all quiz attempts made by a specific user for a given quiz,
     * ordered by attempt date in ascending order.
     *
     * <p>This method queries the repository for all {@link QuizAttempt} entities
     * associated with the provided {@link User} and {@link Quiz}. The results are
     * sorted chronologically (oldest first). This is useful for tracking a user's
     * progress over multiple quiz attempts.</p>
     *
     * <p>Logs are generated for successful retrievals as well as any errors encountered
     * during repository access.</p>
     *
     * @param user the {@link User} whose quiz attempts are to be retrieved
     * @param quiz the {@link Quiz} for which the attempts are to be retrieved
     * @return a {@link List} of {@link QuizAttempt} objects representing all attempts
     *         made by the user for the given quiz, sorted by attempt date (ascending)
     * @throws RuntimeException if an error occurs while fetching the data from the repository
     */
    @Override
    public List<QuizAttempt> findByUserAndQuizOrderByAttemptDateAsc(User user, Quiz quiz) {
        try {
            LOGGER.info("Fetching all quiz attempts for user '{}' and quiz '{}'", user.getUsername(), quiz.getTitle());
            List<QuizAttempt> attempts = repo.findByUserAndQuizOrderByAttemptDateAsc(user, quiz);
            LOGGER.debug("Retrieved {} quiz attempts", attempts.size());
            return attempts;
        } catch (Exception ex) {
            LOGGER.error("Error fetching quiz attempts for user '{}': {}", user.getUsername(), ex.getMessage(), ex);
            throw ex;
        }
    }

    /**
     * Deletes a specific quiz attempt from the database.
     *
     * <p>This method removes the given {@link QuizAttempt} entity from the repository.
     * It is typically used when an attempt needs to be invalidated, reset, or removed
     * due to user action or administrative reasons.</p>
     *
     * <p>Informational and debug logs are generated for successful deletions,
     * while any errors encountered during the process are logged and rethrown.</p>
     *
     * @param attempt the {@link QuizAttempt} entity to be deleted; must not be {@code null}
     * @throws RuntimeException if an error occurs during the deletion process
     */
    @Override
    public void deleteAttempt(QuizAttempt attempt) {
        try {
            LOGGER.info("Deleting quiz attempt with ID: {} for user '{}'", attempt.getId(), attempt.getUser().getUsername());
            repo.delete(attempt);
            LOGGER.debug("Quiz attempt deleted successfully");
        } catch (Exception ex) {
            LOGGER.error("Error deleting quiz attempt with ID {}: {}", attempt.getId(), ex.getMessage(), ex);
            throw ex;
        }
    }

}
