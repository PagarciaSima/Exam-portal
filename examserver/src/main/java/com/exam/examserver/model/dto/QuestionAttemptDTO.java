package com.exam.examserver.model.dto;

public class QuestionAttemptDTO {
    private Long id;
    private String content;
    private String givenAnswer;
    private String answer; 
    private String image; 
    public QuestionAttemptDTO() {}

    public QuestionAttemptDTO(Long id, String content, String givenAnswer, String answer, String image) {
        this.id = id;
        this.content = content;
        this.givenAnswer = givenAnswer;
        this.answer = answer;
        this.image = image;
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getGivenAnswer() { return givenAnswer; }
    public void setGivenAnswer(String givenAnswer) { this.givenAnswer = givenAnswer; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
