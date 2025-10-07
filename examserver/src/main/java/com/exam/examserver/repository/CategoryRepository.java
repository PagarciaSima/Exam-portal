package com.exam.examserver.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.exam.examserver.model.exam.category.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{

	Page<Category> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
	        String titleTerm, String descriptionTerm, Pageable pageable);
}
