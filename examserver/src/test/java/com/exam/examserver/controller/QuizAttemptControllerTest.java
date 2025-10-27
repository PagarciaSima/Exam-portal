
package com.exam.examserver.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import com.exam.examserver.model.dto.PopularQuizStatsDTO;
import com.exam.examserver.model.dto.QuizAttemptDTO;
import com.exam.examserver.model.user.User;
import com.exam.examserver.service.IQuizAttemptService;

class QuizAttemptControllerTest {

    @Mock
    private IQuizAttemptService attemptService;

    @InjectMocks
    private QuizAttemptController controller;

    public QuizAttemptControllerTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getLastAttempt_returnsQuizAttemptDTO_whenExists() {
        Long userId = 1L;
        QuizAttemptDTO dto = new QuizAttemptDTO();
        when(attemptService.getLastAttempt(any(User.class))).thenReturn(Optional.of(dto));

        ResponseEntity<?> response = controller.getLastAttempt(userId);

        assertEquals(200,  response.getStatusCode().value());
        assertEquals(dto, response.getBody());
    }

    @Test
    void getLastAttempt_returnsNoContent_whenNotExists() {
        Long userId = 2L;
        when(attemptService.getLastAttempt(any(User.class))).thenReturn(Optional.empty());

        ResponseEntity<?> response = controller.getLastAttempt(userId);

        assertEquals(204,  response.getStatusCode().value());
        assertNull(response.getBody());
    }

    @Test
    void getTopQuizzesByAttempts_returnsList() {
        List<PopularQuizStatsDTO> list = Arrays.asList(new PopularQuizStatsDTO(), new PopularQuizStatsDTO());
        when(attemptService.getTopQuizzesByAttempts()).thenReturn(list);

        ResponseEntity<List<PopularQuizStatsDTO>> response = controller.getTopQuizzesByAttempts();

        assertEquals(200,  response.getStatusCode().value());
        assertEquals(list, response.getBody());
    }

    @Test
    void getTopQuizzesByAverage_returnsList() {
        List<PopularQuizStatsDTO> list = Collections.singletonList(new PopularQuizStatsDTO());
        when(attemptService.getTopQuizzesByAverageScore()).thenReturn(list);

        ResponseEntity<List<PopularQuizStatsDTO>> response = controller.getTopQuizzesByAverage();

        assertEquals(200,  response.getStatusCode().value());
        assertEquals(list, response.getBody());
    }
}
