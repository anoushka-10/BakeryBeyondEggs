package com.Anoushka.Bakery.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javamailsender;

    public void sendEmail(String to, String code) {
    	 String subject = "Email Verification for BakeryBeyondEggs";
         String msg = "Dear User,\n\n" +
                          "Thank you for registering with BakeryBeyondEggs. " +
                          "Please use the following verification code to verify your email address:\n\n" +
                          "Verification Code: " + code + "\n\n" +
                          "The code is valid for 10 minutes.\n\n" +
                          "Best regards,\nBakeryBeyondEggs Team";
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Email Verification Code");
        message.setText(msg);
        
        javamailsender.send(message);
    }
}
