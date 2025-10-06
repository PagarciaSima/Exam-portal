package com.exam.examserver.files;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.exam.examserver.model.exam.question.Question;

public interface IFileService {

	public String updateProfileLocal(Long userId, MultipartFile file);

	public void deleteProfileLocal(Long userId);

	void createQuestionImageLocal(Question question, MultipartFile imageFile) throws IOException;
}
