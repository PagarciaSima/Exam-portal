package com.exam.examserver.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.config.JwtUtil;
import com.exam.examserver.model.JwtRequest;
import com.exam.examserver.model.JwtResponse;

/**
 * Controller responsible for handling user authentication
 * and JWT token generation.
 */
@RestController
public class AuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private UserDetailsService userDetailService;
	@Autowired
	private JwtUtil jwtUtils;
	
	final static Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);
	
    /**
     * Generates JWT token for authenticated users.
     *
     * @param jwtRequest containing username and password
     * @return ResponseEntity with JWT token
     * @throws Exception if authentication fails or user not found
     */
    @PostMapping("/generate-token")
    public ResponseEntity<JwtResponse> generateToken(@RequestBody JwtRequest jwtRequest) throws Exception {
        LOGGER.info("Attempting authentication for user: {}", jwtRequest.getUsername());

        try {
            authenticate(jwtRequest.getUsername(), jwtRequest.getPassword());
        } catch (UsernameNotFoundException e) {
            LOGGER.error("User not found: {}", jwtRequest.getUsername());
            throw new Exception("User not found", e);
        }

        UserDetails userDetails = this.userDetailService.loadUserByUsername(jwtRequest.getUsername());
        String authToken = this.jwtUtils.generateToken(userDetails);

        LOGGER.info("JWT token generated successfully for user: {}", jwtRequest.getUsername());
        return ResponseEntity.ok(new JwtResponse(authToken));
    }
	
    /**
     * Authenticates the user using provided username and password.
     *
     * @param username user's username
     * @param password user's password
     * @throws Exception if authentication fails
     */
    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
            LOGGER.info("User {} authenticated successfully", username);
        } catch (DisabledException e) {
            LOGGER.warn("User {} is disabled", username);
            throw new Exception("User Disabled: " + e.getMessage(), e);
        } catch (BadCredentialsException e) {
            LOGGER.warn("Invalid credentials for user {}", username);
            throw new Exception("Invalid Credentials: " + e.getMessage(), e);
        }
    }
}
