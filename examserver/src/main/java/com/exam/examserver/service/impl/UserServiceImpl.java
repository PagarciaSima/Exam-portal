package com.exam.examserver.service.impl;

import java.util.Objects;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.exam.examserver.model.User;
import com.exam.examserver.model.UserRole;
import com.exam.examserver.repository.RoleRepository;
import com.exam.examserver.repository.UserRepository;
import com.exam.examserver.service.IUserService;

public class UserServiceImpl implements IUserService{

	private UserRepository userRepository;
	private RoleRepository roleRepository;
	private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);
	
	public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
		super();
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
	}

	/**
	 * Creates a new user with the specified roles.
	 * First, it checks if a user with the same username already exists.
	 * Then, it saves the roles and associates them with the user before persisting the user.
	 *
	 * @param user the user to be created
	 * @param userRoles the set of roles to assign to the user
	 * @return the saved User entity
	 * @throws Exception if a user with the same username already exists
	 */
	@Override
	public User createUser(User user, Set<UserRole> userRoles) throws Exception {
	    LOGGER.info("Creating user '{}'", user.getUsername());

	    checkExistingUserByUserName(user);
	    manageRoles(user, userRoles);

	    User savedUser = this.userRepository.save(user);
	    LOGGER.info("User '{}' created successfully with {} roles", user.getUsername(),
	            userRoles != null ? userRoles.size() : 0);

	    return savedUser;
	}
	
	/**
	 * Assigns the given roles to the specified user.
	 * Each role in the set is saved in the database if it does not exist,
	 * and then associated with the user.
	 *
	 * @param user the user to which roles will be assigned
	 * @param userRoles the set of user-role associations to be managed
	 */
	private void manageRoles(User user, Set<UserRole> userRoles) {
	    if (userRoles == null || userRoles.isEmpty()) {
	        LOGGER.info("No roles to manage for user: {}", user.getUsername());
	        return;
	    }

	    for (UserRole userRole : userRoles) {
	        if (userRole.getRole() != null) {
	            LOGGER.info("Saving role '{}' for user '{}'", userRole.getRole().getRoleName(), user.getUsername());
	            this.roleRepository.save(userRole.getRole());
	        } else {
	            LOGGER.warn("UserRole contains null role for user '{}'", user.getUsername());
	        }
	    }

	    user.getUserRoles().addAll(userRoles);
	    LOGGER.info("Assigned {} roles to user '{}'", userRoles.size(), user.getUsername());
	}

	/**
	 * Checks if a user with the same username already exists in the database.
	 * If such a user exists, an exception is thrown.
	 *
	 * @param user the user to check for existing username
	 * @throws Exception if a user with the same username already exists
	 */
	private void checkExistingUserByUserName(User user) throws Exception {
	    String username = user.getUsername();
	    LOGGER.info("Checking if user '{}' already exists...", username);

	    User existingUser = this.userRepository.findByUsername(username);
	    if (Objects.nonNull(existingUser)) {
	        LOGGER.warn("User with username '{}' already exists!", username);
	        throw new Exception("User already present");
	    }

	    LOGGER.info("Username '{}' is available", username);
	}

}
