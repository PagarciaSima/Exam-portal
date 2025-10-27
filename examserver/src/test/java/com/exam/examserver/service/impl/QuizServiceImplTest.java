
package com.exam.examserver.service.impl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.*;

import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.repository.QuizRepository;
import com.exam.examserver.repository.QuestionRepository;

class QuizServiceImplTest {

    @Mock
    private QuizRepository quizRepository;
    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private QuizServiceImpl quizService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAddQuiz() {
        Quiz quiz = new Quiz();
        quiz.setTitle("Test Quiz");
        when(quizRepository.save(quiz)).thenReturn(quiz);

        Quiz result = quizService.addQuiz(quiz);
        assertEquals("Test Quiz", result.getTitle());
        verify(quizRepository).save(quiz);
    }

    @Test
    void testUpdateQuiz_QuizExists() {
        Quiz quiz = new Quiz();
        quiz.setqId(1L);
        when(quizRepository.existsById(1L)).thenReturn(true);
        when(quizRepository.save(quiz)).thenReturn(quiz);

        Quiz result = quizService.updateQuiz(quiz);
        assertEquals(quiz, result);
        verify(quizRepository).save(quiz);
    }

    @Test
    void testUpdateQuiz_QuizNotExists() {
        Quiz quiz = new Quiz();
        quiz.setqId(2L);
        when(quizRepository.existsById(2L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> quizService.updateQuiz(quiz));
    }

    @Test
    void testGetQuizzes() {
        List<Quiz> quizzes = Arrays.asList(new Quiz(), new Quiz());
        when(quizRepository.findAll()).thenReturn(quizzes);

        Set<Quiz> result = quizService.getQuizzes();
        assertEquals(2, result.size());
        verify(quizRepository).findAll();
    }

    @Test
    void testGetQuiz_Found() {
        Quiz quiz = new Quiz();
        quiz.setqId(1L);
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));

        Quiz result = quizService.getQuiz(1L);
        assertEquals(quiz, result);
    }

    @Test
    void testGetQuiz_NotFound() {
        when(quizRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> quizService.getQuiz(99L));
    }

    @Test
    void testDeleteQuiz_Found() {
        Quiz quiz = new Quiz();
        quiz.setqId(1L);
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));

        quizService.deleteQuiz(1L);
        verify(quizRepository).delete(quiz);
    }

    @Test
    void testDeleteQuiz_NotFound() {
        when(quizRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> quizService.deleteQuiz(99L));
    }

    @Test
    void testGetQuizzesPaged() {
        Page<Quiz> page = new PageImpl<>(List.of(new Quiz()));
        when(quizRepository.findAll(any(Pageable.class))).thenReturn(page);

        Page<Quiz> result = quizService.getQuizzesPaged(0, 1, null);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetQuestionsByQuizPaged() {
        Quiz quiz = new Quiz();
        quiz.setqId(1L);
        List<Question> questions = Arrays.asList(new Question(), new Question());
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findByQuiz_qId(1L)).thenReturn(questions);

        Page<Question> result = quizService.getQuestionsByQuizPaged(1L, 0, 2);
        assertEquals(2, result.getTotalElements());
    }
}
