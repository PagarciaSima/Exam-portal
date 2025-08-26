package com.exam.examserver.service;

import java.util.Set;

import com.exam.examserver.model.User;
import com.exam.examserver.model.UserRole;

public interface IUserService {
	
	// Create user
	public User createUser(User user, Set<UserRole> userRoles) throws Exception;
}
