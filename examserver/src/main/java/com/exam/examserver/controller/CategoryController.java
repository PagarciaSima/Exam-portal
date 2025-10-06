package com.exam.examserver.controller;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.exam.examserver.model.exam.category.Category;
import com.exam.examserver.service.ICategoryService;

/**
 * REST controller for managing Category entities.
 * Provides endpoints for CRUD operations.
 */
@RestController
@RequestMapping("/category")
@CrossOrigin("*")
public class CategoryController {

    private static final Logger LOGGER = LoggerFactory.getLogger(CategoryController.class);

    @Autowired
    private ICategoryService categoryService;

    /**
     * Create a new category.
     *
     * @param category the category to create
     * @return the created category
     */
    @PostMapping()
    public ResponseEntity<?> addCategory(@RequestBody Category category) {
        LOGGER.info("Received request to add category: {}", category.getTitle());
        Category createdCategory = categoryService.addCategory(category);
        return ResponseEntity.ok(createdCategory);
    }
    
    /**
     * Create multiple categories in a single request.
     *
     * <p>This endpoint allows creating multiple categories at once by passing
     * a JSON array of category objects without IDs.</p>
     *
     * @param categories the set of categories to create
     * @return the set of created categories
     */
    @PostMapping("/bulk")
    public ResponseEntity<?> addCategories(@RequestBody Set<Category> categories) {
        LOGGER.info("Received request to add {} categories in bulk", categories.size());
        Set<Category> createdCategories = categoryService.addCategories(categories);
        return ResponseEntity.ok(createdCategories);
    }


    /**
     * Update an existing category.
     *
     * @param category the category with updated fields
     * @return the updated category
     */
    @PutMapping()
    public ResponseEntity<?> updateCategory(@RequestBody Category category) {
        LOGGER.info("Received request to update category with ID: {}", category.getCid());
        Category updatedCategory = categoryService.updateCategory(category);
        return ResponseEntity.ok(updatedCategory);
    }

    /**
     * Retrieve all categories.
     *
     * @return a set of all categories
     */
    @GetMapping()
    public ResponseEntity<?> getCategories() {
        LOGGER.info("Received request to fetch all categories");
        Set<Category> categories = categoryService.getCategories();
        return ResponseEntity.ok(categories);
    }
    
    /**
     * REST endpoint to retrieve categories in a paginated and alphabetically ordered manner.
     *
     * <p>This endpoint returns a page of categories sorted by their title in ascending order.
     * Clients can specify the page number and the number of categories per page using query parameters.
     * The response includes pagination metadata such as total pages, total elements, and current page.</p>
     *
     * <p>Example request:</p>
     * <pre>
     * GET /categories/paged?page=0&size=10
     * </pre>
     *
     * @param page the zero-based page index (default is 0)
     * @param size the number of categories per page (default is 10)
     * @return a {@link ResponseEntity} containing a {@link Page} of {@link Category} objects
     *         with pagination metadata
     */
    @GetMapping("/paged")
    public ResponseEntity<?> getCategoriesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        LOGGER.info("Received request to fetch paginated categories: page {}, size {}", page, size);
        Page<Category> categories = categoryService.getCategoriesPaged(page, size);
        return ResponseEntity.ok(categories);
    }

    /**
     * Retrieve a category by ID.
     *
     * @param categoryId the ID of the category to fetch
     * @return the found category
     */
    @GetMapping("/{categoryId}")
    public ResponseEntity<?> getCategory(@PathVariable Long categoryId) {
        LOGGER.info("Received request to fetch category with ID: {}", categoryId);
        Category category = categoryService.getCategory(categoryId);
        return ResponseEntity.ok(category);
    }

    /**
     * Delete a category by ID.
     *
     * @param categoryId the ID of the category to delete
     * @return a response entity with status
     */
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        LOGGER.info("Received request to delete category with ID: {}", categoryId);
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok().build();
    }
}