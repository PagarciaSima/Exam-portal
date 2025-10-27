package com.exam.examserver.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

import com.exam.examserver.model.dto.QuestionGenerationRequest;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.repository.QuizRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class GeminiServiceImplTest {

    private GeminiServiceImpl geminiService;
    
    @Mock
    private QuizRepository quizRepository;
    
    @Mock
    private RestClient restClient;
    
    private ObjectMapper objectMapper = new ObjectMapper();
    private final String apiKey = "test-key";

    @BeforeEach
    void setUp() throws Exception {
        geminiService = new GeminiServiceImpl();
        
        setPrivateField(geminiService, "quizRepository", quizRepository);
        setPrivateField(geminiService, "apiKey", apiKey);
        setPrivateField(geminiService, "restClient", restClient);
        setPrivateField(geminiService, "objectMapper", objectMapper);
    }

    private void setPrivateField(Object target, String fieldName, Object value) 
            throws Exception {
        var field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    void generateQuestionsJson_returnsValidJsonArray() throws Exception {
        Quiz quiz = new Quiz();
        quiz.setqId(1L);
        quiz.setTitle("Historia");
        quiz.setDescription("Preguntas de historia");

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));

        QuestionGenerationRequest request = new QuestionGenerationRequest();
        request.setQuizId(1L);
        request.setNumOfQuestions(1);
        request.setImage("img.png");

        String generatedJson = """
            [
              {
                "content": "¿Quién descubrió América?",
                "image": "img.png",
                "option1": "Cristóbal Colón",
                "option2": "Américo Vespucio", 
                "option3": "Marco Polo",
                "option4": "Vasco de Gama",
                "answer": "Cristóbal Colón",
                "quiz": {"qId": 1}
              }
            ]
            """.trim(); 
        
        /**
         * Simulates the Gemini API response structure
         *  Example: {
			  "candidates": [
			    {
			      "content": {
			        "parts": [
			          {
			            "text": "{\"title\":\"Hello\",\"message\":\"This is a demo\"}"
			          }
			        ]
			      }
			    }
			  ]
			}
         */
        Map<String, Object> geminiResponse = Map.of(
            "candidates", List.of(
                Map.of("content", Map.of("parts", List.of(
                    Map.of("text", generatedJson)
                )))
            )
        );

        RestClient.RequestBodyUriSpec requestBodyUriSpec = mock(RestClient.RequestBodyUriSpec.class);
        RestClient.RequestBodySpec requestBodySpec = mock(RestClient.RequestBodySpec.class);
        RestClient.ResponseSpec responseSpec = mock(RestClient.ResponseSpec.class);

        when(restClient.post()).thenReturn(requestBodyUriSpec);
        when(requestBodyUriSpec.uri(anyString())).thenReturn(requestBodySpec);
        when(requestBodySpec.body(any(Map.class))).thenReturn(requestBodySpec);
        when(requestBodySpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(Map.class)).thenReturn(geminiResponse);

        byte[] result = geminiService.generateQuestionsJson(request);

        assertNotNull(result);
        String json = new String(result);
        
        assertTrue(json.contains("\"content\""), "JSON debería contener 'content'");
        assertTrue(json.contains("¿Quién descubrió América?"), "JSON debería contener la pregunta");
        assertTrue(json.contains("\"image\""), "JSON debería contener 'image'");
        assertTrue(json.contains("\"option1\""), "JSON debería contener 'option1'");
        assertTrue(json.contains("\"answer\""), "JSON debería contener 'answer'");
        assertTrue(json.contains("\"quiz\""), "JSON debería contener 'quiz'");
        assertTrue(json.contains("\"qId\" : 1"), "JSON debería contener 'qId' : 1");
    }

    @Test
    void generateQuestionsJson_quizNotFound_throwsException() {
        when(quizRepository.findById(1L)).thenReturn(Optional.empty());

        QuestionGenerationRequest request = new QuestionGenerationRequest();
        request.setQuizId(1L);
        request.setNumOfQuestions(1);

        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> geminiService.generateQuestionsJson(request));
        assertEquals("Quiz not found", exception.getMessage());
    }
}