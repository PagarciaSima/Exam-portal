package com.exam.examserver.controller;

import java.util.Set;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.model.User;
import com.exam.examserver.model.UserRole;
import com.exam.examserver.service.IUserService;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {
	
	private IUserService userService;
	
	public UserController(IUserService userService) {
		this.userService = userService;
	}

	@PostMapping("/")
	public User createUSer(@RequestBody User user) throws Exception {
		Set<UserRole> userRoles = this.userService.asignDefaultRole(user);
		return this.userService.createUser(user, userRoles);
	}
	
	@GetMapping("/{username}")
	public User getUser(@PathVariable ("username") String username) {
		return this.userService.getUser(username);
	}
	
	@DeleteMapping("/{userId}")
	public void deleteUser(@PathVariable("userId") Long userId) {
		this.userService.deleteUser(userId);
	}

}
