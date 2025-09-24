package com.exam.examserver.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.examserver.model.role.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{

	Optional<Role> findByRoleName(String normalRole);

}
