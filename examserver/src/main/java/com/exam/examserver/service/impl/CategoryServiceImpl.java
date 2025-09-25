package com.exam.examserver.service.impl;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.exam.examserver.model.exam.category.Category;
import com.exam.examserver.repository.CategoryRepository;
import com.exam.examserver.service.ICategoryService;

/**
 * Implementation of the Category service.
 * Provides CRUD operations for Category entities.
 */
@Service
public class CategoryServiceImpl implements ICategoryService {

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryServiceImpl.class);

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Adds a new category.
     *
     * @param category the category to add
     * @return the saved category
     */
    @Override
    public Category addCategory(Category category) {
        LOGGER.info("Adding new category: {}", category.getTitle());
        return categoryRepository.save(category);
    }

    /**
     * Updates an existing category.
     *
     * @param category the category to update
     * @return the updated category
     */
    @Override
    public Category updateCategory(Category category) {
        LOGGER.info("Updating category with ID: {}", category.getCid());
        if (!categoryRepository.existsById(category.getCid())) {
            LOGGER.warn("Category with ID {} does not exist. Cannot update.", category.getCid());
            throw new IllegalArgumentException("Category not found with ID: " + category.getCid());
        }
        return categoryRepository.save(category);
    }

    /**
     * Retrieves all categories.
     *
     * @return a set of all categories
     */
    @Override
    public Set<Category> getCategories() {
        LOGGER.info("Fetching all categories");
        return new LinkedHashSet<>(categoryRepository.findAll());
    }

    /**
     * Retrieves a category by its ID.
     *
     * @param categoryId the ID of the category
     * @return the found category
     * @throws IllegalArgumentException if category is not found
     */
    @Override
    public Category getCategory(Long categoryId) {
        LOGGER.info("Fetching category with ID: {}", categoryId);
        Optional<Category> categoryOpt = categoryRepository.findById(categoryId);
        if (categoryOpt.isEmpty()) {
            LOGGER.warn("Category with ID {} not found", categoryId);
            throw new IllegalArgumentException("Category not found with ID: " + categoryId);
        }
        return categoryOpt.get();
    }

    /**
     * Deletes a category by its ID.
     *
     * @param categoryId the ID of the category to delete
     * @throws IllegalArgumentException if category is not found
     */
    @Override
    public void deleteCategory(Long categoryId) {
        LOGGER.info("Deleting category with ID: {}", categoryId);
        if (!categoryRepository.existsById(categoryId)) {
            LOGGER.warn("Category with ID {} does not exist. Cannot delete.", categoryId);
            throw new IllegalArgumentException("Category not found with ID: " + categoryId);
        }
        categoryRepository.deleteById(categoryId);
        LOGGER.info("Category with ID {} deleted successfully", categoryId);
    }
}
