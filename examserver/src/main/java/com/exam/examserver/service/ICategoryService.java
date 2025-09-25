package com.exam.examserver.service;

import java.util.Set;

import com.exam.examserver.model.exam.category.Category;

public interface ICategoryService {
	
	public Category addCategory(Category category);
	public Category updateCategory(Category category);
	public Set<Category> getCategories();
	public Category getCategory(Long categoryId);
	public void deleteCategory(Long categoryId);
}