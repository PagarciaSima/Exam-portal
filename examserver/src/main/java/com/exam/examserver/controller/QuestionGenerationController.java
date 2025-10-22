package com.exam.examserver.controller;



import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.model.dto.QuestionGenerationRequest;
import com.exam.examserver.service.IGeminiService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/generation/questions")
public class QuestionGenerationController {

	@Autowired
    private IGeminiService geminiService;

	/**
	 * Generates multiple-choice questions using Gemini AI for a given quiz and returns them as a JSON file.
	 *
	 * @param request the QuestionGenerationRequest object containing:
	 *                - quizId: the ID of the quiz
	 *                - numOfQuestions: number of questions to generate
	 *                - image: optional image URL to attach to each question
	 * @return ResponseEntity containing the generated questions as a JSON file (questions.json)
	 *         with Content-Disposition set for file download. Returns HTTP 500 if generation fails.
	 */
	@Operation(
	    summary = "Generate questions for a quiz",
	    description = "Uses Gemini AI to generate multiple-choice questions for the specified quiz. "
	                + "The response is a JSON file containing the generated questions, ready for download.",
	    responses = {
	        @ApiResponse(
	            responseCode = "200",
	            description = "Questions generated successfully and returned as a downloadable JSON file",
	            content = @Content(mediaType = "application/json")
	        ),
	        @ApiResponse(
	            responseCode = "500",
	            description = "Error occurred while generating questions",
	            content = @Content(schema = @Schema(implementation = Map.class))
	        )
	    }
	)
    @PostMapping()
    public ResponseEntity<byte[]> generateQuestions(@RequestBody QuestionGenerationRequest request) {
        try {
            byte[] questions = geminiService.generateQuestionsJson(request);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=questions.json");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(questions);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }



}