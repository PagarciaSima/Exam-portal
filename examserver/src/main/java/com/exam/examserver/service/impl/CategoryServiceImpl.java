package com.exam.examserver.service.impl;

import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional()
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
    @Transactional()
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
    @Transactional(readOnly = true)
    public Set<Category> getCategories() {
        LOGGER.info("Fetching all categories ordered by title ASC");
        return new LinkedHashSet<>(
            categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "title"))
        );
    }
    
    /**
     * Retrieve categories in a paginated and alphabetically ordered manner.
     *
     * <p>This method fetches categories from the database ordered by their title in ascending order
     * and returns a {@link Page} containing the requested page of categories.
     * Pagination parameters allow clients to specify which page and how many items per page
     * should be returned.</p>
     *
     * @param page the zero-based page index (0 = first page)
     * @param size the number of categories to return per page
     * @return a {@link Page} of {@link Category} objects, sorted by title in ascending order
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Category> getCategoriesPaged(int page, int size) {
        LOGGER.info("Fetching categories paginated: page {}, size {}, ordered by title ASC", page, size);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "title"));
        return categoryRepository.findAll(pageable);
    }

    /**
     * Retrieves a category by its ID.
     *
     * @param categoryId the ID of the category
     * @return the found category
     * @throws IllegalArgumentException if category is not found
     */
    @Override
    @Transactional(readOnly = true)
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
    @Transactional()
    public void deleteCategory(Long categoryId) {
        LOGGER.info("Deleting category with ID: {}", categoryId);
        if (!categoryRepository.existsById(categoryId)) {
            LOGGER.warn("Category with ID {} does not exist. Cannot delete.", categoryId);
            throw new IllegalArgumentException("Category not found with ID: " + categoryId);
        }
        categoryRepository.deleteById(categoryId);
        LOGGER.info("Category with ID {} deleted successfully", categoryId);
    }
    
    /**
     * Create multiple categories in a single operation.
     *
     * <p>This method allows bulk creation of categories by accepting a set of category objects.
     * Each category will be persisted in the database, and the method returns a set of the
     * saved categories including any generated IDs.</p>
     *
     * <p>If the provided set is null or empty, the method returns an empty set and logs a warning.</p>
     *
     * @param categories the set of {@link Category} objects to be created
     * @return a set of {@link Category} objects that were successfully saved
     */
    @Override
    @Transactional
    public Set<Category> addCategories(Set<Category> categories) {
        if (categories == null || categories.isEmpty()) {
            LOGGER.warn("No categories provided for bulk creation");
            return Collections.emptySet();
        }

        LOGGER.info("Creating {} categories in bulk", categories.size());

        List<Category> savedCategories = categoryRepository.saveAll(categories);

        return new HashSet<>(savedCategories);
    }
    
    /**
     * Searches for categories whose title or description contains the specified term,
     * ignoring case sensitivity, and returns the results in a paginated format.
     * <p>
     * This method is typically used to support search functionality in the client application,
     * allowing users to find categories by keyword. The search is performed on both
     * the {@code title} and {@code description} fields of the {@link Category} entity.
     * </p>
     *
     * @param term the search keyword to look for within category titles or descriptions.
     * @param page the zero-based page index to retrieve.
     * @param size the number of categories to include per page.
     * @return a {@link Page} of {@link Category} objects that match the search criteria.
     *
     * @see org.springframework.data.domain.Page
     * @see org.springframework.data.domain.Pageable
     * @see com.exam.examserver.model.exam.category.Category
     */
    @Override
    public Page<Category> searchCategories(String term, int page, int size) {
        LOGGER.info("Searching categories with term: '{}' (page: {}, size: {})", term, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Category> result = categoryRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(term, term, pageable);

        LOGGER.debug("Search for '{}' returned {} results (page {} of {})",
                term, result.getNumberOfElements(), result.getNumber() + 1, result.getTotalPages());

        return result;
    }

}
