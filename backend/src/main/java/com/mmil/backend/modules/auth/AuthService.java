package com.mmil.backend.modules.auth;

import com.mmil.backend.modules.auth.dto.AuthResponse;
import com.mmil.backend.modules.auth.dto.LoginRequest;
import com.mmil.backend.modules.auth.dto.SignupRequest;
import com.mmil.backend.modules.user.User;
import com.mmil.backend.modules.user.UserRepository;
import com.mmil.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthOtpService authOtpService;

    public AuthService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService, 
                       AuthenticationManager authenticationManager,
                       AuthOtpService authOtpService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.authOtpService = authOtpService;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("student"); // Default role

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user);
    }

    public void sendPasswordResetOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("No account found with that email");
        }
        authOtpService.sendPasswordResetOtp(email);
    }

    public void resetPassword(String email, String otp, String newPassword) {
        if (!authOtpService.verifyOtp(email, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
