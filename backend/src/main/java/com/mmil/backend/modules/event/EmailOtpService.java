package com.mmil.backend.modules.event;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailOtpService {

    private final JavaMailSender mailSender;
    
    // Temporary in-memory cache for OTPs (email -> otp)
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    public EmailOtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String toEmail) {
        String otp = generateOtp();
        otpCache.put(toEmail, otp);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Your MMIL Team Registration OTP");
            message.setText("Hello,\n\nYour OTP for team registration is: " + otp + "\n\nThis code will expire soon.");
            
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("=================================================");
            System.out.println("FAILED TO SEND EMAIL. IS GMAIL CONFIGURED IN PROPERTIES?");
            System.out.println("MOCK SENDING EMAIL TO: " + toEmail);
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
        int number = rnd.nextInt(999999);
        return String.format("%06d", number);
    }
}
