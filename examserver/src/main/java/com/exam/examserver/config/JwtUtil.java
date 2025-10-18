package com.exam.examserver.config;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private String SECRET_KEY = "ExamPortal123456654321ExamPortal123456654321ExamPortal123456654321";
	
	/**
	 * Generates a secure {@link SecretKey} instance from the predefined secret string.
	 * <p>
	 * This method converts the secret key string into a byte array using UTF-8 encoding,
	 * and then derives a valid HMAC-SHA key using {@link io.jsonwebtoken.security.Keys#hmacShaKeyFor(byte[])}.
	 * The resulting {@code SecretKey} is suitable for signing and verifying JWTs
	 * using HMAC algorithms such as HS256, HS384, or HS512.
	 * </p>
	 *
	 * @return a securely derived {@link SecretKey} for JWT signing and verification
	 */
	private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

	/**
	 * Extracts the username (subject) from the JWT token.
	 *
	 * @param token the JWT token
	 * @return the username contained in the token
	 */
	public String extractUsername(String token) {
	    return extractClaim(token, Claims::getSubject);
	}

	/**
	 * Extracts the expiration date from the JWT token.
	 *
	 * @param token the JWT token
	 * @return the expiration date of the token
	 */
	public Date extractExpiration(String token) {
	    return extractClaim(token, Claims::getExpiration);
	}

	/**
	 * Extracts a specific claim from the JWT token using a resolver function.
	 *
	 * @param <T> the type of the claim
	 * @param token the JWT token
	 * @param claimsResolver a function to extract the desired claim from Claims
	 * @return the extracted claim
	 */
	public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
	    final Claims claims = extractAllClaims(token);
	    return claimsResolver.apply(claims);
	}

	/**
	 * Extracts all claims (payload) from the JWT token.
	 *
	 * @param token the JWT token
	 * @return the Claims object containing all information in the token
	 */
	private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

	/**
	 * Checks if the JWT token has expired.
	 *
	 * @param token the JWT token
	 * @return true if the token is expired, false otherwise
	 */
	private Boolean isTokenExpired(String token) {
	    return extractExpiration(token).before(new Date());
	}

	/**
	 * Generates a JWT token for the given user details.
	 *
	 * @param userDetails the user details for which to generate the token
	 * @return the generated JWT token
	 */
	public String generateToken(UserDetails userDetails) {
	    Map<String, Object> claims = new HashMap<>();
	    return createToken(claims, userDetails.getUsername());
	}

	/**
	 * Creates a JWT token with the specified claims and subject.
	 *
	 * @param claims a map of claims to include in the token
	 * @param subject the subject (usually username) of the token
	 * @return the created JWT token as a string
	 */
	private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

	/**
	 * Validates the JWT token against the given user details.
	 *
	 * @param token the JWT token
	 * @param userDetails the user details to validate against
	 * @return true if the token is valid and belongs to the user, false otherwise
	 */
	public Boolean validateToken(String token, UserDetails userDetails) {
	    final String username = extractUsername(token);
	    return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	}

}
