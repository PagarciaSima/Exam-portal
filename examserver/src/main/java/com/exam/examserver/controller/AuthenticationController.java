package com.exam.examserver.controller;

import java.security.Principal;

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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.config.JwtUtil;
import com.exam.examserver.model.dto.ErrorResponse;
import com.exam.examserver.model.jwt.JwtRequest;
import com.exam.examserver.model.jwt.JwtResponse;
import com.exam.examserver.model.user.User;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller responsible for handling user authentication
 * and JWT token generation.
 */
@RestController
@CrossOrigin("*")
@Tag(name = "Authentication", description = "API for authentication")
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
	@Operation(
		    summary = "Authenticate user and generate JWT token",
		    description = "Validates user credentials and returns a JWT token for authenticated access.",
		    responses = {
		        @ApiResponse(
		            responseCode = "200",
		            description = "User successfully authenticated. JWT token provided.",
		            content = @Content(
		                mediaType = "application/json",
		                schema = @Schema(implementation = JwtResponse.class)
		            )
		        ),
		        @ApiResponse(
		            responseCode = "401",
		            description = "Unauthorized. Invalid username or password.",
		            content = @Content(
		                mediaType = "application/json",
		                schema = @Schema(implementation = ErrorResponse.class)
		            )
		        ),
		        @ApiResponse(
		            responseCode = "403",
		            description = "User account is disabled.",
		            content = @Content(
		                mediaType = "application/json",
		                schema = @Schema(implementation = ErrorResponse.class)
		            )
		        ),
		        @ApiResponse(
		            responseCode = "404",
		            description = "User not found.",
		            content = @Content(
		                mediaType = "application/json",
		                schema = @Schema(implementation = ErrorResponse.class)
		            )
		        ),
		        @ApiResponse(
		            responseCode = "500",
		            description = "Internal server error.",
		            content = @Content(
		                mediaType = "application/json",
		                schema = @Schema(implementation = ErrorResponse.class)
		            )
		        )
		    }
		)
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
     * Retrieves the currently authenticated user.
     *
     * <p>This endpoint uses the {@link Principal} object provided by Spring Security
     * to obtain the username of the logged-in user. It then loads the user details
     * from the {@link UserDetailsService} and returns the corresponding {@link User} object.</p>
     *
     * @param principal the security principal representing the authenticated user
     * @return the {@link User} entity corresponding to the authenticated username
     */
	@Operation(
		    summary = "Get currently authenticated user",
		    description = "Retrieves the currently authenticated user's information using the Principal object.",
		    responses = {
		        @ApiResponse(
		            responseCode = "200",
		            description = "Authenticated user retrieved successfully",
		            content = @Content(
		                mediaType = "application/json",
		                schema = @Schema(implementation = User.class)
		            )
		        ),
		        @ApiResponse(
		            responseCode = "401",
		            description = "Unauthorized. No valid JWT token provided",
		            content = @Content(
		                mediaType = "application/json",
		                schema = @Schema(implementation = ErrorResponse.class)
		            )
		        )
		    }
		)
	@GetMapping("/current-user")
	public User getCurrentUser(Principal principal) {
		return ((User)this.userDetailService.loadUserByUsername(principal.getName()));
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
