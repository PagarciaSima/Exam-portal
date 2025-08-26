package com.exam.examserver.service;

import java.util.Set;

import com.exam.examserver.model.User;
import com.exam.examserver.model.UserRole;

public interface IUserService {
	
	User createUser(User user, Set<UserRole> userRoles) throws Exception;

	Set<UserRole> asignDefaultRole(User user);
	
	User getUser(String username);
	
	void deleteUser(Long userId);

}
