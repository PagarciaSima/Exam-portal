package com.exam.examserver.model.dto;


import java.time.LocalDateTime;
import java.util.List;

public class QuizAttemptDTO {
    private Long id;
    private double marksGot;
    private double correctAnswers;
    private int attempted;
    private LocalDateTime attemptDate;
    private List<QuestionAttemptDTO> questions;
    private Integer maxMarks;

    public QuizAttemptDTO() {}

    public QuizAttemptDTO(Long id, double marksGot, double correctAnswers, int attempted, LocalDateTime attemptDate,
			List<QuestionAttemptDTO> questions, Integer maxMarks) {
		super();
		this.id = id;
		this.marksGot = marksGot;
		this.correctAnswers = correctAnswers;
		this.attempted = attempted;
		this.attemptDate = attemptDate;
		this.questions = questions;
		this.maxMarks = maxMarks;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public double getMarksGot() {
		return marksGot;
	}

	public void setMarksGot(double marksGot) {
		this.marksGot = marksGot;
	}

	public double getCorrectAnswers() {
		return correctAnswers;
	}

	public void setCorrectAnswers(double correctAnswers) {
		this.correctAnswers = correctAnswers;
	}

	public int getAttempted() {
		return attempted;
	}

	public void setAttempted(int attempted) {
		this.attempted = attempted;
	}

	public LocalDateTime getAttemptDate() {
		return attemptDate;
	}

	public void setAttemptDate(LocalDateTime attemptDate) {
		this.attemptDate = attemptDate;
	}

	public List<QuestionAttemptDTO> getQuestions() {
		return questions;
	}

	public void setQuestions(List<QuestionAttemptDTO> questions) {
		this.questions = questions;
	}

	public Integer getMaxMarks() {
		return maxMarks;
	}

	public void setMaxMarks(Integer maxMarks) {
		this.maxMarks = maxMarks;
	}

}
