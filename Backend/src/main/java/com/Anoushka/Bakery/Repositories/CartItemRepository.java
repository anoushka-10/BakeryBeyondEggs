package com.Anoushka.Bakery.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Anoushka.Bakery.Models.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
}