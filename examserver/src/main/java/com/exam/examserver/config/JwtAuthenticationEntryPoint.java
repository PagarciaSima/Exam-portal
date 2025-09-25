package com.exam.examserver.config;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.ExpiredJwtException;


@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        
        final Exception exception = (Exception) request.getAttribute("exception");

        String message = "Unauthorized";

        if (exception != null) {
            if (exception instanceof ExpiredJwtException) {
                message = "JWT Token has expired";
            } else {
                message = exception.getMessage();
            }
        } else if (authException.getCause() instanceof ExpiredJwtException) {
            message = "JWT Token has expired";
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
}