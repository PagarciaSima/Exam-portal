package com.exam.examserver.service;

import com.exam.examserver.model.dto.QuestionGenerationRequest;

public interface IGeminiService {

	byte[] generateQuestionsJson(QuestionGenerationRequest request);


}
