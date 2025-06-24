package com.Anoushka.Bakery.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Anoushka.Bakery.Models.CartItem;

import jakarta.transaction.Transactional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

	int deleteByIdAndCartId(int cartItemId, int id);

	@Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.id = :cartItemId AND ci.cart.user.email = :email")
    int deleteCartItemSafely(@Param("cartItemId") int cartItemId, @Param("email") String email);
}