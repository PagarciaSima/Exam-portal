package com.exam.examserver.controller;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.exam.examserver.model.dto.PasswordUpdateRequest;
import com.exam.examserver.model.user.User;
import com.exam.examserver.model.userrole.UserRole;
import com.exam.examserver.service.IUserService;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private IUserService userService;

    @InjectMocks
    private UserController userController;

    private ObjectMapper objectMapper;
    private User testUser;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        objectMapper = new ObjectMapper();

        // Setup test user
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setEmail("test@example.com");
        testUser.setPhone("123456789");
        testUser.setEnabled(true);
        testUser.setProfile("profile.jpg");

    }

    @Test
    void createUser_shouldReturnCreatedUser() throws Exception {
        // Arrange
        Set<UserRole> userRoles = new HashSet<>();
        when(userService.asignDefaultRole(any(User.class))).thenReturn(userRoles);
        when(userService.createUser(any(User.class), anySet())).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(post("/user/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.firstName").value("Test"))
                .andExpect(jsonPath("$.lastName").value("User"));

        verify(userService).asignDefaultRole(any(User.class));
        verify(userService).createUser(any(User.class), anySet());
    }

    @Test
    void getUser_shouldReturnUserDto() throws Exception {
        // Arrange
        when(userService.getUser("testuser")).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(get("/user/testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.firstName").value("Test"))
                .andExpect(jsonPath("$.lastName").value("User"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userService).getUser("testuser");
    }

    @Test
    void deleteUser_shouldCallService() throws Exception {
        // Arrange
        doNothing().when(userService).deleteUser(1L);

        // Act & Assert
        mockMvc.perform(delete("/user/1"))
                .andExpect(status().isOk());

        verify(userService).deleteUser(1L);
    }

    @Test
    void updateUser_shouldReturnUpdatedUserDto() throws Exception {
        // Arrange
        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setUsername("updateduser");
        updatedUser.setFirstName("Updated");
        updatedUser.setLastName("User");
        updatedUser.setEmail("updated@example.com");

        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(updatedUser);

        // Act & Assert
        mockMvc.perform(put("/user/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("updateduser"))
                .andExpect(jsonPath("$.firstName").value("Updated"))
                .andExpect(jsonPath("$.lastName").value("User"));

        verify(userService).updateUser(eq(1L), any(User.class));
    }

    @Test
    void updatePassword_shouldReturnSuccessMessage() throws Exception {
        // Arrange
        PasswordUpdateRequest request = new PasswordUpdateRequest();
        request.setNewPassword("newPassword123");

        doNothing().when(userService).updatePassword(1L, "newPassword123");

        // Act & Assert
        mockMvc.perform(patch("/user/1/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password updated successfully"));

        verify(userService).updatePassword(1L, "newPassword123");
    }

    @Test
    void uploadProfilePicture_shouldReturnProfileUrl() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "profile.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        when(userService.updateProfilePicture(eq(1L), any())).thenReturn("http://example.com/profile.jpg");

        // Act & Assert
        mockMvc.perform(multipart("/user/1/profile")
                .file(file)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.profileUrl").value("http://example.com/profile.jpg"));

        verify(userService).updateProfilePicture(eq(1L), any());
    }

    @Test
    void uploadProfilePicture_shouldReturnErrorOnFailure() throws Exception {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "profile.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        when(userService.updateProfilePicture(eq(1L), any()))
                .thenThrow(new RuntimeException("Upload failed"));

        // Act & Assert
        mockMvc.perform(multipart("/user/1/profile")
                .file(file)
                .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Error uploading profile picture: Upload failed"));

        verify(userService).updateProfilePicture(eq(1L), any());
    }

    @Test
    void deleteProfilePicture_shouldReturnSuccessMessage() throws Exception {
        // Arrange
        doNothing().when(userService).deleteProfilePicture(1L);

        // Act & Assert
        mockMvc.perform(delete("/user/1/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Profile picture deleted successfully"));

        verify(userService).deleteProfilePicture(1L);
    }

    @Test
    void deleteProfilePicture_shouldReturnErrorOnFailure() throws Exception {
        // Arrange
        doThrow(new RuntimeException("Delete failed")).when(userService).deleteProfilePicture(1L);

        // Act & Assert
        mockMvc.perform(delete("/user/1/profile"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("Error deleting profile picture: Delete failed"));

        verify(userService).deleteProfilePicture(1L);
    }
}