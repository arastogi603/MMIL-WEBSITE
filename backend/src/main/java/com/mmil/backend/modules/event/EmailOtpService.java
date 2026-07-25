package com.mmil.backend.modules.event;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class EmailOtpService {

    @Value("${brevo.api-key}")
    private String brevoApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    
    // Temporary in-memory cache for OTPs (email -> otp)
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    public void sendOtp(String toEmail) {
        String otp = generateOtp();
        otpCache.put(toEmail, otp);

        try {
            String url = "https://api.brevo.com/v3/smtp/email";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey);
            headers.set("accept", "application/json");

            Map<String, Object> body = new HashMap<>();
            
            // Sender info
            Map<String, String> sender = new HashMap<>();
            sender.put("name", "MMIL Hackathons");
            sender.put("email", "mmil.website@gmail.com");
            body.put("sender", sender);
            
            // Recipient info
            Map<String, String> recipient = new HashMap<>();
            recipient.put("email", toEmail);
            body.put("to", List.of(recipient));
            
            body.put("subject", "MMIL Team Registration OTP");
            body.put("htmlContent", "<html><body><h3>Hello,</h3><p>Your OTP for team registration is: <b style='font-size:20px; color:#2563eb;'>" + otp + "</b></p><p>This code will expire soon. Do not share this code with anyone.</p><br><p>Best regards,<br>MMIL Team</p></body></html>");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            
            restTemplate.postForEntity(url, request, String.class);
            System.out.println("TEAM REGISTRATION OTP SENT SUCCESSFULLY TO: " + toEmail);
            
        } catch (Exception e) {
            System.out.println("=================================================");
            System.out.println("FAILED TO SEND EMAIL VIA REST API. IS BREVO_API_KEY CONFIGURED?");
            System.out.println("ERROR: " + e.getMessage());
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
