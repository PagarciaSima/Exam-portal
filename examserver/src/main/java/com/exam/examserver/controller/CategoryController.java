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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/category")
@CrossOrigin("*")
@Tag(name = "Categories", description = "API for managing categories")
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
	@Operation(
		summary = "Create a new category",
		description = "Adds a new category to the system",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Category created successfully",
				content = @Content(schema = @Schema(implementation = Category.class))
			),
			@ApiResponse(
				responseCode = "400",
				description = "Invalid category data"
			)
		}
	)
	@PostMapping()
	public ResponseEntity<?> addCategory(@RequestBody Category category) {
		category.setCid(null);
		LOGGER.info("Received request to add category: {}", category.getTitle());
		Category createdCategory = categoryService.addCategory(category);
		return ResponseEntity.ok(createdCategory);
	}

	/**
	 * Create multiple categories in a single request.
	 *
	 * @param categories the set of categories to create
	 * @return the set of created categories
	 */
	@Operation(
		summary = "Create multiple categories",
		description = "Adds multiple categories to the system in bulk",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Categories created successfully",
				content = @Content(schema = @Schema(implementation = Set.class))
			),
			@ApiResponse(
				responseCode = "400",
				description = "Invalid categories data"
			)
		}
	)
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
	@Operation(
		summary = "Update a category",
		description = "Updates an existing category with new data",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Category updated successfully",
				content = @Content(schema = @Schema(implementation = Category.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Category not found"
			)
		}
	)
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
	@Operation(
		summary = "Get all categories",
		description = "Retrieves all categories from the system",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Categories retrieved successfully",
				content = @Content(schema = @Schema(implementation = Set.class))
			)
		}
	)
	@GetMapping()
	public ResponseEntity<?> getCategories() {
		LOGGER.info("Received request to fetch all categories");
		Set<Category> categories = categoryService.getCategories();
		return ResponseEntity.ok(categories);
	}

	/**
	 * Retrieves a paginated list of categories, optionally filtered by a search term.
	 *
	 * @param page   the page number to retrieve (zero-based)
	 * @param size   the number of elements per page
	 * @param search an optional search term to filter categories by title or description
	 * @return a ResponseEntity containing a Page of Category objects
	 */
	@Operation(
		summary = "Get paginated categories",
		description = "Retrieves categories paginated and optionally filtered by search term",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Paginated categories retrieved successfully",
				content = @Content(schema = @Schema(implementation = Page.class))
			)
		}
	)
	@GetMapping("/paged")
	public ResponseEntity<?> getCategoriesPaged(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(required = false) String search) {

		Page<Category> categories;

		if (search != null && !search.isBlank()) {
			String trimmed = search.trim();
			LOGGER.debug("Search present -> using requested page {} for search '{}'", page, trimmed);
			categories = categoryService.searchCategories(trimmed, page, size);
		} else {
			categories = categoryService.getCategoriesPaged(page, size);
		}

		return ResponseEntity.ok(categories);
	}

	/**
	 * Retrieve a category by ID.
	 *
	 * @param categoryId the ID of the category to fetch
	 * @return the found category
	 */
	@Operation(
		summary = "Get a category by ID",
		description = "Retrieves a single category by its ID",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Category retrieved successfully",
				content = @Content(schema = @Schema(implementation = Category.class))
			),
			@ApiResponse(
				responseCode = "404",
				description = "Category not found"
			)
		}
	)
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
	@Operation(
		summary = "Delete a category",
		description = "Deletes a category by its ID",
		responses = {
			@ApiResponse(
				responseCode = "200",
				description = "Category deleted successfully"
			),
			@ApiResponse(
				responseCode = "404",
				description = "Category not found"
			)
		}
	)
	@DeleteMapping("/{categoryId}")
	public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
		LOGGER.info("Received request to delete category with ID: {}", categoryId);
		categoryService.deleteCategory(categoryId);
		return ResponseEntity.ok().build();
	}
}
