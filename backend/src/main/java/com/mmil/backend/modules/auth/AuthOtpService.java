package com.mmil.backend.modules.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthOtpService {

    @Value("${google.script-url}")
    private String googleScriptUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    
    // Temporary in-memory cache for OTPs (email -> otp)
    private final Map<String, String> otpCache = new ConcurrentHashMap<>();

    public void sendPasswordResetOtp(String toEmail) {
        String otp = generateOtp();
        otpCache.put(toEmail, otp);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("to", toEmail);
            body.put("subject", "MMIL Password Reset Code");
            body.put("body", "<html><body><h3>Hello,</h3><p>Your 4-digit code to reset your password is: <b>" + otp + "</b></p><p>If you did not request this, please ignore this email.</p><br><p>Thanks,<br>MMIL Team</p></body></html>");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            
            restTemplate.postForEntity(googleScriptUrl, request, String.class);
            System.out.println("GOOGLE SCRIPT EMAIL SENT SUCCESSFULLY TO: " + toEmail);
            
        } catch (Exception e) {
            String maskedUrl = (googleScriptUrl != null && googleScriptUrl.length() > 20) ? googleScriptUrl.substring(0, 20) + "..." : "NULL_OR_TOO_SHORT";
            System.out.println("=================================================");
            System.out.println("FAILED TO SEND EMAIL VIA GOOGLE SCRIPT. IS GOOGLE_SCRIPT_URL CONFIGURED?");
            System.out.println("URL LOADED INTO SPRING STARTS WITH: '" + maskedUrl + "'");
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
