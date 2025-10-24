package com.exam.examserver.model.dto;

public class PopularQuizStatsDTO {

	private Long quizId;
	private String quizTitle;
	private Long totalAttempts;
	private Double averageMarks;

	public PopularQuizStatsDTO(Long quizId, String quizTitle, Long totalAttempts, Double averageMarks) {
		this.quizId = quizId;
		this.quizTitle = quizTitle;
		this.totalAttempts = totalAttempts;
		this.averageMarks = averageMarks;
	}

	public Long getQuizId() {
		return quizId;
	}

	public void setQuizId(Long quizId) {
		this.quizId = quizId;
	}

	public String getQuizTitle() {
		return quizTitle;
	}

	public void setQuizTitle(String quizTitle) {
		this.quizTitle = quizTitle;
	}

	public Long getTotalAttempts() {
		return totalAttempts;
	}

	public void setTotalAttempts(Long totalAttempts) {
		this.totalAttempts = totalAttempts;
	}

	public Double getAverageMarks() {
		return averageMarks;
	}

	public void setAverageMarks(Double averageMarks) {
		this.averageMarks = averageMarks;
	}

}
