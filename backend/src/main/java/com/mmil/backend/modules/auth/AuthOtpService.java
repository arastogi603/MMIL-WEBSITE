package com.mmil.backend.modules.auth;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthOtpService {

    private final JavaMailSender mailSender;
    
    // Temporary in-memory cache for OTPs (email -> otp)
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    public AuthOtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetOtp(String toEmail) {
        String otp = generateOtp();
        otpCache.put(toEmail, otp);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("MMIL Password Reset Code");
            message.setText("Hello,\n\nYour 4-digit code to reset your password is: " + otp + "\n\nIf you did not request this, please ignore this email.\n\nThanks,\nMMIL Team");
            
            mailSender.send(message);
            System.out.println("PASSWORD RESET EMAIL SENT SUCCESSFULLY TO: " + toEmail);
        } catch (Exception e) {
            System.out.println("=================================================");
            System.out.println("FAILED TO SEND EMAIL. IS GMAIL CONFIGURED IN PROPERTIES?");
            System.out.println("ERROR: " + e.getMessage());
            System.out.println("MOCK SENDING PASSWORD RESET EMAIL TO: " + toEmail);
            System.out.println("OTP: " + otp);
            System.out.println("=================================================");
        }
    }

    public boolean verifyOtp(String email, String submittedOtp) {
        String realOtp = otpCache.get(email);
        if (realOtp != null && realOtp.equals(submittedOtp)) {
            otpCache.remove(email); // consume OTP
            return true;
        }
        return false;
    }

    private String generateOtp() {
        Random rnd = new Random();
        int number = rnd.nextInt(10000); // 0 to 9999
        return String.format("%04d", number);
    }
}
