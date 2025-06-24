package com.Anoushka.Bakery.Controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Anoushka.Bakery.JwtUtil;
import com.Anoushka.Bakery.DTO.CartIdRequest;
import com.Anoushka.Bakery.Models.Cart;
import com.Anoushka.Bakery.Models.User;
import com.Anoushka.Bakery.Repositories.CartRepository;
import com.Anoushka.Bakery.Repositories.UserRepository;
import com.Anoushka.Bakery.Services.CartService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired private CartService cartService;
    @Autowired private UserRepository userRepo;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private CartRepository cartRepo;

    private User getUserFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtUtil.extractEmail(token); 
            return userRepo.findByEmailIgnoreCase(email);
               
        }

        throw new RuntimeException("Unauthorized");
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            HttpServletRequest request,
            @RequestParam int itemId,
            @RequestParam int weightPriceId,
            @RequestParam(defaultValue = "1") int quantity
    ) {
        User user = getUserFromRequest(request);
        Cart cart = cartService.addItemToCart(user, itemId, weightPriceId, quantity);
        return ResponseEntity.ok(cart);
    }
    
    @GetMapping
    public ResponseEntity<?> viewCart(HttpServletRequest request) {
        try {
            User user = getUserFromRequest(request);
            Optional<Cart> cartopt = cartRepo.findByUser(user);
            Cart cart=null;
            if(cartopt.isPresent()) cart=cartopt.get();
            System.out.println("Adding itemId: " + cart.getId() + " weightPriceId: "  + " quantity: " + user.getEmail());
            return ResponseEntity.ok(cartService.getCartByUser(user));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch cart: " + e.getMessage());
        }
    }


    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(HttpServletRequest request) {
        User user = getUserFromRequest(request);
        cartService.clearCart(user);
        return ResponseEntity.ok("Cart cleared");
    }
    
    @PostMapping("/deleteItem")
    public ResponseEntity<String> deleteItemFromCart(
            @RequestBody CartIdRequest request,
            @RequestHeader("Authorization") String authHeader) {
        
        String email = jwtUtil.extractEmail(authHeader.substring(7));
        cartService.removeItemFromCart(email, request.getId());
        return ResponseEntity.ok("Item removed successfully");
    }
}
