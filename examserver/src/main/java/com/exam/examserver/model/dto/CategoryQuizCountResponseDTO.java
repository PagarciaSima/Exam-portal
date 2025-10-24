package com.exam.examserver.model.dto;

public class CategoryQuizCountResponseDTO {

	public CategoryQuizCountResponseDTO() {
		super();
	}
	
	public CategoryQuizCountResponseDTO(Long categoryId, String categoryTitle, int quizCount) {
		super();
		this.categoryId = categoryId;
		this.categoryTitle = categoryTitle;
		this.quizCount = quizCount;
	}

	private Long categoryId;
	private String categoryTitle;
	private int quizCount;
	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getCategoryTitle() {
		return categoryTitle;
	}

	public void setCategoryTitle(String categoryTitle) {
		this.categoryTitle = categoryTitle;
	}

	public int getQuizCount() {
		return quizCount;
	}

	public void setQuizCount(int quizCount) {
		this.quizCount = quizCount;
	}
	
	
}
