package com.Anoushka.Bakery.Repositories;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Anoushka.Bakery.Models.Cart;
import com.Anoushka.Bakery.Models.User;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	User findByUsername(String username);
	User findByEmailIgnoreCase(String email);
	Optional<User> findByEmail(String userEmail);


	
	
}
