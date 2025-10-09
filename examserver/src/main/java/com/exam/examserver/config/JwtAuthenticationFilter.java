package com.exam.examserver.config;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{

	@Autowired
	private UserDetailsService userDetailsService;
	@Autowired
	private JwtUtil jwtUtil;
	private static final Logger LOGGER = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
	
	
	/**
	 * Processes incoming HTTP requests to extract and validate a JWT token.
	 * <p>
	 * This filter performs the following steps:
	 * <ol>
	 *   <li>Extracts the JWT token from the Authorization header.</li>
	 *   <li>Parses the token to obtain the username.</li>
	 *   <li>Validates the token and sets the authentication in the SecurityContext if valid.</li>
	 * </ol>
	 * <p>
	 * After processing the token, the request is passed along the filter chain.
	 *
	 * @param request  the HttpServletRequest containing the incoming request details
	 * @param response the HttpServletResponse for sending responses
	 * @param filterChain the FilterChain to pass the request and response to the next filter
	 * @throws ServletException if an error occurs during request processing
	 * @throws IOException if an I/O error occurs during request processing
	 */
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
	        throws ServletException, IOException {

	    String clientIp = request.getRemoteAddr();
	    String endpoint = request.getRequestURI();

	    String jwtToken = extractJwtFromHeader(request, endpoint, clientIp);
	    if (jwtToken != null) {
	        String username = getUsernameFromToken(jwtToken,request, endpoint, clientIp);
	        if (username != null) {
	            authenticateUser(jwtToken, username, request, endpoint, clientIp);
	        }
	    }

	    filterChain.doFilter(request, response);
	}

	/**
	 * Extracts JWT token from the Authorization header.
	 */
	private String extractJwtFromHeader(HttpServletRequest request, String endpoint, String clientIp) {
	    String header = request.getHeader("Authorization");
	    LOGGER.debug("Incoming request [{}] from IP [{}], Authorization header: {}", endpoint, clientIp, header);

	    if (header != null && header.startsWith("Bearer ")) {
	        return header.substring(7);
	    } else {
	        LOGGER.warn("Missing or invalid Authorization header for request [{}] from IP [{}]", endpoint, clientIp);
	        return null;
	    }
	}

	/**
	 * Extracts username from JWT token and handles exceptions.
	 */
	private String getUsernameFromToken(String token,HttpServletRequest request, String endpoint, String clientIp) {
	    try {
	        return this.jwtUtil.extractUsername(token);
	    } catch (ExpiredJwtException e) {
	        LOGGER.warn("JWT token has expired for request [{}] from IP [{}]", endpoint, clientIp, e);
	        request.setAttribute("exception", e);
	    } catch (Exception e) {
	        LOGGER.error("Error parsing JWT token for request [{}] from IP [{}]", endpoint, clientIp, e);
	    }
	    return null;
	}

	/**
	 * Validates the token and sets authentication in the SecurityContext if valid.
	 */
	private void authenticateUser(String token, String username, HttpServletRequest request, String endpoint, String clientIp) {
	    if (SecurityContextHolder.getContext().getAuthentication() != null) {
	        return; // Already authenticated
	    }

	    try {
	        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
	        if (this.jwtUtil.validateToken(token, userDetails)) {
	            LOGGER.debug("Valid JWT token for user [{}] on request [{}] from IP [{}]", username, endpoint, clientIp);

	            UsernamePasswordAuthenticationToken authToken =
	                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
	            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

	            SecurityContextHolder.getContext().setAuthentication(authToken);
	        } else {
	            LOGGER.warn("Invalid JWT token for user [{}] on request [{}] from IP [{}]", username, endpoint, clientIp);
	        }
	    } catch (Exception e) {
	        LOGGER.error("Error validating JWT token for user [{}] on request [{}] from IP [{}]", username, endpoint, clientIp, e);
	    }
	}


}
