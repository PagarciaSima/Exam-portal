package com.exam.examserver.controller;

import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.exam.examserver.model.dto.PasswordUpdateRequest;
import com.exam.examserver.model.dto.UserDto;
import com.exam.examserver.model.user.User;
import com.exam.examserver.model.userrole.UserRole;
import com.exam.examserver.service.IUserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
@Tag(name = "Users", description = "API for user management")
public class UserController {
    
    private IUserService userService;
    
    public UserController(IUserService userService) {
        this.userService = userService;
    }

    /**
     * Creates a new user in the system.
     * Assigns default roles before saving.
     * * @param user The User object containing details for the new user.
     * @return The created User object with assigned roles.
     */
    @Operation(
        summary = "Create a new user",
        description = "Creates a new user and assigns default roles",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "User created successfully",
                content = @Content(schema = @Schema(implementation = User.class))
            ),
            @ApiResponse(
                responseCode = "400",
                description = "Bad request. Invalid user data",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @PostMapping("/")
    public User createUser(@RequestBody User user) {
        Set<UserRole> userRoles = this.userService.asignDefaultRole(user);
        return this.userService.createUser(user, userRoles);
    }

    /**
     * Retrieves user details by their username.
     * * @param username The unique username of the user to retrieve.
     * @return A UserDto containing the user's public details.
     */
    @Operation(
        summary = "Get user by username",
        description = "Retrieves user details by username",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "User found",
                content = @Content(schema = @Schema(implementation = UserDto.class))
            ),
            @ApiResponse(
                responseCode = "404",
                description = "User not found",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @GetMapping("/{username}")
    public UserDto getUser(@PathVariable("username") String username) {
        User user = this.userService.getUser(username);
        return new UserDto(user);
    }

    /**
     * Deletes a user from the system by their ID.
     * * @param userId The ID of the user to delete.
     */
    @Operation(
        summary = "Delete a user",
        description = "Deletes a user by ID",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "User deleted successfully"
            ),
            @ApiResponse(
                responseCode = "404",
                description = "User not found",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable("userId") Long userId) {
        this.userService.deleteUser(userId);
    }

    /**
     * Updates the information for an existing user.
     * * @param userId The ID of the user to update.
     * @param updatedUser The User object containing the new details.
     * @return A UserDto with the updated user information.
     */
    @Operation(
        summary = "Update user information",
        description = "Updates the user information for the given ID",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "User updated successfully",
                content = @Content(schema = @Schema(implementation = UserDto.class))
            ),
            @ApiResponse(
                responseCode = "404",
                description = "User not found",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @PutMapping("/{userId}")
    public UserDto updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        User user = this.userService.updateUser(userId, updatedUser);
        return new UserDto(user);
    }

    /**
     * Updates the password for a specific user.
     * * @param userId The ID of the user whose password is to be updated.
     * @param request A PasswordUpdateRequest object containing the new password.
     * @return A ResponseEntity indicating the success or failure of the operation.
     */
    @Operation(
        summary = "Update user password",
        description = "Updates the password for a given user ID",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Password updated successfully",
                content = @Content(schema = @Schema(implementation = Map.class))
            ),
            @ApiResponse(
                responseCode = "404",
                description = "User not found",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @PatchMapping("/{userId}/password")
    public ResponseEntity<Map<String, String>> updatePassword(
            @PathVariable Long userId,
            @RequestBody PasswordUpdateRequest request) {

        userService.updatePassword(userId, request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    /**
     * Uploads a new profile picture for a given user.
     * * @param userId The ID of the user to upload the picture for.
     * @param file The MultipartFile containing the profile picture data.
     * @return A ResponseEntity with the URL of the uploaded profile picture or an error message.
     */
    @Operation(
        summary = "Upload profile picture",
        description = "Uploads a profile picture for a given user",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Profile picture uploaded successfully",
                content = @Content(schema = @Schema(implementation = Map.class))
            ),
            @ApiResponse(
                responseCode = "500",
                description = "Error uploading profile picture",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @PostMapping("/{userId}/profile")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String profileUrl = userService.updateProfilePicture(userId, file);
            return ResponseEntity.ok(Map.of("profileUrl", profileUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error uploading profile picture: " + e.getMessage()));
        }
    }

    /**
     * Deletes the existing profile picture for a given user.
     * * @param userId The ID of the user whose profile picture is to be deleted.
     * @return A ResponseEntity indicating the success or failure of the deletion.
     */
    @Operation(
        summary = "Delete profile picture",
        description = "Deletes the profile picture of a given user",
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Profile picture deleted successfully",
                content = @Content(schema = @Schema(implementation = Map.class))
            ),
            @ApiResponse(
                responseCode = "500",
                description = "Error deleting profile picture",
                content = @Content(schema = @Schema(implementation = Map.class))
            )
        }
    )
    @DeleteMapping("/{userId}/profile")
    public ResponseEntity<Map<String, String>> deleteProfilePicture(@PathVariable Long userId) {
        try {
            userService.deleteProfilePicture(userId);
            return ResponseEntity.ok(Map.of("message", "Profile picture deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error deleting profile picture: " + e.getMessage()));
        }
    }
}