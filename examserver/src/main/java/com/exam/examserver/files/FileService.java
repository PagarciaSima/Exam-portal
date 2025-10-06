package com.exam.examserver.files;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.exam.examserver.model.exam.question.Question;
import com.exam.examserver.model.user.User;
import com.exam.examserver.repository.UserRepository;

@Service
public class FileService implements IFileService {

    @Autowired
    private UserRepository userRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(FileService.class);

    // ====== Constantes centralizadas ======
    private static final String LOCAL_BASE_URL = "http://localhost:8080";
    private static final String IMAGES_DIR = "images";
    private static final String PROFILE_DIR = "profile";
    private static final String USER_FILE_PREFIX = "user_";


    private static final String ERROR_USER_NOT_FOUND = "User not found";
    private static final String ERROR_EMPTY_FILE = "File is empty";
    private static final String ERROR_INVALID_FILE_NAME = "Invalid file name";
    private static final String ERROR_SAVE_FILE = "Could not save file";
    private static final String ERROR_DELETE_FILE = "Error deleting profile picture";

    // ====== Métodos ======
    @Override
    public String updateProfileLocal(Long userId, MultipartFile file) {
        LOGGER.info("Received request to update profile picture for userId={}", userId);

        User user = userRepository.findById(userId).orElseThrow(() -> {
            LOGGER.warn("User with ID {} not found", userId);
            return new ResponseStatusException(HttpStatus.NOT_FOUND, ERROR_USER_NOT_FOUND);
        });

        if (file.isEmpty()) {
            LOGGER.warn("Empty file received for userId={}", userId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ERROR_EMPTY_FILE);
        }

        try {
            // Directorio local
            Path uploadDir = Paths.get(System.getProperty("user.dir"), IMAGES_DIR, PROFILE_DIR);
            File dir = uploadDir.toFile();
            if (!dir.exists() && dir.mkdirs()) {
                LOGGER.info("Created directory {}", uploadDir);
            }

            // Validar nombre de archivo
            String originalName = file.getOriginalFilename();
            if (originalName == null || !originalName.contains(".")) {
                LOGGER.warn("Invalid file name received: {}", originalName);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ERROR_INVALID_FILE_NAME);
            }

            String extension = originalName.substring(originalName.lastIndexOf("."));
            String fileName = USER_FILE_PREFIX + userId + extension;
            File destination = uploadDir.resolve(fileName).toFile();

            // Guardar archivo
            file.transferTo(destination);
            LOGGER.info("Profile picture saved to {}", destination.getAbsolutePath());

            // URL pública
            String profileUrl = String.join("/", LOCAL_BASE_URL, IMAGES_DIR, PROFILE_DIR, fileName);

            user.setProfile(profileUrl);
            userRepository.save(user);
            LOGGER.info("Updated profile URL for userId={} to {}", userId, profileUrl);

            return profileUrl;

        } catch (IOException e) {
            LOGGER.error("Failed to save profile picture for userId={}", userId, e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ERROR_SAVE_FILE, e);
        }
    }

    @Override
    public void deleteProfileLocal(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, ERROR_USER_NOT_FOUND));

        if (user.getProfile() != null) {
            try {
                String profileUrl = user.getProfile();
                if (profileUrl.startsWith(LOCAL_BASE_URL)) {
                    String fileName = profileUrl.substring(profileUrl.lastIndexOf("/") + 1);
                    Path uploadDir = Paths.get(System.getProperty("user.dir"), IMAGES_DIR, PROFILE_DIR);
                    File file = uploadDir.resolve(fileName).toFile();

                    if (file.exists() && file.delete()) {
                        LOGGER.info("Deleted profile picture: {}", file.getAbsolutePath());
                    } else {
                        LOGGER.warn("Profile picture file not found or could not be deleted: {}",
                                file.getAbsolutePath());
                    }
                }

                user.setProfile(null);
                userRepository.save(user);

            } catch (Exception e) {
                LOGGER.error("Error deleting profile picture for userId={}", userId, e);
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, ERROR_DELETE_FILE);
            }
        }
    }
    
    /**
     * Saves the image file associated with a {@link Question} to the file system
     * and updates the {@link Question} entity with the relative image path.
     * <p>
     * The image is stored under <code>src/main/resources/static/images/questions</code>.
     * If the directory does not exist, it will be created automatically.
     * </p>
     *
     * @param question  the {@link Question} entity to which the image belongs
     * @param imageFile the {@link MultipartFile} containing the image to be saved;
     *                  may be {@code null} or empty
     * @throws IOException if an I/O error occurs while creating directories or writing the file
     */
    @Override
    public void createQuestionImageLocal(Question question, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            // Directory where images will be saved (inside project root /images/questions)
            Path uploadDir = Paths.get(System.getProperty("user.dir"), IMAGES_DIR, "questions");
            // Create directories if they do not exist
            Files.createDirectories(uploadDir);

            // Generate a unique file name to avoid collisions
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

            // Full path to the new image file
            Path filePath = uploadDir.resolve(fileName);

            // Write the image bytes to the target file
            Files.write(filePath, imageFile.getBytes());

            // Store the full URL in the Question entity (including localhost:8080)
            question.setImage(LOCAL_BASE_URL + "/images/questions/" + fileName);

            LOGGER.info("Saved image for question {} at {}", question.getQuesId(), filePath);
        }
    }



}
