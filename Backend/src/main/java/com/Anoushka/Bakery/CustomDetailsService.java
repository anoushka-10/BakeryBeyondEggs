package com.Anoushka.Bakery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Anoushka.Bakery.Models.User;
import com.Anoushka.Bakery.Repositories.UserRepository;

@Service
public class CustomDetailsService implements UserDetailsService {

	@Autowired
	UserRepository userRepository;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		 System.out.println("Finding user by email: " + email);
	        
	        User user = userRepository.findByEmailIgnoreCase(email); // You MUST use email lookup here
	        if (user == null) {
	            System.out.println("User Not Found in DB: " + email);
	            throw new UsernameNotFoundException("User not found with email: " + email);
	        }
	        return new UserPrincipal(user); // your UserPrincipal implements UserDetails
	    }
	}

