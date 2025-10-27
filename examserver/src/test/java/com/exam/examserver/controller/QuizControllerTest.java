
package com.exam.examserver.controller;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;

import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.service.IQuizService;

import jakarta.servlet.http.HttpSession;

class QuizControllerTest {

    @Mock
    private IQuizService quizService;

    @InjectMocks
    private QuizController controller;

    @Mock
    private HttpSession session;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addQuiz_returnsCreatedQuiz() {
        Quiz quiz = new Quiz();
        quiz.setTitle("Nuevo Quiz");
        when(quizService.addQuiz(any(Quiz.class))).thenReturn(quiz);

        ResponseEntity<?> response = controller.addQuiz(quiz);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(quiz, response.getBody());
    }

    @Test
    void updateQuiz_returnsUpdatedQuiz() {
        Quiz quiz = new Quiz();
        quiz.setqId(1L);
        when(quizService.updateQuiz(any(Quiz.class))).thenReturn(quiz);

        ResponseEntity<?> response = controller.updateQuiz(quiz);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(quiz, response.getBody());
    }

    @Test
    void getQuizzes_returnsAllQuizzes() {
        Set<Quiz> quizzes = new HashSet<>();
        quizzes.add(new Quiz());
        when(quizService.getQuizzes()).thenReturn(quizzes);

        ResponseEntity<?> response = controller.getQuizzes();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(quizzes, response.getBody());
    }

    @Test
    void getQuizzesPaged_returnsPage() {
        Page<Quiz> page = new PageImpl<>(List.of(new Quiz()));
        when(quizService.getQuizzesPaged(anyInt(), anyInt(), any())).thenReturn(page);

        ResponseEntity<?> response = controller.getQuizzesPaged(0, 10, null, null, null);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(page, response.getBody());
    }

    @Test
    void getQuiz_returnsQuizById() {
        Quiz quiz = new Quiz();
        quiz.setqId(1L);
        when(quizService.getQuiz(1L)).thenReturn(quiz);

        ResponseEntity<?> response = controller.getQuiz(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(quiz, response.getBody());
    }

    @Test
    void deleteQuiz_returnsOk() {
        doNothing().when(quizService).deleteQuiz(1L);

        ResponseEntity<Void> response = controller.deleteQuiz(1L);

        assertEquals(200, response.getStatusCode().value());
        assertNull(response.getBody());
    }

    @Test
    void submitQuiz_clearsSessionAndReturnsOk() {
        doNothing().when(session).removeAttribute(anyString());

        ResponseEntity<?> response = controller.submitQuiz(1L, 2L, session);

        assertEquals(200, response.getStatusCode().value());
        assertEquals("Quiz submitted, session cleared", response.getBody());
    }
}
