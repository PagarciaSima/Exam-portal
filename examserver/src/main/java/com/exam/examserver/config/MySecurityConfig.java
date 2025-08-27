package com.exam.examserver.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class MySecurityConfig extends WebSecurityConfigurerAdapter{
	
	@Autowired
	private UserDetailsService userDetailsService;
	
	@Bean
	protected BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService)
			.passwordEncoder(passwordEncoder());
	}


	  @Override
	    protected void configure(HttpSecurity http) throws Exception {
//	        http
//	                .csrf()
//	                .disable()
//	                .cors()
//	                .disable()
//	                .authorizeRequests()
//	                .antMatchers("/generate-token","/user/").permitAll()
//	                .antMatchers(HttpMethod.OPTIONS).permitAll()
//	                .anyRequest().authenticated()
//	                .and()
//	                .exceptionHandling().authenticationEntryPoint(unAuthorizedHandler)
//	                .and()
//	                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
//	        http.
//	                addFilterBefore(JWTAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

	    }


	
	
}
