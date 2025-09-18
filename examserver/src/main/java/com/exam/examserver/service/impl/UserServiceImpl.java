package com.exam.examserver.service.impl;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.exam.examserver.model.Role;
import com.exam.examserver.model.User;
import com.exam.examserver.model.UserRole;
import com.exam.examserver.repository.RoleRepository;
import com.exam.examserver.repository.UserRepository;
import com.exam.examserver.service.IUserService;

@Service
@Primary
public class UserServiceImpl implements IUserService{

	private static final String NORMAL_ROLE_NAME = "NORMAL";
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(UserServiceImpl.class);

	/**
	 * Creates a new user and assigns the specified roles.
	 * First, it checks if a user with the same username already exists.
	 * Then, it manages the roles and persists the user in the database.
	 *
	 * @param user the user to be created
	 * @param userRoles the set of roles to assign to the user
	 * @return the saved User entity
	 * @throws RuntimeException if a user with the same username already exists
	 */
	@Override
	public User createUser(User user, Set<UserRole> userRoles) throws RuntimeException {
	    LOGGER.info("Starting creation of user '{}'", user.getUsername());
	    
	    if(user != null && user.getProfile() == null) {
	    	user.setProfile("default.png");
	    }
	    
	    // Cifrar la contraseña
	    if (user.getPassword() != null) {
	        user.setPassword(passwordEncoder.encode(user.getPassword()));
	    }
	    
	    // Check if the username is already taken
	    checkExistingUserByUserName(user);

	    // Assign and persist roles
	    manageRoles(user, userRoles);

	    // Save the user
	    User savedUser = this.userRepository.save(user);
	    LOGGER.info("User '{}' created successfully with {} roles", 
	                user.getUsername(), 
	                userRoles != null ? userRoles.size() : 0);

	    return savedUser;
	}
	
	/**
	 * Assigns the default role ("NORMAL") to the given user.
	 * If the role does not exist in the database, it will be created.
	 *
	 * @param user the user to which the default role will be assigned
	 * @return a set containing the UserRole association for the default role
	 */
	@Override
	public Set<UserRole> asignDefaultRole(User user) {
	    Set<UserRole> userRoles = new HashSet<>();

	    // Search for the NORMAL role in the database
	    Role role = roleRepository.findByRoleName(NORMAL_ROLE_NAME)
	            .orElseGet(() -> {
	                LOGGER.info("Default role 'NORMAL' not found, creating it...");
	                Role newRole = new Role();
	                newRole.setRoleName(NORMAL_ROLE_NAME);
	                Role savedRole = roleRepository.save(newRole);
	                LOGGER.info("Default role 'NORMAL' created with ID {}", savedRole.getRoleId());
	                return savedRole;
	            });

	    UserRole userRole = new UserRole();
	    userRole.setUser(user);
	    userRole.setRole(role);

	    userRoles.add(userRole);

	    LOGGER.info("Assigned default role 'NORMAL' to user '{}'", user.getUsername());

	    return userRoles;
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
	 * @throws RuntimeException if a user with the same username already exists
	 */
	private void checkExistingUserByUserName(User user) throws RuntimeException {
	    String username = user.getUsername();
	    LOGGER.info("Checking if user '{}' already exists...", username);

	    User existingUser = this.userRepository.findByUsername(username);
	    if (Objects.nonNull(existingUser)) {
	        LOGGER.warn("User with username '{}' already exists!", username);
	        throw new RuntimeException("User already present");
	    }

	    LOGGER.info("Username '{}' is available", username);
	}

	/**
	 * Retrieves a user by their username.
	 * Logs the attempt to fetch the user and whether the user was found.
	 *
	 * @param username the username of the user to retrieve
	 * @return the User entity if found, otherwise null
	 */
	@Override
	public User getUser(String username) {
	    LOGGER.info("Fetching user with username '{}'", username);

	    User user = this.userRepository.findByUsername(username);

	    if (user != null) {
	        LOGGER.info("User '{}' found", username);
	    } else {
	        LOGGER.warn("User '{}' not found", username);
	    }

	    return user;
	}

	/**
	 * Deletes a user by their ID.
	 * Logs the attempt to delete the user and confirms deletion.
	 *
	 * @param userId the ID of the user to delete
	 */
	@Override
	public void deleteUser(Long userId) {
	    LOGGER.info("Attempting to delete user with ID '{}'", userId);

	    this.userRepository.deleteById(userId);

	    LOGGER.info("User with ID '{}' has been deleted", userId);
	}
}
