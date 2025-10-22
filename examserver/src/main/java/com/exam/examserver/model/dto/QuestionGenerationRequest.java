package com.exam.examserver.model.dto;

public class QuestionGenerationRequest {

    private Long quizId;
    private String image;
    private Integer numOfQuestions;
    
    public QuestionGenerationRequest() {}


    public QuestionGenerationRequest(Long quizId, String image, Integer numOfQuestions) {
		super();
		this.quizId = quizId;
		this.image = image;
		this.numOfQuestions = numOfQuestions;
	}


	public Integer getNumOfQuestions() {
		return numOfQuestions;
	}


	public void setNumOfQuestions(Integer numOfQuestions) {
		this.numOfQuestions = numOfQuestions;
	}


	public Long getQuizId() { return quizId; }
    public void setQuizId(Long quizId) { this.quizId = quizId; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

}