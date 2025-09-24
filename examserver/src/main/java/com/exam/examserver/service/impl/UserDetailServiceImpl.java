package com.exam.examserver.service.impl;

import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.exam.examserver.model.user.User;
import com.exam.examserver.repository.UserRepository;

@Service
public class UserDetailServiceImpl implements UserDetailsService{
	
	private static final Logger LOGGER = LoggerFactory.getLogger(UserDetailServiceImpl.class);

	@Autowired
	private UserRepository userRepository;
	

	/**
	 * Loads a user by username for authentication.
	 *
	 * @param username the username identifying the user whose data is required.
	 * @return UserDetails object containing user information.
	 * @throws UsernameNotFoundException if the user could not be found.
	 */
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
	    User user = this.userRepository.findByUsername(username);

	    if (Objects.isNull(user)) {
	        LOGGER.warn("User not found for username '{}'", username);
	        throw new UsernameNotFoundException("User not found with username: " + username);
	    }

	    LOGGER.info("User '{}' successfully loaded", username);

	    return user;
	}

}
