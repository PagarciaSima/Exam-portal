package com.exam.examserver.model.questionattempt;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.exam.quizattempt.QuizAttempt;
import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "question_attempts")
public class QuestionAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @JoinColumn(name = "quiz_id")
    private Long quizId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id")
    @JsonBackReference
    private QuizAttempt quizAttempt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "question_id")
    private Question question;

    private String givenAnswer;
    private boolean correct;

    public QuestionAttempt() {}

    public QuestionAttempt(QuizAttempt quizAttempt, Question question, String givenAnswer, boolean correct) {
        this.quizAttempt = quizAttempt;
        this.question = question;
        this.givenAnswer = givenAnswer;
        this.correct = correct;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public QuizAttempt getQuizAttempt() {
		return quizAttempt;
	}

	public void setQuizAttempt(QuizAttempt quizAttempt) {
		this.quizAttempt = quizAttempt;
	}

	public Question getQuestion() {
		return question;
	}

	public void setQuestion(Question question) {
		this.question = question;
	}

	public String getGivenAnswer() {
		return givenAnswer;
	}

	public void setGivenAnswer(String givenAnswer) {
		this.givenAnswer = givenAnswer;
	}

	public boolean isCorrect() {
		return correct;
	}

	public void setCorrect(boolean correct) {
		this.correct = correct;
	}

	public Long getQuizId() {
		return quizId;
	}

	public void setQuizId(Long quizId) {
		this.quizId = quizId;
	}
  
}
