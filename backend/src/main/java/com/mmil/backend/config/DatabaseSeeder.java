package com.mmil.backend.config;

import com.mmil.backend.modules.user.User;
import com.mmil.backend.modules.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseSeeder {

    @Bean
    public CommandLineRunner seedDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Always ensure the Master Admin exists and credentials are valid
            User admin = userRepository.findByEmail("admin@mmil.com").orElse(new User());
            
            admin.setName("System Admin");
            admin.setEmail("admin@mmil.com");
            // Force reset the password to admin123 so the user can definitely log in
            admin.setPasswordHash(passwordEncoder.encode("admin123")); 
            admin.setRole("admin");
            
            userRepository.save(admin);
            System.out.println("Master Admin account verified/reset: admin@mmil.com / admin123");
        };
    }
}
