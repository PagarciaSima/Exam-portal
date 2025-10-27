package com.exam.examserver.controller;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.exam.examserver.model.dto.QuestionGenerationRequest;
import com.exam.examserver.service.IGeminiService;

public class QuestionGenerationControllerTest {

    @InjectMocks
    private QuestionGenerationController controller;

    @Mock
    private IGeminiService geminiService;


    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generateQuestions_ReturnsJsonFile_WhenSuccess() throws Exception {
        byte[] mockJson = "[{\"question\":\"Q1\"}]".getBytes();
        when(geminiService.generateQuestionsJson(any())).thenReturn(mockJson);

        QuestionGenerationRequest request = new QuestionGenerationRequest(1L, "img.png", 5);

        ResponseEntity<byte[]> response = controller.generateQuestions(request);

        assertEquals(200,  response.getStatusCode().value());
        assertArrayEquals(mockJson, response.getBody());
        assertEquals("application/json", response.getHeaders().getContentType().toString());
        assertTrue(response.getHeaders().get("Content-Disposition").get(0).contains("attachment; filename=questions.json"));
    }

    @Test
    void generateQuestions_Returns500_WhenException() {
        when(geminiService.generateQuestionsJson(any())).thenThrow(new RuntimeException("Error"));

        QuestionGenerationRequest request = new QuestionGenerationRequest(1L, "img.png", 5);

        ResponseEntity<byte[]> response = controller.generateQuestions(request);

        assertEquals(500,  response.getStatusCode().value());
        assertNull(response.getBody());
    }
}
