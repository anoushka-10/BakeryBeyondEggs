package com.Anoushka.Bakery.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Anoushka.Bakery.UserPrincipal;
import com.Anoushka.Bakery.Models.User;
import com.Anoushka.Bakery.Repositories.UserRepository;

@Service
public class MyUserdetailservice implements UserDetailsService{
	
	@Autowired
	private UserRepository userrepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user= userrepo.findByUsername(username);
		if(user==null) {
		   System.out.println("User Not Found");
		   throw new UsernameNotFoundException("User 404");
		   
		}
		return new UserPrincipal(user);
	}

	

}
