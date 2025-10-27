package com.exam.examserver.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.exam.examserver.model.user.User;
import com.exam.examserver.model.userrole.UserRole;
import com.exam.examserver.repository.UserRepository;

class UserServiceImplTest {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private UserServiceImpl userService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testAddUser() {
		User user = new User();
		user.setUsername("testuser");
		Set<UserRole> userRoles = new HashSet<>();

		when(userRepository.save(any(User.class))).thenReturn(user);

		User result = userService.createUser(user, userRoles);
		assertNotNull(result);
		assertEquals("testuser", result.getUsername());
		verify(userRepository, times(1)).save(user);
	}

	@Test
	void testGetUserByUsername() {
		// Arrange
		String username = "usuarioPrueba";
		User user = new User();
		user.setUsername(username);

		when(userRepository.findByUsername(username)).thenReturn(user);

		// Act
		User result = userService.getUser(username);

		// Assert
		assertNotNull(result);
		assertEquals(username, result.getUsername());
		verify(userRepository).findByUsername(username);
	}

	@Test
	void testDeleteUser() {
		User user = new User();
		user.setId(1L);
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		doNothing().when(userRepository).deleteById(1L);

		userService.deleteUser(1L);
		verify(userRepository, times(1)).deleteById(1L);
	}
}
