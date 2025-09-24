package com.exam.examserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.examserver.model.user.User;

public interface UserRepository extends JpaRepository<User, Long>{

	User findByUsername(String username);

}
