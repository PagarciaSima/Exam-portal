package com.exam.examserver.model.userrole;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

import com.exam.examserver.model.role.Role;
import com.exam.examserver.model.user.User;

@Entity
public class UserRole {
	
	public UserRole() {
		super();
	}
	
	public UserRole(Long userRole, User user, Role role) {
		super();
		this.userRole = userRole;
		this.user = user;
		this.role = role;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long userRole;
	
	// User
	@ManyToOne(fetch = FetchType.EAGER)
	private User user;
	
	// Role
	@ManyToOne
	private Role role;

	public Long getUserRole() {
		return userRole;
	}

	public void setUserRole(Long userRole) {
		this.userRole = userRole;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

}
