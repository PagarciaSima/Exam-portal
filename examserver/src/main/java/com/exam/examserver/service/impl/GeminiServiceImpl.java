package com.exam.examserver.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.exam.examserver.model.dto.QuestionGenerationRequest;
import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.repository.QuizRepository;
import com.exam.examserver.service.IGeminiService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiServiceImpl implements IGeminiService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(GeminiServiceImpl.class);

    @Autowired
    private QuizRepository quizRepository;

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL =
    	    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generates multiple-choice questions for a given quiz using the Gemini AI API.
     *
     * <p>This method builds a prompt for the AI, sends it to Gemini, parses the JSON response,
     * assigns images and quiz references to the generated questions, and returns a simplified JSON array
     * as a byte array suitable for download or further processing.</p>
     *
     * @param request the QuestionGenerationRequest containing the quizId, number of questions, and optional image
     * @return a byte array representing the JSON array of generated questions
     * @throws RuntimeException if the quiz is not found or there is an error during question generation or parsing
     */
    @SuppressWarnings("unchecked")
    @Override
    public byte[] generateQuestionsJson(QuestionGenerationRequest request) {
        LOGGER.info("Starting question generation for quizId {} with {} questions", 
                    request.getQuizId(), request.getNumOfQuestions());

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> {
                    LOGGER.error("Quiz not found for id {}", request.getQuizId());
                    return new RuntimeException("Quiz not found");
                });

        String prompt = buildPrompt(quiz, request);
        LOGGER.debug("Generated prompt for Gemini API: {}", prompt);

        try {
            // CREATE REQUEST BODY
            Map<String, Object> promptPart = Map.of("text", prompt);
            Map<String, Object> contentObject = Map.of("parts", List.of(promptPart));
            Map<String, Object> geminiRequest = Map.of(
                "contents", List.of(contentObject),
                "generationConfig", Map.of(
                    "temperature", 0.7,
                    "maxOutputTokens", 1500
                )
            );

            // GEMINI CALL
            LOGGER.info("Calling Gemini API...");
            Map<String, Object> response = restTemplate.postForObject(
                    GEMINI_URL + apiKey,
                    geminiRequest,
                    Map.class
            );
            LOGGER.debug("Gemini API response: {}", response);

            // EXTRACT GENERATED TEXT
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> contentMap = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
            String generatedText = (String) parts.get(0).get("text");
            LOGGER.debug("Generated JSON text: {}", generatedText);

            // PARSE RESPONSE JSON
            List<Question> questions = objectMapper.readValue(
                    generatedText,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Question.class)
            );
            LOGGER.info("Parsed {} questions from Gemini response", questions.size());

            // ASSIGN IMAGE AND QUIZ
            for (Question q : questions) {
                q.setImage(request.getImage());
                q.setQuiz(quiz);
            }

            // GENERATE SIMPLIFIED RESPONSE
            List<Map<String, Object>> simplified = questions.stream().map(q -> {
                Map<String, Object> map = new HashMap<>();
                map.put("content", q.getContent());
                map.put("image", q.getImage());
                map.put("option1", q.getOption1());
                map.put("option2", q.getOption2());
                map.put("option3", q.getOption3());
                map.put("option4", q.getOption4());
                map.put("answer", q.getAnswer());
                Map<String, Object> quizMap = new HashMap<>();
                quizMap.put("qId", q.getQuiz().getqId());
                map.put("quiz", quizMap);
                return map;
            }).collect(Collectors.toList());

            LOGGER.info("Returning simplified JSON with {} questions", simplified.size());

            // RETURN JSON BYTES
            return objectMapper.writeValueAsBytes(simplified);

        } catch (Exception e) {
            LOGGER.error("Error generating questions: {}", e.getMessage(), e);
            throw new RuntimeException("Error generating questions: " + e.getMessage(), e);
        }
    }

    
    /**
     * Builds the prompt string to send to the Gemini AI API for generating multiple-choice questions.
     *
     * <p>The generated prompt instructs the AI to create a specific number of questions for a given quiz,
     * using a predefined JSON structure. It ensures that the "answer" field contains the full text of the correct
     * option and that no extra fields are included. This prompt is intended to produce a valid JSON array of questions.</p>
     *
     * @param quiz the Quiz object containing the quiz title, description, and ID
     * @param request the QuestionGenerationRequest containing the number of questions to generate and optional image URL
     * @return a String containing the formatted prompt ready to be sent to the Gemini AI API
     */
    private String buildPrompt(Quiz quiz, QuestionGenerationRequest request) {
        return """
            Generate exactly %d multiple-choice questions about the topic: '%s' - %s.
            Each question must be a JSON object following this exact structure:
            {
              "content": "<question text>",
              "image": "%s",
              "option1": "<option1>",
              "option2": "<option2>",
              "option3": "<option3>",
              "option4": "<option4>",
              "answer": "<correct option>",
              "quiz": {"qId": %d}
            }
            Return the response as a JSON array of these objects, without extra text.
            Make sure that the 'answer' field contains the **full text** of the correct answer, not the option key (like 'option1').
            Do not include any extra fields like quesId, givenAnswer, and regarding the quiz only provide its qId.

            """.formatted(
                request.getNumOfQuestions(),
                quiz.getTitle(),
                quiz.getDescription(),
                request.getImage(),
                quiz.getqId()
        );
    }

}
