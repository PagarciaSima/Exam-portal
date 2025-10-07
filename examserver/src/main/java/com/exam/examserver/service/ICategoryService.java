package com.exam.examserver.service;

import java.util.Set;

import org.springframework.data.domain.Page;

import com.exam.examserver.model.exam.category.Category;

public interface ICategoryService {
	
	public Category addCategory(Category category);
	public Category updateCategory(Category category);
	public Set<Category> getCategories();
	public Category getCategory(Long categoryId);
	public void deleteCategory(Long categoryId);
	Page<Category> getCategoriesPaged(int page, int size);
	public Set<Category> addCategories(Set<Category> categories);
	Page<Category> searchCategories(String term, int page, int size);
}