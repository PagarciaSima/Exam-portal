package com.exam.examserver.model.exam.quizattempt;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.exam.examserver.model.exam.quiz.Quiz;
import com.exam.examserver.model.questionattempt.QuestionAttempt;
import com.exam.examserver.model.user.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "quiz_id")
	private Quiz quiz;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id")
	private User user;

	private double marksGot;
	private double correctAnswers;
	private int attempted;
    private LocalDateTime attemptDate = LocalDateTime.now();
	
	@OneToMany(mappedBy = "quizAttempt", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference
	private List<QuestionAttempt> questionAttempts = new ArrayList<>();

	public QuizAttempt() {
	}

	public QuizAttempt(Quiz quiz, User user, double marksGot, double correctAnswers, int attempted) {
		this.quiz = quiz;
		this.user = user;
		this.marksGot = marksGot;
		this.correctAnswers = correctAnswers; 
		this.attempted = attempted;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Quiz getQuiz() {
		return quiz;
	}

	public void setQuiz(Quiz quiz) {
		this.quiz = quiz;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
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

	public List<QuestionAttempt> getQuestionAttempts() {
		return questionAttempts;
	}

	public void setQuestionAttempts(List<QuestionAttempt> questionAttempts) {
		this.questionAttempts = questionAttempts;
	}
	
}
