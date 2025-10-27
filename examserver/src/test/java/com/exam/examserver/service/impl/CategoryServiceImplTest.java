package com.exam.examserver.service.impl;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.exam.examserver.model.exam.category.Category;
import com.exam.examserver.repository.CategoryRepository;

class CategoryServiceImplTest {

	@Mock
	private CategoryRepository categoryRepository;

	@InjectMocks
	private CategoryServiceImpl categoryService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testAddCategory() {
		Category category = new Category();
		category.setCid(1L);
		category.setTitle("Ciencia");

		when(categoryRepository.save(category)).thenReturn(category);

		Category result = categoryService.addCategory(category);
		assertNotNull(result);
		assertEquals("Ciencia", result.getTitle());
	}

	@Test
	void testGetCategory() {
		Category category = new Category();
		category.setCid(1L);
		category.setTitle("Matemáticas");

		when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

		Category result = categoryService.getCategory(1L);
		assertNotNull(result);
		assertEquals(1L, result.getCid());
	}

	
	@Test
	void testGetCategories() {
	    Category cat1 = new Category();
	    cat1.setCid(1L);
	    cat1.setTitle("Historia");
	
	    Category cat2 = new Category();
	    cat2.setCid(2L);
	    cat2.setTitle("Geografía");
	
	    when(categoryRepository.findAll(org.mockito.ArgumentMatchers.any(org.springframework.data.domain.Sort.class)))
	        .thenReturn(Arrays.asList(cat1, cat2));
	
	    Set<Category> categories = categoryService.getCategories();
	    assertEquals(2, categories.size());
	}

	@Test
	void testDeleteCategory() {
	    when(categoryRepository.existsById(1L)).thenReturn(true);
	    doNothing().when(categoryRepository).deleteById(1L);
	
	    categoryService.deleteCategory(1L);
	
	    verify(categoryRepository, times(1)).deleteById(1L);
	}

}
