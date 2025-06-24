package com.Anoushka.Bakery.Controllers;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import com.Anoushka.Bakery.JwtUtil;
import com.Anoushka.Bakery.DTO.LoginRequest;
import com.Anoushka.Bakery.DTO.RegisterRequest;
import com.Anoushka.Bakery.Models.User;
import com.Anoushka.Bakery.Services.EmailService;
import com.Anoushka.Bakery.Services.UserService;

@RestController
public class AuthController {

    private final AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil Jwtutil;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private EmailService emailservice;

    
    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
        	System.out.println("Attempting login for username: " + loginRequest.getEmail());
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            
            User user = userService.findbymail(loginRequest.getEmail());
            if(user==null || !user.isVerified()) {
            	return ResponseEntity.status(HttpStatus.FORBIDDEN).body("email not verified");
            }
            String token = Jwtutil.generatetoken(user);           
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
            
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
       
	
		// Check if email or username already exists
        if (userService.isEmailTaken(registerRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already taken.");
        }
        if (userService.isUsernameTaken(registerRequest.getUsername())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken.");
        }

        // Hash the password before saving it to the database
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());

        // Create a new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(hashedPassword);
        user.setRole("USER"); // You can set the role to a default value
        user.setName(registerRequest.getName());
        user.setPhone(registerRequest.getPhone());

        String verificationCode =  String.format("%06d", new java.util.Random().nextInt(999999));
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(10));
        user.setVerified(false);

        userService.save(user);

        
        emailservice.sendEmail(user.getEmail(), verificationCode);
        return ResponseEntity.ok().body("Registration successful. Please verify your email");
    }
    
    @PostMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String code = request.get("code");

        User user = userService.findbymail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid username or password.");
        }
        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid verification code.");
        }
        if (user.getVerificationCodeExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Verification code has expired.");
        }

        user.setVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiry(null);
        userService.save(user);

        return ResponseEntity.ok().body("Email verified successfully.");
    }
    
    @GetMapping("/name")
    public ResponseEntity<String> getNameFromToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String name = Jwtutil.extractName(token);
        return ResponseEntity.ok(name);
    }
    
    
    
}
