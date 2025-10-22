package com.exam.examserver.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.model.dto.QuizAttemptDTO;
import com.exam.examserver.model.user.User;
import com.exam.examserver.service.IQuizAttemptService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/quiz-attempts")
@CrossOrigin("*")
@Tag(name = "Quiz Attempts", description = "API for managing user quiz history")
public class QuizAttemptController {

    @Autowired
    private IQuizAttemptService attemptService;

    /**
     * Retrieves the most recent quiz attempt for a specific user.
     *
     * <p>If the user has no quiz attempts, this endpoint returns HTTP 204 (No Content).
     * Otherwise, it returns the latest {@link QuizAttemptDTO} with HTTP 200 (OK).</p>
     *
     * @param userId the ID of the {@link User} whose last quiz attempt is requested
     * @return a {@link ResponseEntity} containing:
     *         <ul>
     *             <li>HTTP 200 (OK) with the {@link QuizAttemptDTO} of the last attempt, if available</li>
     *             <li>HTTP 204 (No Content) if the user has no attempts</li>
     *         </ul>
     */
    @Operation(
        summary = "Get last quiz attempt for a user",
        description = "Fetches the most recent quiz attempt made by the user identified by userId",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Successfully retrieved the last quiz attempt",
                content = @Content(schema = @Schema(implementation = QuizAttemptDTO.class))
            ),
            @ApiResponse(
                responseCode = "204",
                description = "No quiz attempts found for the user",
                content = @Content
            ),
            @ApiResponse(
                responseCode = "404",
                description = "User not found",
                content = @Content
            )
        }
    )
    @GetMapping("/last/{userId}")
    public ResponseEntity<?> getLastAttempt(@PathVariable Long userId) {
        User user = new User();
        user.setId(userId);

        Optional<QuizAttemptDTO> lastAttempt = attemptService.getLastAttempt(user);

        return lastAttempt
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

}
