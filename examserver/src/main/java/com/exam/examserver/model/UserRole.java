package com.exam.examserver.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

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
