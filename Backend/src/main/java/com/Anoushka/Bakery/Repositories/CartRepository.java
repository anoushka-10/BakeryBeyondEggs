package com.Anoushka.Bakery.Repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Anoushka.Bakery.Models.Cart;
import com.Anoushka.Bakery.Models.CartItem;
import com.Anoushka.Bakery.Models.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByUser(User user);

}