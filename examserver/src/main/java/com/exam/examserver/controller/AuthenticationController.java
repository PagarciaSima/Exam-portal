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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.config.JwtUtil;
import com.exam.examserver.model.ErrorResponse;
import com.exam.examserver.model.JwtRequest;
import com.exam.examserver.model.JwtResponse;

/**
 * Controller responsible for handling user authentication
 * and JWT token generation.
 */
@RestController
@CrossOrigin("*")
public class AuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private UserDetailsService userDetailService;
	@Autowired
	private JwtUtil jwtUtils;
	
	final static Logger LOGGER = LoggerFactory.getLogger(AuthenticationController.class);
	
	/**
	 * Authenticates a user and generates a JWT token upon successful login.
	 *
	 * <p>This endpoint accepts a {@link JwtRequest} containing the username and password,
	 * attempts to authenticate the user, and returns a JWT token if authentication succeeds.
	 * In case of authentication failure, appropriate HTTP status codes and error messages
	 * are returned:
	 * <ul>
	 *   <li>404 - User not found</li>
	 *   <li>403 - User account is disabled</li>
	 *   <li>401 - Invalid username or password</li>
	 *   <li>500 - Internal server error for unexpected exceptions</li>
	 * </ul>
	 *
	 * @param jwtRequest the login request containing username and password
	 * @return {@link ResponseEntity} containing either a {@link JwtResponse} with the token
	 *         or an {@link ErrorResponse} with the corresponding error message
	 */
	@PostMapping("/generate-token")
	public ResponseEntity<?> generateToken(@RequestBody JwtRequest jwtRequest) {
	    LOGGER.info("Attempting authentication for user: {}", jwtRequest.getUsername());

	    try {
	        authenticate(jwtRequest.getUsername(), jwtRequest.getPassword());

	        UserDetails userDetails = this.userDetailService.loadUserByUsername(jwtRequest.getUsername());
	        String authToken = this.jwtUtils.generateToken(userDetails);

	        LOGGER.info("JWT token generated successfully for user: {}", jwtRequest.getUsername());
	        return ResponseEntity.ok(new JwtResponse(authToken));

	    } catch (UsernameNotFoundException e) {
	        LOGGER.error("User not found: {}", jwtRequest.getUsername());
	        return ResponseEntity
	                .status(404)
	                .body(new ErrorResponse("User not found"));
	    } catch (DisabledException e) {
	        LOGGER.warn("User {} is disabled", jwtRequest.getUsername());
	        return ResponseEntity
	                .status(403)
	                .body(new ErrorResponse("User account is disabled"));
	    } catch (BadCredentialsException e) {
	        LOGGER.warn("Invalid credentials for user {}", jwtRequest.getUsername());
	        return ResponseEntity
	                .status(401)
	                .body(new ErrorResponse("Invalid username or password"));
	    } catch (Exception e) {
	        LOGGER.error("Unexpected error during authentication", e);
	        return ResponseEntity
	                .status(500)
	                .body(new ErrorResponse("Internal server error"));
	    }
	}

	
    /**
     * Authenticates the user using provided username and password.
     *
     * @param username user's username
     * @param password user's password
     */
	private void authenticate(String username, String password) {
	    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
	    LOGGER.info("User {} authenticated successfully", username);
	}
}
