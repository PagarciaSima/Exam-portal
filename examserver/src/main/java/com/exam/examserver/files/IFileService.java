package com.exam.examserver.files;

import org.springframework.web.multipart.MultipartFile;

public interface IFileService {

	public String updateProfileLocal(Long userId, MultipartFile file);
}
