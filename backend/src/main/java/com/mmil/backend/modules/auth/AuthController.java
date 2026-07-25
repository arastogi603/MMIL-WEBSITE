package com.mmil.backend.modules.auth;

import com.mmil.backend.modules.auth.dto.AuthResponse;
import com.mmil.backend.modules.auth.dto.LoginRequest;
import com.mmil.backend.modules.auth.dto.SignupRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    public record ForgotPasswordRequest(String email) {}

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.sendPasswordResetOtp(request.email());
        return ResponseEntity.ok().build();
    }

    public record ResetPasswordRequest(String email, String otp, String newPassword) {}

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.email(), request.otp(), request.newPassword());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<com.mmil.backend.modules.user.User> getMe(java.security.Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        try {
            return ResponseEntity.ok(authService.getUserByEmail(principal.getName()));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}
