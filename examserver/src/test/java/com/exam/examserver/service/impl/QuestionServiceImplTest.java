
package com.exam.examserver.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.repository.QuestionRepository;

class QuestionServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;

    @InjectMocks
    private QuestionServiceImpl questionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addQuestion_shouldSaveQuestion() {
        Question question = new Question();
        when(questionRepository.save(question)).thenReturn(question);

        Question result = questionService.addQuestion(question);

        assertEquals(question, result);
        verify(questionRepository).save(question);
    }

    @Test
    void updateQuestion_shouldUpdateIfExists() {
        Question question = new Question();
        question.setQuesId(1L);
        when(questionRepository.existsById(1L)).thenReturn(true);
        when(questionRepository.save(question)).thenReturn(question);

        Question result = questionService.updateQuestion(question);

        assertEquals(question, result);
        verify(questionRepository).save(question);
    }

    @Test
    void updateQuestion_shouldThrowIfNotExists() {
        Question question = new Question();
        question.setQuesId(2L);
        when(questionRepository.existsById(2L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> questionService.updateQuestion(question));
    }

    @Test
    void getQuestions_shouldReturnQuestionsForQuiz() {
        Quiz quiz = new Quiz();
        quiz.setqId(1L);
        quiz.setTitle("Test Quiz");
        
        Set<Question> questions = new HashSet<>();
        questions.add(new Question());
        questions.add(new Question());
        
        when(questionRepository.findByQuiz(quiz)).thenReturn(questions);

        Set<Question> result = questionService.getQuestions(quiz);

        assertEquals(2, result.size());
        verify(questionRepository).findByQuiz(quiz);
    }

    @Test
    void getQuestion_shouldReturnIfExists() {
        Question question = new Question();
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));

        Question result = questionService.getQuestion(1L);

        assertEquals(question, result);
    }

    @Test
    void getQuestion_shouldThrowIfNotExists() {
        when(questionRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> questionService.getQuestion(2L));
    }

    @Test
    void deleteQuestion_shouldDeleteIfExists() {
        when(questionRepository.existsById(1L)).thenReturn(true);

        questionService.deleteQuestion(1L);

        verify(questionRepository).deleteById(1L);
    }

    @Test
    void deleteQuestion_shouldThrowIfNotExists() {
        when(questionRepository.existsById(2L)).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> questionService.deleteQuestion(2L));
    }

    @Test
    void saveAll_shouldSaveQuestions() {
        List<Question> questions = List.of(new Question(), new Question());
        when(questionRepository.saveAll(questions)).thenReturn(questions);

        List<Question> result = questionService.saveAll(questions);

        assertEquals(2, result.size());
        verify(questionRepository).saveAll(questions);
    }

    @Test
    void saveAll_shouldReturnEmptyIfNullOrEmpty() {
        List<Question> result1 = questionService.saveAll(null);
        List<Question> result2 = questionService.saveAll(Collections.emptyList());

        assertTrue(result1.isEmpty());
        assertTrue(result2.isEmpty());
        verify(questionRepository, never()).saveAll(any());
    }
}
