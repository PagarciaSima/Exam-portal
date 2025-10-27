
package com.exam.examserver.controller;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.service.IQuestionService;
import com.exam.examserver.service.IQuizService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.ResponseEntity;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

@SpringBootTest
class QuestionControllerTest {

    @Mock
    private IQuestionService questionService;
    @Mock
    private IQuizService quizService;

    @InjectMocks
    private QuestionController questionController;

    @Test
    void testAddQuestion() {
        Question question = new Question();
        question.setContent("¿Capital de Francia?");
        question.setAnswer("París");

        when(questionService.addQuestion(any(Question.class))).thenReturn(question);

        ResponseEntity<?> response = questionController.addQuestion(question);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(question, response.getBody());
        verify(questionService, times(1)).addQuestion(question);
    }

    @Test
    void testUpdateQuestion() {
        Question question = new Question();
        question.setQuesId(1L);
        question.setContent("¿Capital de España?");
        question.setAnswer("Madrid");

        when(questionService.updateQuestion(any(Question.class))).thenReturn(question);

        ResponseEntity<?> response = questionController.updateQuestion(question);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(question, response.getBody());
        verify(questionService, times(1)).updateQuestion(question);
    }

    @Test
    void testGetQuestionsByQuiz() {
        Quiz quiz = new Quiz();
        quiz.setqId(1L);
        quiz.setTitle("Geografía");
        quiz.setNumberOfQuestions(1);

        Question question = new Question();
        question.setQuesId(1L);
        question.setQuiz(quiz);

        Set<Question> questions = new HashSet<>();
        questions.add(question);
        quiz.setQuestions(questions);

        when(quizService.getQuiz(1L)).thenReturn(quiz);

        ResponseEntity<?> response = questionController.getQuestionsByQuiz(1L);

        assertEquals(200, response.getStatusCode().value());
        List<?> result = (List<?>) response.getBody();
        assertEquals(1, result.size());
    }

    @Test
    void testDeleteQuestion() {
        doNothing().when(questionService).deleteQuestion(1L);

        ResponseEntity<Void> response = questionController.deleteQuestion(1L);

        assertEquals(200, response.getStatusCode().value());
        verify(questionService, times(1)).deleteQuestion(1L);
    }

    @Test
    void testGetQuestion() {
        Question question = new Question();
        question.setQuesId(1L);
        question.setContent("¿Capital de Italia?");
        question.setAnswer("Roma");

        when(questionService.getQuestion(1L)).thenReturn(question);

        ResponseEntity<Question> response = questionController.getQuestion(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(question, response.getBody());
        verify(questionService, times(1)).getQuestion(1L);
    }
}
