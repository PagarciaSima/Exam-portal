package com.exam.examserver.files;

import java.io.File;
import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.exam.examserver.model.user.User;
import com.exam.examserver.repository.UserRepository;

@Service
public class FileService implements IFileService {
	@Autowired
	private UserRepository userRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(FileService.class);
	
	/**
	 * Updates the profile picture of a user by storing the uploaded file locally 
	 * and updating the user's profile URL in the database.
	 * <p>
	 * Steps performed by this method:
	 * <ol>
	 *     <li>Logs the incoming request to update the profile picture.</li>
	 *     <li>Retrieves the user from the database using the provided {@code userId}.</li>
	 *     <li>Validates that the {@code file} is not empty.</li>
	 *     <li>Determines the local directory to store profile images 
	 *         and creates it if it does not exist.</li>
	 *     <li>Validates the original filename and extracts the file extension.</li>
	 *     <li>Generates a unique filename per user and saves the file to disk.</li>
	 *     <li>Constructs an accessible URL for the profile picture.</li>
	 *     <li>Updates the {@link User#profile} field and persists the user.</li>
	 *     <li>Logs each important step and any potential errors.</li>
	 * </ol>
	 *
	 * @param userId the ID of the user whose profile picture is being updated
	 * @param file the {@link MultipartFile} containing the new profile picture
	 * @return the accessible URL of the stored profile picture
	 * @throws ResponseStatusException if:
	 *         <ul>
	 *             <li>The user is not found (HTTP 404)</li>
	 *             <li>The uploaded file is empty (HTTP 400)</li>
	 *             <li>The original filename is invalid (HTTP 400)</li>
	 *             <li>There is an I/O error while saving the file (HTTP 500)</li>
	 *         </ul>
	 */
	@Override
	public String updateProfileLocal(Long userId, MultipartFile file) {
		// Log the beginning of the operation
	    LOGGER.info("Received request to update profile picture for userId={}", userId);

	    // Retrieve user from database
	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> {
	                LOGGER.warn("User with ID {} not found", userId);
	                return new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
	            });

	    // Validate that file is not empty
	    if (file.isEmpty()) {
	        LOGGER.warn("Empty file received for userId={}", userId);
	        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is empty");
	    }
		try {
	        // Determine folder to store profile images
	        String uploadDir = System.getProperty("user.dir") + "/images/profile";
	        File dir = new File(uploadDir);
	        if (!dir.exists()) {
	            boolean created = dir.mkdirs();
	            LOGGER.info("Created directory {}: {}", uploadDir, created);
	        }

	        // Validate original filename
	        String originalName = file.getOriginalFilename();
	        if (originalName == null || !originalName.contains(".")) {
	            LOGGER.warn("Invalid file name received: {}", originalName);
	            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
	        }

	        // Extract file extension
	        String extension = originalName.substring(originalName.lastIndexOf("."));

	        // Generate unique filename per user
	        String fileName = "user_" + userId + extension;
	        File destination = new File(dir, fileName);

	        // Save file to disk
	        file.transferTo(destination);
	        LOGGER.info("Profile picture saved to {}", destination.getAbsolutePath());

	        // Generate accessible URL (Spring serves /images statically)
	        String profileUrl = "http://localhost:8080/images/profile/" + fileName;

	        // Update user with profile URL
	        user.setProfile(profileUrl);
	        userRepository.save(user);
	        LOGGER.info("Updated profile URL for userId={} to {}", userId, profileUrl);

	        return profileUrl;

	    } catch (IOException e) {
	        LOGGER.error("Failed to save profile picture for userId={}", userId, e);
	        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save file", e);
	    }
	}

}
