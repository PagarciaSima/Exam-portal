
package com.exam.examserver.controller;

import com.exam.examserver.config.JwtUtil;
import com.exam.examserver.model.dto.ErrorResponse;
import com.exam.examserver.model.jwt.JwtRequest;
import com.exam.examserver.model.jwt.JwtResponse;
import com.exam.examserver.model.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import java.security.Principal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthenticationControllerTest {

    @InjectMocks
    private AuthenticationController authenticationController;

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private UserDetailsService userDetailsService;
    @Mock
    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generateToken_success() {
        JwtRequest request = new JwtRequest("user", "pass");
        UserDetails userDetails = mock(UserDetails.class);

        when(userDetailsService.loadUserByUsername("user")).thenReturn(userDetails);
        when(jwtUtil.generateToken(userDetails)).thenReturn("token");

        ResponseEntity<?> response = authenticationController.generateToken(request);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof JwtResponse);
        assertEquals("token", ((JwtResponse) response.getBody()).getToken());
    }

    @Test
    void generateToken_userNotFound() {
        JwtRequest request = new JwtRequest("user", "pass");
        when(userDetailsService.loadUserByUsername("user")).thenThrow(new org.springframework.security.core.userdetails.UsernameNotFoundException(""));

        ResponseEntity<?> response = authenticationController.generateToken(request);

        assertEquals(404, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof ErrorResponse);
    }

    @Test
    void generateToken_disabledException() {
        JwtRequest request = new JwtRequest("user", "pass");
        doThrow(new DisabledException("")).when(authenticationManager).authenticate(any());

        ResponseEntity<?> response = authenticationController.generateToken(request);

        assertEquals(403, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof ErrorResponse);
    }

    @Test
    void generateToken_badCredentials() {
        JwtRequest request = new JwtRequest("user", "pass");
        doThrow(new BadCredentialsException("")).when(authenticationManager).authenticate(any());

        ResponseEntity<?> response = authenticationController.generateToken(request);

        assertEquals(401, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof ErrorResponse);
    }

    @Test
    void generateToken_internalError() {
        JwtRequest request = new JwtRequest("user", "pass");
        doThrow(new RuntimeException("")).when(authenticationManager).authenticate(any());

        ResponseEntity<?> response = authenticationController.generateToken(request);

        assertEquals(500, response.getStatusCode().value());
        assertTrue(response.getBody() instanceof ErrorResponse);
    }

    @Test
    void getCurrentUser_returnsUser() {
        Principal principal = () -> "user";
        User user = new User();
        when(userDetailsService.loadUserByUsername("user")).thenReturn(user);

        User result = authenticationController.getCurrentUser(principal);

        assertEquals(user, result);
    }
}
