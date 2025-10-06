package com.exam.examserver.controller;

import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.exam.examserver.model.dto.PasswordUpdateRequest;
import com.exam.examserver.model.dto.UserDto;
import com.exam.examserver.model.user.User;
import com.exam.examserver.model.userrole.UserRole;
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
	public User createUser(@RequestBody User user) {
	    Set<UserRole> userRoles = this.userService.asignDefaultRole(user);
	    return this.userService.createUser(user, userRoles);
	}
	
	@GetMapping("/{username}")
	public UserDto getUser(@PathVariable("username") String username) {
	    User user = this.userService.getUser(username);
	    return new UserDto(user);
	}
	
	@DeleteMapping("/{userId}")
	public void deleteUser(@PathVariable("userId") Long userId) {
		this.userService.deleteUser(userId);
	}
	
	@PutMapping("/{userId}")
	public UserDto updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
	    User user = this.userService.updateUser(userId, updatedUser);
	    return new UserDto(user);
	}
	
	@PatchMapping("/{userId}/password")
	public ResponseEntity<Map<String, String>> updatePassword(
	        @PathVariable Long userId,
	        @RequestBody PasswordUpdateRequest request) {

	    userService.updatePassword(userId, request.getNewPassword());
	    return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
	}

	@PostMapping("/{userId}/profile")
	public ResponseEntity<Map<String, String>> uploadProfilePicture(
	        @PathVariable Long userId,
	        @RequestParam("file") MultipartFile file) {
	    try {
	        String profileUrl = userService.updateProfilePicture(userId, file);
	        return ResponseEntity.ok(Map.of("profileUrl", profileUrl));
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("error", "Error uploading profile picture: " + e.getMessage()));
	    }
	}
	
	@DeleteMapping("/{userId}/profile")
	public ResponseEntity<Map<String, String>> deleteProfilePicture(@PathVariable Long userId) {
	    try {
	        userService.deleteProfilePicture(userId);
	        return ResponseEntity.ok(Map.of("message", "Profile picture deleted successfully"));
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("error", "Error deleting profile picture: " + e.getMessage()));
	    }
	}
	

}
