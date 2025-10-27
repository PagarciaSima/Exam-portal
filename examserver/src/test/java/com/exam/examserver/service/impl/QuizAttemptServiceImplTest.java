package com.exam.examserver.service.impl;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.exam.examserver.model.dto.PopularQuizStatsDTO;
import com.exam.examserver.model.dto.QuizAttemptDTO;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.model.exam.quizattempt.QuizAttempt;
import com.exam.examserver.model.user.User;
import com.exam.examserver.repository.QuizAttemptRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

@SpringBootTest
class QuizAttemptServiceImplTest {

    @Mock
    private QuizAttemptRepository repo;

    @InjectMocks
    private QuizAttemptServiceImpl service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveAttempt_deberiaGuardarIntento() {
        User user = new User();
        user.setUsername("usuario");
        Quiz quiz = new Quiz();
        quiz.setTitle("Quiz 1");
        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setQuiz(quiz);

        when(repo.save(attempt)).thenReturn(attempt);

        QuizAttempt resultado = service.saveAttempt(attempt);

        assertNotNull(resultado);
        verify(repo, times(1)).save(attempt);
    }

	@Test
	void getLastAttempts_deberiaRetornarListaDTO() {
	    User user = new User();
	    Quiz quiz = new Quiz();
	    quiz.setMaxMarks(100);
	
	    QuizAttempt attempt1 = new QuizAttempt();
	    attempt1.setQuiz(quiz);
	
	    QuizAttempt attempt2 = new QuizAttempt();
	    attempt2.setQuiz(quiz);
	
	    List<QuizAttempt> attempts = List.of(attempt1, attempt2);
	    when(repo.findTop10ByUserOrderByAttemptDateDesc(user)).thenReturn(attempts);
	
	    List<QuizAttemptDTO> result = service.getLastAttempts(user);
	
	    assertEquals(2, result.size());
	    verify(repo, times(1)).findTop10ByUserOrderByAttemptDateDesc(user);
	}

    @Test
    void getLastAttempt_deberiaRetornarOptionalDTO() {
        User user = new User();
        QuizAttempt attempt = new QuizAttempt();
        Quiz quiz = new Quiz();
        quiz.setMaxMarks(100); 
        attempt.setQuiz(quiz);
        when(repo.findTopByUserOrderByAttemptDateDesc(user)).thenReturn(Optional.of(attempt));

        Optional<QuizAttemptDTO> result = service.getLastAttempt(user);

        assertTrue(result.isPresent());
        verify(repo, times(1)).findTopByUserOrderByAttemptDateDesc(user);
    }
    
    @Test
    void findByUserAndQuizOrderByAttemptDateAsc_deberiaRetornarIntentos() {
        User user = new User();
        Quiz quiz = new Quiz();
        List<QuizAttempt> attempts = List.of(new QuizAttempt());
        when(repo.findByUserAndQuizOrderByAttemptDateAsc(user, quiz)).thenReturn(attempts);

        List<QuizAttempt> result = service.findByUserAndQuizOrderByAttemptDateAsc(user, quiz);

        assertEquals(1, result.size());
        verify(repo, times(1)).findByUserAndQuizOrderByAttemptDateAsc(user, quiz);
    }

    @Test
    void deleteAttempt_deberiaEliminarIntento() {
        QuizAttempt attempt = new QuizAttempt();
        User user = new User();
        user.setUsername("usuario");
        attempt.setUser(user);

        service.deleteAttempt(attempt);

        verify(repo, times(1)).delete(attempt);
    }

    @Test
    void getTopQuizzesByAttempts_deberiaRetornarStats() {
        List<PopularQuizStatsDTO> stats = List.of(new PopularQuizStatsDTO());
        when(repo.findTopQuizzesByAttempts()).thenReturn(stats);

        List<PopularQuizStatsDTO> result = service.getTopQuizzesByAttempts();

        assertEquals(1, result.size());
        verify(repo, times(1)).findTopQuizzesByAttempts();
    }

    @Test
    void getTopQuizzesByAverageScore_deberiaRetornarStats() {
        List<PopularQuizStatsDTO> stats = List.of(new PopularQuizStatsDTO());
        when(repo.findTopQuizzesByAverageScore()).thenReturn(stats);

        List<PopularQuizStatsDTO> result = service.getTopQuizzesByAverageScore();

        assertEquals(1, result.size());
        verify(repo, times(1)).findTopQuizzesByAverageScore();
    }
}
