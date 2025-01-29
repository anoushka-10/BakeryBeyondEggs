package com.Anoushka.Bakery.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Anoushka.Bakery.Models.User;
import com.Anoushka.Bakery.Repositories.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userrepo;

    public void save(User user) {
        userrepo.save(user);
    }

    public boolean isEmailTaken(String email) {
        return userrepo.findByEmail(email) != null;
    }

    public boolean isUsernameTaken(String username) {
        return userrepo.findByUsername(username) != null;
    }

    public User findByUsername(String username) {
        return userrepo.findByUsername(username);
    }

	public User findbymail(String email) {
		// TODO Auto-generated method stub
		return userrepo.findByEmail(email);
	}
}
