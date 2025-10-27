
package com.exam.examserver.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;

import com.exam.examserver.model.dto.CategoryQuizCountResponseDTO;
import com.exam.examserver.model.exam.category.Category;
import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.service.ICategoryService;

class CategoryControllerTest {

    @InjectMocks
    private CategoryController categoryController;

    @Mock
    private ICategoryService categoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void addCategory_shouldReturnCreatedCategory() {
        Category category = new Category(null, "Test", "Desc");
        Category saved = new Category(1L, "Test", "Desc");
        when(categoryService.addCategory(any(Category.class))).thenReturn(saved);

        ResponseEntity<?> response = categoryController.addCategory(category);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(saved, response.getBody());
    }

    @Test
    void addCategories_shouldReturnCreatedCategories() {
        Set<Category> input = Set.of(new Category(null, "A", "D"));
        Set<Category> output = Set.of(new Category(1L, "A", "D"));
        when(categoryService.addCategories(anySet())).thenReturn(output);

        ResponseEntity<?> response = categoryController.addCategories(input);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(output, response.getBody());
    }

    @Test
    void updateCategory_shouldReturnUpdatedCategory() {
        Category category = new Category(1L, "Test", "Desc");
        when(categoryService.updateCategory(any(Category.class))).thenReturn(category);

        ResponseEntity<?> response = categoryController.updateCategory(category);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(category, response.getBody());
    }

    @Test
    void getCategories_shouldReturnAllCategories() {
        Set<Category> categories = Set.of(new Category(1L, "A", "D"));
        when(categoryService.getCategories()).thenReturn(categories);

        ResponseEntity<?> response = categoryController.getCategories();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(categories, response.getBody());
    }

    @Test
    void getCategoriesPaged_shouldReturnPagedCategories() {
        List<Category> list = List.of(new Category(1L, "A", "D"));
        PageImpl<Category> page = new PageImpl<>(list, PageRequest.of(0, 10), 1);
        when(categoryService.getCategoriesPaged(0, 10)).thenReturn(page);

        ResponseEntity<?> response = categoryController.getCategoriesPaged(0, 10, null);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(page, response.getBody());
    }

    @Test
    void getCategoriesPaged_withSearch_shouldReturnPagedCategories() {
        List<Category> list = List.of(new Category(1L, "A", "D"));
        PageImpl<Category> page = new PageImpl<>(list, PageRequest.of(0, 10), 1);
        when(categoryService.searchCategories("A", 0, 10)).thenReturn(page);

        ResponseEntity<?> response = categoryController.getCategoriesPaged(0, 10, "A");

        assertEquals(200, response.getStatusCode().value());
        assertEquals(page, response.getBody());
    }

    @Test
    void getCategory_shouldReturnCategory() {
        Category category = new Category(1L, "A", "D");
        when(categoryService.getCategory(1L)).thenReturn(category);

        ResponseEntity<?> response = categoryController.getCategory(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(category, response.getBody());
    }

    @Test
    void deleteCategory_shouldReturnOk() {
        doNothing().when(categoryService).deleteCategory(1L);

        ResponseEntity<Void> response = categoryController.deleteCategory(1L);

        assertEquals(200, response.getStatusCode().value());
        assertNull(response.getBody());
    }

    @Test
    void getQuizCountForAllCategories_shouldReturnQuizCounts() {
        Category category = new Category(1L, "A", "D");
        Quiz quiz = mock(Quiz.class);
        category.setQuizzes(Set.of(quiz));
        when(categoryService.getCategories()).thenReturn(Set.of(category));

        ResponseEntity<List<CategoryQuizCountResponseDTO>> response = categoryController.getQuizCountForAllCategories();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals(1, response.getBody().get(0).getQuizCount());
    }

    @Test
    void getActiveQuizCountForAllCategories_shouldReturnActiveQuizCounts() {
        Category category = new Category(1L, "A", "D");
        Quiz quiz = mock(Quiz.class);
        when(quiz.isActive()).thenReturn(true);
        category.setQuizzes(Set.of(quiz));
        when(categoryService.getCategories()).thenReturn(Set.of(category));

        ResponseEntity<List<CategoryQuizCountResponseDTO>> response = categoryController.getActiveQuizCountForAllCategories();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        assertEquals(1, response.getBody().get(0).getQuizCount());
    }

    @Test
    void getActiveQuizzesByCategory_shouldReturnActiveQuizzes() {
        Category category = new Category(1L, "A", "D");
        Quiz quiz = mock(Quiz.class);
        when(quiz.isActive()).thenReturn(true);
        category.setQuizzes(Set.of(quiz));
        when(categoryService.getCategory(1L)).thenReturn(category);

        ResponseEntity<List<Quiz>> response = categoryController.getActiveQuizzesByCategory(1L);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getActiveQuizzesByCategory_shouldReturnNotFoundIfCategoryNull() {
        when(categoryService.getCategory(1L)).thenReturn(null);

        ResponseEntity<List<Quiz>> response = categoryController.getActiveQuizzesByCategory(1L);

        assertEquals(404, response.getStatusCode().value());
        assertNull(response.getBody());
    }
}
